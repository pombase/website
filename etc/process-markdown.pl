#!/usr/bin/env perl

# generate component HTML from Markdown file and config

# run as:
#  (cd frontend/src/docs; etc/process-markdown.pl \
#     --markdown-docs src/docs \
#     --recent-news-component src/app/recent-news/recent-news.component.html \
#     --docs-component src/app/docs/docs.component.html \
#     --front-panel-content-component src/app/front-panel-content.html)

use strict;
use warnings;
use Carp;
use Getopt::Long qw(GetOptions);

my $web_config = '';
my $doc_config_file_name = '';
my $json_docs_file_name = '';
my $markdown_docs = '';
my $recent_news_component = '';
my $docs_component = '';
my $front_page_content_component = '';

GetOptions(
  'web-config=s' => \$web_config,
  'doc-config=s' => \$doc_config_file_name,
  'json-docs=s' => \$json_docs_file_name,
  'markdown-docs=s' => \$markdown_docs,
  'recent-news-component=s' => \$recent_news_component,
  'docs-component=s' => \$docs_component,
  'front-panel-content-component=s' => \$front_page_content_component);

if (!$web_config || !$doc_config_file_name || !$markdown_docs || !$recent_news_component ||
    !$docs_component || !$front_page_content_component) {
  die "missing arg";
}

use JSON -support_by_pp;
use Pandoc;

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
    opendir my $path_dir, "$markdown_docs/$path";
    for my $file_name (readdir $path_dir) {
      if (my ($name) = $file_name =~ m|(.*)\.md$|) {
        $sections{$path}->{$name} = "$path/$file_name";
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

  (my $id = lc $heading) =~ s/[^A-Za-z\._]+/-/g;

  $id =~ s/-(with|the|at|from|to|the|of|that|is|for|an|a|in)-/-/g for 1..5;
  $id =~ s/^(are|is)-//;

  $id =~ s/-+$//;
  $id =~ s/^-+//;

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

my $all_questions_category = 'All Frequently Asked Questions';

while (my ($id, $file_name) = each %{$sections{faq}}) {
  if ($id eq 'index') {
    next;
  }

  open my $fh, '<', "$markdown_docs/$file_name" or die "can't open $file_name";
  my $heading = undef;
  my @categories = ($all_questions_category);
  my $contents = "";
  while (defined (my $line = <$fh>)) {
    $contents .= $line;
    if (!$heading && $line =~ /^#\s*(.*)/) {
      $heading = $1;
    } else {
      if ($line =~ /<!-- pombase_categories:\s*(.*?)\s*-->/) {
        push @categories, map {
          s/^\s+//;
          s/\s+$//;
          $_;
        } split /,/, $1;
      }
    }
  }

  if (!$heading) {
    croak "no heading in $file_name";
  }

  my $id = make_id_from_heading($heading);
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

  close $fh;
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
  open my $config_fh, '<', $web_config
    or die "can't open $web_config";
  local $/ = undef;
  my $config_contents = <$config_fh>;
  close $config_fh;

  my $config = from_json $config_contents;

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
      print $panel_contents_comp_fh markdown($content_line), "\n";
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

    my @split_contents = split /\n/, $contents;
    (my $sect_id = $split_contents[0]) =~ s/^#+\s*(.*?)\??$/make_id_from_heading($1)/e;

    chomp $split_contents[0];
    $split_contents[0] .= " {#$sect_id}\n";

    $contents = join "\n", map {
      my $line = $_;
      process_line(\$line);
      $line;
    } @split_contents;

    (my $fixed_heading = $heading) =~ s/[\'\*]//g;
    $fixed_heading =~ s/"/&quot;/g;

    $ret .= qq|<div (click)="faq_navigate(\$event, '/faq/$sect_id', '$fixed_heading')" *ngIf="$categories_condition">\n|;
    $ret .= markdown($contents) . "\n";
    $ret .= "</div>\n";
  }

  return $ret;
}

sub make_news_thumbnail
{
  my $item = shift;

  return qq|<img class="newsfeed-thumbnail" src="/assets/newsfeed/$item->{thumbnail}"/>|;
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
      print $docs_component_fh markdown("## $category_name"), "\n";;
    } else {
      my $contents = contents_for_template("$path/$page_name", $data->{$page_name});

      if ($contents =~ /^#+\s*(.*)$/m) {
        my $page_title = $1;
        $page_title =~ s/\*//g;
        $section_titles{"$path/$page_name"} = $page_title;
        if ($page_name eq 'index') {
          $section_titles{$path} = $page_title;
        }

        add_to_json("$path/$page_name", $page_title, $contents);
      } else {
        die;
      }

      print $docs_component_fh markdown($contents), "\n";
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
      print $recent_news_fh markdown($md), "\n";
      print $recent_news_fh qq|</div>\n|;
    }
    print $recent_news_fh qq|
<div id="archive-link"><a routerLink="/news/">News archive ...</a></div>\n</div>\n
|;
  }
}

sub markdown {
  my $md = shift;
  my $output_type = shift // 'html';

  my $html = "";

  pandoc '--columns' => 1000, -f => 'markdown-markdown_in_html_blocks+link_attributes+auto_identifiers+implicit_header_references+header_attributes',
    -t => $output_type, { in => \$md, out => \$html };

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

sub process_line {
  my $line_ref = shift;
  $$line_ref =~ s/\[([^\]]+)\]\(([^\)]+)\)/angular_link($1, $2)/ge;
  if ($$line_ref !~ /<!--.*-->/) {
   $$line_ref =~ s|(<app-[^>]+>)|`$1`{=html}|g;
   $$line_ref =~ s|\b(\d\d\d\d-\d\d-\d\d)\b|<span class="no-break">$1</span>|g;
  }
}

sub all_news_items {
  my @items = ();
  opendir my $dh, "$markdown_docs/news";
 ITEM:
  while (my $dir_file_name = readdir($dh)) {
    if ($dir_file_name =~ /^($date_re)-(.*)\.md$/) {
      my $news_date = $1;
      my $title = undef;
      my $id = undef;
      my $contents = '';
      my %flags = ();
      my $thumbnail = undef;
      open my $this_file, '<', "$markdown_docs/news/$dir_file_name" or die "can't open $dir_file_name";
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
        $ret .= qq|<div class="left-menu-part left-menu-item"><a simplePageScroll href="#| . $item->{id} . '">' . $item->{title} . qq|</a></div>\n|;
      }
    } else {
      $ret .= "## News archive";
      $ret .= qq|\n<div class="news-archive">\n|;
      my @rev_items = @all_news_items;
      for my $item (@rev_items) {
        $ret.= qq|\n<div class="news-item">\n|;
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
      open my $file, '<', "$markdown_docs/$details" or die "can't open $details: $!";

      while (my $line = <$file>) {
        process_line(\$line);
        $ret .= $line;
      }

      close $file;
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
  my $page_details = shift;
  my $heading = $page_details->{heading};
  my $content = $page_details->{content};

  # remove Angular elements
  $content =~ s!<(app-[\w\-]+).*?>(.*?)</\1>!$2!gs;

  $content =~ s!([\-=])+!$1!g;

  my $md = markdown($content, 'plain');

  # remove heading
  $md =~ s/\Q$heading//g;

  return $md;
}

map {
  $_->{content} = markdown_to_plain($_);
} @sorted_json_solr_contents;

# remove empty contents
@sorted_json_solr_contents =
  grep {
    $_->{content} =~ /\w/;
  } @sorted_json_solr_contents;

print $json_docs_fh to_json(\@sorted_json_solr_contents, { canonical => 1, pretty => 1 } );

close $json_docs_fh or die;

