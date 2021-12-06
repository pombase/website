#!/usr/bin/env perl

# generate component HTML from Markdown file and config

# run as:
#  etc/process-markdown.pl \
#     --markdown-docs src/docs \
#     --recent-news-component src/app/recent-news/recent-news.component.html \
#     --docs-component src/app/docs/docs.component.html \
#     --front-panel-content-component src/app/front-panel-content.html

use strict;
use warnings;
use Carp;
use Getopt::Long qw(GetOptions);
use File::Temp qw(tempfile);
use Text::CSV;
use Text::Trim qw(trim);

my $web_config_file_name = '';
my $data_files_dir = '';
my $doc_config_file_name = '';
my $json_docs_file_name = '';
my $markdown_docs = '';
my $recent_news_component = '';
my $docs_component = '';
my $front_page_content_component = '';

GetOptions(
  'web-config=s' => \$web_config_file_name,
  'data-files-dir=s' => \$data_files_dir,
  'doc-config=s' => \$doc_config_file_name,
  'json-docs=s' => \$json_docs_file_name,
  'markdown-docs=s' => \$markdown_docs,
  'recent-news-component=s' => \$recent_news_component,
  'docs-component=s' => \$docs_component,
  'front-panel-content-component=s' => \$front_page_content_component);

if (!$web_config_file_name || !$data_files_dir || !$doc_config_file_name ||
    !$markdown_docs || !$recent_news_component ||
    !$docs_component || !$front_page_content_component) {
  die "missing arg";
}

use JSON -support_by_pp;


open my $config_fh, '<', $web_config_file_name
  or die "can't open $web_config_file_name";
my $config_contents;
{
  local $/ = undef;
  $config_contents = <$config_fh>;
}
close $config_fh;

my $config = from_json $config_contents;


my $database_name = $config->{database_name};

my $load_organism_taxonid = $config->{load_organism_taxonid};
my $load_organism = undef;

for my $organism_config (@{$config->{organisms}}) {
  if ($organism_config->{taxonid} == $load_organism_taxonid) {
    $load_organism = $organism_config;
    last;
  }
}

if (!defined $load_organism) {
  die "can't find organism configuration for taxon ID $load_organism_taxonid " .
    "in $$web_config_file_name";
}


my %var_substitutions = (
  database_name => $database_name,
  lc_database_name => lc $database_name,
  genus => $load_organism->{genus},
  species => $load_organism->{species},
  genus_and_species => $load_organism->{genus} . ' ' . $load_organism->{species},
  species_abbrev => $load_organism->{common_name},
  ncbi_taxon_id => $load_organism->{taxonid},
  base_url => $config->{base_url},
  helpdesk_address => $config->{helpdesk_address},
);


process_front_panels();

our $date_re = qr|\d+-\d+-\d+|;


open my $recent_news_fh, '>', $recent_news_component
  or die "can't open $recent_news_component for writing\n";

open my $docs_component_fh, '>', $docs_component
  or die "can't open $docs_component for writing\n";

warn "writing to docs component: $docs_component\n";

my %section_titles = ();
my %sections = ();

opendir my $dir, $markdown_docs
  or die "can't open directory $markdown_docs\n";

for my $path (readdir $dir) {
  if ($path =~ /\w+/ && -d "$markdown_docs/$path") {
    # remove ".PomBase" from "news.PomBase/" etc.
    my $no_db_path = $path;
    if ($path =~ /\.(\w+)/) {
      if ($1 eq $database_name) {
        $no_db_path = $path =~ s/\.\w+//r;
      } else {
        # skip if this item is for a different DB
        next;
      }
    }

    opendir my $path_dir, "$markdown_docs/$path";
    for my $file_name (readdir $path_dir) {
      if ($file_name =~ m|^(.*?)(?:\.(\w+))?\.md$|) {
        my $name = $1;
        # remove ".PomBase" from MD file name
        my $no_db_name = $name;
        if (defined $2) {
          if ($2 ne $database_name) {
            # skip if this item is for a different DB
            next;
          }
        }

        $sections{$no_db_path}->{$no_db_name} = "$path/$file_name";
      }
    }
    close $path_dir;
  }
}

closedir $dir;

for my $path (keys %sections) {
  my $data = $sections{$path};

  next if $path eq 'news' or $path eq 'faq';  # menu and index are generated

  if (!$data->{index}) {
    die "no index for section: $path\n";
  } else {
    if (!$data->{menu}) {
      die "no menu for section: $path\n";
    }
  }
}

my %faq_questions = ();
my %faq_category_names = ();

my $data = $sections{faq};

my %faq_data = ();

sub make_id_from_heading {
  my $heading = shift;

  if (!$heading) {
    croak "no heading";
  }

  $heading =~ s/^#+\s*//;

  (my $id = lc $heading) =~ s/[^A-Za-z\._\d]+/-/g;

  $id =~ s/-(with|the|at|from|to|the|of|that|is|for|an|a|in)-/-/g for 1..5;
  $id =~ s/^(are|is)-//;

  $id =~ s/-+$//;
  $id =~ s/^-+//;

  if ($id =~ /^\d/) {
    # IDs can't start with a digit
    $id = "id-$id";
  }

  return $id;
}

my @json_solr_contents = ();

sub add_to_json {
  my ($path, $heading, $content) = @_;

  $content =~ s/<!--.*?-->//;

  push @json_solr_contents, {
    id => $path,
    heading => $heading,
    content => $content,
  };
}


sub table_to_html
{
  my $column_names_ref = shift;
  my @column_names = @$column_names_ref;
  my $rows_ref = shift;
  my @rows = @$rows_ref;

  my @res = ();

  my $gene_column = undef;
  my $ref_column = undef;

  for (my $i = 0; $i < @column_names; $i++) {
    my $lc_col_name = lc $column_names[$i];
    if ($lc_col_name eq 'gene' || $lc_col_name =~ /^systematic.id$/) {
      $gene_column = $i;
    } else {
      if ($lc_col_name eq 'reference') {
        $ref_column = $i;
      }
    }
  }

  push @res, '<table><thead><tr>';

  push @res, (join '', map { '<th>' . ucfirst $_ . '</th>' } @column_names);
  push @res, '</thead>';

  for my $row (@rows) {
    my $line = '<tr>';

    for (my $i = 0; $i < @column_names; $i++) {
      my $col_entry = $row->[$i];

      if (defined $col_entry) {
        $line .= '<td>';
        if (defined $gene_column && $i == $gene_column) {
          $line .= "<a routerLink='/gene/$col_entry'>$col_entry</a>";
        } else {
          if (defined $ref_column && $i == $ref_column) {
            $line .=
              $col_entry =~ s|PMID:(\d+)|<a href='http://www.ncbi.nlm.nih.gov/pubmed?term=$1'>PMID:$1</a>|gr;
          } else {
            if (length $col_entry > 20) {
              $col_entry =~ s/(,|\.\.)/$1<wbr>/g;
            }

            $line .= $col_entry;
          }
        }
        $line .= '</td>';
      }
    }

    $line .= '</tr>';

    push @res, $line;
  }

  push @res, '</table>';

  return @res;
}


sub read_table
{
  my $file_name = shift;

  my $full_file_name = "$data_files_dir/$file_name";

  open my $fh, '<', $full_file_name or die "can't open $full_file_name";

  my $sep = undef;

  if ($file_name =~ /\.csv$/) {
    $sep = ',';
  } else {
    if ($file_name =~ /\.tsv$/) {
      $sep = "\t";
    } else {
      die "unknown file type for $file_name";
    }
  }

  my $csv = Text::CSV->new({ sep_char => $sep, allow_loose_quotes => 1 });

  $csv->header ($fh, { sep_set => [ $sep ], });

  my @rows = ();

  while (my $row = $csv->getline($fh)) {
    push @rows, $row;
  }

  return ([$csv->column_names()], \@rows);
}


sub lines_from_file
{
  my $file_name = shift;

  my @lines = ();

  open my $fh, '<', $file_name or die "can't open $file_name";

  my $in_raw_html_block = 0;

  my $current_db_block = undef;
  my $current_db_block_start_line = undef;

  while (defined (my $line = <$fh>)) {
    $line =~ s/\$\{(\w+)\}/substitute_vars($1, \$line)/ge;

    if ($. == 1 && $line =~ /^#/) {
      chomp $line;
      (my $sect_id = $line) =~ s/^#+\s*(.*?)\??$/make_id_from_heading($1)/e;

      $line .= " {#$sect_id}\n";
    }

    if ($line =~ /^%%/) {
      chomp $line;
      $line =~ s/\s+$//;
      if ($line =~ /^\%\%\s*(if|end) db=\s*(.*?)$/) {
        if ($1 eq 'if') {
          $current_db_block = $2;
          $current_db_block_start_line = $.;
        } else {
          if (defined $current_db_block) {
            if ($current_db_block eq $2) {
              $current_db_block = undef;
              $current_db_block_start_line = undef;
            } else {
              die qq|"$line" at $file_name line $.\n| .
                qq|does not match directive "%%if db=$current_db_block" | .
                "at line $current_db_block_start_line\n";
            }
          } else {
            die qq|"$line" does not match a start directive at | .
              "$file_name line $.\n";
          }
        }
        next;
      } else {
        if ($line =~ /^\%\%table file=(\S+)/) {
          my ($column_names, $rows) = read_table($1);

          my @html_lines = table_to_html($column_names, $rows);

          for my $line (@html_lines) {
            push @lines, "$line\n";
          }

          next;
      } else {
          die "mangled directive: $line\n";
        }
      }
    }

    if (defined $current_db_block && $current_db_block ne $database_name) {
      next;
    }

    if ($line eq "\`\`\`{=html}\n") {
      $in_raw_html_block = 1;
    } else {
      if ($in_raw_html_block && $line eq "```\n") {
        $in_raw_html_block = 0;
      }
    }
    process_line(\$line, $in_raw_html_block);

    push @lines, $line;
  }

  close $fh;

  return @lines;
}

my $all_questions_category = 'All Frequently Asked Questions';

while (my ($id, $file_name) = each %{$sections{faq}}) {
  if ($id eq 'index') {
    next;
  }

  my $heading = undef;
  my $id = undef;

  my @categories = ($all_questions_category);
  my $contents = "";

  my @lines = lines_from_file("$markdown_docs/$file_name");

  map {
    my $line = $_;
    $contents .= $line;
    if (!$heading && $line =~ /^#\s*(.*?)\s*\{#(.*)\}\s*$/) {
      $heading = $1;
      $id = $2;
    } else {
      if ($line =~ /<!-- pombase_categories:\s*(.*?)\s*-->/) {
        push @categories, map {
          s/^\s+//;
          s/\s+$//;
          $_;
        } split /,/, $1;
      }
    }
  } @lines;

  if (!$heading) {
    croak "no heading in $file_name";
  }

  for my $category_name (@categories) {
    my $category_id = make_id_from_heading($category_name);
    $faq_category_names{$category_id} = $category_name;
    push @{$faq_data{$category_id}}, { id => $id, heading => $heading };
  }

  $contents =~ s/^#/###/gm;

  $faq_questions{$id} = { heading => $heading,
                          contents => $contents,
                          categories => \@categories };

  my $path = "faq/$id";

  add_to_json($path, $heading, $contents);
}

while (my ($category_name, $questions) = each %faq_data) {
  @{$faq_data{$category_name}} =
    sort {
      $a->{heading} cmp $b->{heading};
    } @{$faq_data{$category_name}};
}

$faq_data{index} = 'faq/index.md';

$sections{faq} = \%faq_data;

print $docs_component_fh qq|<div class="docs">\n<app-social-contact></app-social-contact>\n|;

for my $path (sort keys %sections) {
  process_path($path);
}

print $docs_component_fh "</div>\n";

close $recent_news_fh;
close $docs_component_fh;

open my $doc_config_fh, '>', $doc_config_file_name
  or die "can't open $doc_config_file_name: $!\n";

warn "writing to config JSON file: $doc_config_file_name\n";
print $doc_config_fh to_json({ pages => \%section_titles }, { canonical => 1, pretty => 1 } );

close $doc_config_fh;

sub process_front_panels {
  my $panel_conf = $config->{front_page_panels};

  open my $panel_contents_comp_fh, '>', $front_page_content_component
    or die "can't open $front_page_content_component";
  warn "writing to panel component: $front_page_content_component\n";

  for (my $i = 0; $i < @{$panel_conf}; $i++) {
    my $this_conf = $panel_conf->[$i];
    my $internal_id = $i;
    print $panel_contents_comp_fh qq|<div *ngIf="panelId == $internal_id">\n|;

    my $content = $this_conf->{content};
    for my $content_line (split /\n/, $content) {
      process_line(\$content_line);
      print $panel_contents_comp_fh markdown($content_line, "front_panel:" . $this_conf,
                                             'html'), "\n";
    }
    print $panel_contents_comp_fh "</div>\n";
  }

  close $panel_contents_comp_fh;
}

sub get_all_faq_parts {
  my $faq_questions = shift;

  my $ret = "";

  my @ids = sort keys %$faq_questions;

  for my $id (@ids) {
    my $details = $faq_questions->{$id};
    my $heading = $details->{heading};
    my $contents = $details->{contents};
    my @categories = @{$details->{categories}};

    my $path = "faq/$id";

    $section_titles{$path} = $heading;

    my $categories_condition =
      join " || ", map {
        "pageName == '" . make_id_from_heading($_) . "'";
      } (@categories, $id);

    $categories_condition .= q( || pageName == 'all-faqs');

    (my $fixed_heading = $heading) =~ s/[\'\*]//g;
    $fixed_heading =~ s/"/&quot;/g;

    $ret .= qq|<div (click)="faq_navigate(\$event, '/faq/$id', '$fixed_heading')" *ngIf="$categories_condition">\n|;
    $ret .= markdown($contents, $path, 'html') . "\n";
    $ret .= "</div>\n";
  }

  return $ret;
}

sub make_news_thumbnail
{
  my $item = shift;

  return qq|<img loading="lazy" class="newsfeed-thumbnail" src="/assets/newsfeed/$item->{thumbnail}"/>|;
}

sub process_path {
  my $path = shift;

  my $data = $sections{$path};

  print $docs_component_fh qq|<div *ngIf="section == '$path'">\n|;

  my $menu_title = (ucfirst $path) =~ s/-/ /gr;
  $menu_title = 'FAQ' if $menu_title =~ /faq/i;
  print $docs_component_fh qq|<app-page-contents-menu title="$menu_title" titleRoute="/$path">\n|;

  my $menu_content = contents_for_template("$path/menu", $data->{menu});

  print $docs_component_fh "\n$menu_content\n";
  print $docs_component_fh "</app-page-contents-menu>\n";

  print $docs_component_fh qq|  <div class="docs-content">\n|;

  for my $page_name (sort keys %$data) {
    next if $page_name eq "menu";
    (my $no_date_page_name = $page_name) =~ s/^$date_re-(.*)/$1/;
    print $docs_component_fh qq|  <div *ngIf="pageName == '$no_date_page_name'">\n|;
    if (ref $data->{$page_name}) {
      my $category_id = $page_name;
      # faq:
      my $category_name = $faq_category_names{$category_id};
      print $docs_component_fh markdown("## $category_name", "$path/$page_name", 'html'), "\n";
    } else {
      my $contents = contents_for_template("$path/$page_name", $data->{$page_name});

      if ($contents =~ /^#+\s*(.*?)\s*(:?\{#(.*)\}\s*)?$/m) {
        my $page_title = $1;
        $page_title =~ s/\*//g;
        $section_titles{"$path/$page_name"} = $page_title;
        if ($page_name eq 'index') {
          $section_titles{$path} = $page_title;
        }

        add_to_json("$path/$page_name", $page_title, $contents);
      } else {
        die "can't find header in: $contents\n";;
      }

      print $docs_component_fh markdown($contents, "$path/$page_name", 'html' ), "\n";
    }
    print $docs_component_fh qq|  </div>\n|;
  }

  if ($path eq 'faq') {
    print $docs_component_fh get_all_faq_parts(\%faq_questions);
  }

  print $docs_component_fh qq|  </div>\n|;
  print $docs_component_fh qq|</div>\n|;

  if ($path eq 'news') {
    my @all_news_items = all_news_items();
    my @news_summary = ();
    if (@all_news_items > 0) {
      @news_summary = grep {
        $_->{flags} && $_->{flags}->{frontpage};
      } @all_news_items;
    } else {
      warn "warning: no news";
      @news_summary = ();
    }

    print $recent_news_fh qq|<div class="recent-news">\n|;
    for my $item (@news_summary) {
      print $recent_news_fh qq|<div class="news-item">\n|;
      if ($item->{thumbnail}) {
        print $recent_news_fh make_news_thumbnail($item) . "\n";
      }
      my $md = '';
      $md .= '#### **' . $item->{title} . "**\n\n";
      $md .= '*' . $item->{date} . "*\n";
      $md .= $item->{contents} . "\n";
      print $recent_news_fh markdown($md, "news:" . $item->{title}, 'html'), "\n";
      print $recent_news_fh qq|</div>\n|;
    }
    print $recent_news_fh qq|
<div id="archive-link"><a routerLink="/news/">News archive ...</a></div>\n</div>\n
|;
  }
}

sub markdown {
  my $md = shift;
  my $id_for_debugging = shift;
  my $output_type = shift // 'html';

  local $/ = undef;

  my ($temp_fh, $temp_filename) = tempfile('/tmp/process-markdown-XXXXXXXXXX');

  print $temp_fh $md;

  close $temp_fh;

  my $pandoc_command =
    "pandoc --columns 1000 -f markdown-markdown_in_html_blocks+link_attributes+auto_identifiers+implicit_header_references+header_attributes " .
    "-t $output_type $temp_filename";

  open my $pandoc_pipe, "$pandoc_command 2> $temp_filename.err|"
    or die "Couldn't open a pipe from pandoc: $!";

  my $html = <$pandoc_pipe>;

  close $pandoc_pipe;

  open my $err_fh, '<', "$temp_filename.err" or
    die "can't open error output from pandoc: $!\n";

  my $errors = <$err_fh>;

  warn "warning when processing ", ($id_for_debugging ? "$id_for_debugging " : ''),
    "with pandoc:\n", $errors if $errors;

  close $err_fh;

  unlink "$temp_filename";
  unlink "$temp_filename.err";

  return $html;
}


sub angular_link {
  my $title = shift;
  my $path = shift;

  $path =~ s/\.md$//;

  if ($path =~ /\.(?:png|gif|pdf)($|\s)/ ||
    $path =~ /^mailto:/) {
    return "[$title]($path)";
  }

  if ($path =~ /^(https?|ftp):/) {
    return qq|<a href="$path">$title</a>|;
  } else {
    $path =~ s|^/+||;
    return qq|<a routerLink="/$path">$title</a>|;
  }
}

sub substitute_vars {
  my $var_name = shift;
  my $line_ref = shift;

  if (exists $var_substitutions{$var_name}) {
    return $var_substitutions{$var_name};
  } else {
    die qq|unknown variable "$var_name" in line: |, $$line_ref, "\n";
  }
}

sub process_line {
  my $line_ref = shift;
  my $quote_angular_elements = !shift;

  $$line_ref =~ s/\$\{(\w+)\}/substitute_vars($1, $line_ref)/ge;

  $$line_ref =~ s/\[([^\]]+)\]\(([^\)]+)\)/angular_link($1, $2)/ge;
  if ($$line_ref !~ /<!--.*-->/) {
    if ($quote_angular_elements) {
      $$line_ref =~ s|(<app-[^>]+>)|`$1`{=html}|g;
    }
  }
}

sub all_news_items {
  my @items = ();
  my $news_dir_name = "$markdown_docs/news.$database_name";
  opendir my $dh, $news_dir_name
    or die "can't open directory $news_dir_name for reading: $!";
 ITEM:
  while (my $dir_file_name = readdir($dh)) {
    if ($dir_file_name =~ /^(($date_re)-.*)\.md$/) {
      my $news_date = $2;
      my $page_name = $1;
      my $title = undef;
      my $id = undef;
      my $contents = '';
      my %flags = ();
      my $thumbnail = undef;
      open my $this_file, '<', "$news_dir_name/$dir_file_name" or die "can't open $dir_file_name";
      while (defined (my $line = <$this_file>)) {
        if (!defined $title && $line =~ /^#+\s*(.*?)\s*$/) {
          $title = $1;
          $id = make_id_from_heading($title);
        } else {
          if ($line =~ /^\s*<!-- pombase_flags:\s*(.*?)\s*-->\s*$/) {
            next ITEM if $1 eq 'draft';
            $flags{$1} = 1;
          } else {
            if ($line =~ /^\s*<!-- newsfeed_thumbnail:\s*(.*?)\s*-->\s*$/) {
              $thumbnail = $1;
            } else {
              process_line(\$line);
              $contents .= $line;
            }
          }
        }
      }
      close $this_file;

      push @items, {
        title => $title,
        id => $id,
        page_name => $page_name,
        contents => $contents,
        date => $news_date,
        flags => \%flags,
        thumbnail => $thumbnail,
      };
    }
  }

  return sort {
    $b->{date} cmp $a->{date};  # reverse sort
  } @items;
}

sub contents_for_template {
  my $path = shift;
  my $details = shift;  # could be a file name

  my $ret = "";

  if ($path =~ m[^news/(index|menu)$]) {
    my @all_news_items = all_news_items();

    if ($path eq 'news/menu') {
      for my $item (@all_news_items) {
        $ret .= qq|<div class="left-menu-part left-menu-item"><a pageScroll href="#| . $item->{id} . '">' . $item->{title} . qq|</a></div>\n|;
      }
    } else {
      $ret .= "## News archive";
      $ret .= qq|\n<div class="news-archive">\n|;
      my @rev_items = @all_news_items;
      for my $item (@rev_items) {
        $ret.= qq|\n<div id="$item->{page_name}" class="news-item">\n|;
        if ($item->{thumbnail}) {
          $ret .= make_news_thumbnail($item) . "\n\n";
        }
        $ret .= '### ' . $item->{title} . ' {#' . $item->{id} . "}\n\n";
        $ret .= '*' . $item->{date} . "*\n";
        $ret .= $item->{contents} . "\n";;
        $ret .= qq|\n</div>\n|;
      }
      $ret .= qq|\n</div>\n|;
    }
  } else {
    if ($path =~ m[^faq/menu]) {
      my $all_questions_category_id = make_id_from_heading($all_questions_category);

      my @categories = sort {
        if ($a eq $all_questions_category_id) {
          1;
        } else {
          if ($b eq $all_questions_category_id) {
            -1;
          } else {
            $a cmp $b;
          }
        }
      } keys %{$sections{faq}};

      for my $category_id (@categories) {
        next if $category_id eq 'index';
        my $category_name = $faq_category_names{$category_id};
        $ret .= qq|<div class="left-menu-part left-menu-item"><a routerLink="/faq/$category_id">$category_name</a></div>\n|
      }
    } else {
      if (ref $details) {
        # add faq menu here
      } else {
        my $details_file_name = "$markdown_docs/$details";

        my @lines = lines_from_file($details_file_name);

        $ret .= join '', @lines;
      }
    }
  }

  return $ret;
}

open my $json_docs_fh, '>', $json_docs_file_name
  or die "can't open $json_docs_file_name for writing\n";

my @sorted_json_solr_contents =
  sort {
    $a->{id} cmp $b->{id};
  } @json_solr_contents;

sub markdown_to_plain
{
  my $content = shift;
  my $title_for_debugging = shift;

  # remove Angular elements
  $content =~ s!<(app-[\w\-]+).*?>(.*?)</\1>!$2!gs;

  my $plain_text;

  if (length $content < 200 && $content =~ /^[a-z\s\?\"\-,\.\d:\%]+$/i) {
    # shortcut for headings with no Markdown
    $plain_text = $content;
  } else {
    $plain_text = markdown($content, $title_for_debugging, 'plain');
  }

  # remove some noise
  $plain_text =~ s!\{.*?\}!!g;
  $plain_text =~ s!([\-=])+!$1!g;
  $plain_text =~ s!(\s\s)\s+!$1!g;
  $plain_text =~ s!_([\.,\s]|$)!$1!g;
  $plain_text =~ s!(^|[\.,\s])_!$1!g;

  return $plain_text
}

map {
  my $plain_heading = markdown_to_plain($_->{heading}, $_->{heading});
  $_->{heading} = $plain_heading;
  $_->{content} = markdown_to_plain($_->{content}, $_->{heading});
  # remove heading
  $_->{content} =~ s/\Q$plain_heading//g;
} @sorted_json_solr_contents;

# remove empty contents
@sorted_json_solr_contents =
  grep {
    $_->{content} =~ /\w/;
  } @sorted_json_solr_contents;

print $json_docs_fh to_json(\@sorted_json_solr_contents, { canonical => 1, pretty => 1 } );

close $json_docs_fh or die;

