#!/usr/bin/env perl

# run as:
#  (cd frontend/src/docs; perl ../../etc/make-docs.pl \
#  ../app/recent-news/recent-news.component.html \
#  `find ./ -name '*.md'` > ../app/docs/docs.component.html)

use strict;
use warnings;

use JSON -support_by_pp;
use Pandoc;

our $date_re = qr|\d+-\d+-\d+|;

my $recent_news_file_name = shift;
open my $recent_news_file, '>', $recent_news_file_name
  or die "can't open $recent_news_file_name for writing\n";

my %sections = ();

for my $file (sort @ARGV) {
  if (my ($path, $name) = $file =~ m|(?:\./)?([\w\-/]+)/(.*)\.md|) {
    $sections{$path}->{$name} = $file;
  }
}

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

  (my $id = lc $heading) =~ s/\W+/-/g;
  $id =~ s/-+$//;

  return $id;
}

while (my ($id, $file_name) = each %{$sections{faq}}) {
  if ($id eq 'index') {
    next;
  }

  open my $fh, '<', $file_name or die "can't open $file_name";
  my $heading = undef;
  my @categories = ();
  my $contents = "";
  while (defined (my $line = <$fh>)) {
    $contents .= $line;
    if (!$heading && $line =~ /^#\s*(.*)/) {
      $heading = $1;
    } else {
      if ($line =~ /<!-- pombase_categories:\s*(.*?)\s*-->/) {
        @categories = split /,/, $1;
      }
    }
  }

  my $id = make_id_from_heading($heading);
  for my $category_name (@categories) {
    my $category_id = make_id_from_heading($category_name);
    $faq_category_names{$category_id} = $category_name;
    push @{$faq_data{$category_id}}, { id => $id, heading => $heading };
  }

  $contents =~ s/^#/###/gm;

  $faq_questions{$id} = { contents => $contents,
                          categories => \@categories };

  close $fh;
}

while (my ($category_name, $questions) = each %faq_data) {
  @{$faq_data{$category_name}} =
    sort {
      $a->{heading} cmp $b->{heading};
    } @{$faq_data{$category_name}};
}

$faq_data{index} = './faq/index.md';

$sections{faq} = \%faq_data;

print qq|<div class="docs">\n|;

for my $path (sort keys %sections) {
  process_path($path);
}

print "</div>\n";


my $doc_config_file = "../app/config/doc-config.json";

open my $doc_config, '>', $doc_config_file
  or die "can't open $doc_config_file: $!\n";

print $doc_config to_json( [sort keys %sections], { canonical => 1, pretty => 1 } );

close $doc_config;

close $recent_news_file;

sub get_all_faq_parts {
  my $faq_questions = shift;

  my $ret = "";

  my @ids = sort keys %$faq_questions;

  for my $id (@ids) {
    my $details = $faq_questions->{$id};
    my $contents = $details->{contents};
    my @categories = @{$details->{categories}};

    my $categories_condition =
      join " || ", map {
        "pageName == '" . make_id_from_heading($_) . "'";
      } @categories;

    $ret .= qq|<div *ngIf="$categories_condition">\n|;
    $ret .= markdown($contents);
    $ret .= "</div>\n";
  }

  return $ret;
}

sub process_path {
  my $path = shift;

  my $data = $sections{$path};

  print qq|<div *ngIf="section == '$path'">\n|;
  print qq|  <div class="docs-menu">\n|;
  print markdown(contents_for_template("$path/menu", $data->{menu})), "\n";
  print qq|  </div>\n|;
  print qq|  <div class="docs-content">\n|;

  my @news_pages = ();

  for my $page_name (sort keys %$data) {
    next if $page_name eq "menu";
    (my $no_date_page_name = $page_name) =~ s/^$date_re-(.*)/$1/;
    print qq|  <div *ngIf="pageName == '$no_date_page_name'">\n|;
    if (ref $data->{$page_name}) {
      my $category_id = $page_name;
      # faq:
      my $category_name = $faq_category_names{$category_id};
      print markdown("## $category_name"), "\n";;
    } else {
      print markdown(contents_for_template("$path/$page_name", $data->{$page_name})), "\n";
    }
    print qq|  </div>\n|;

    if ($path eq 'news' && $page_name =~ /^$date_re/) {
      push @news_pages, $page_name;
    }
  }

  if ($path eq 'faq') {
    print get_all_faq_parts(\%faq_questions);
  }

  print qq|  </div>\n|;
  print qq|</div>\n|;

  if ($path eq 'news') {
    my @news_summary = ();
    if (@news_pages > 5) {
      @news_summary = (reverse @news_pages)[0..5];
    } else {
      @news_summary = reverse @news_pages;
    }

    print $recent_news_file qq|<div class="recent-news">\n|;
    for my $page_name (@news_summary) {
      my $contents = contents_for_template("news/$page_name", $data->{$page_name});
      $contents =~ s/^#/####/gm;
      print $recent_news_file markdown($contents), "\n";
    }
    print $recent_news_file qq|
<div id="archive-link"><a routerLink="/news/">News archive</a></div>\n</div>\n
|;
  }
}

sub markdown {
  my $md = shift;

  my $html = "";

  pandoc '--columns' => 1000, -f => 'markdown-markdown_in_html_blocks+link_attributes+auto_identifiers+implicit_header_references+header_attributes',
    -t => 'html', { in => \$md, out => \$html };

  return $html;
}


sub angular_link {
  my $title = shift;
  my $path = shift;

  if ($path =~ /\.(?:png|gif)($|\s)/) {
    return "[$title]($path)";
  }

  if ($path =~ /^https?:/) {
    return qq|<a href="$path">$title</a>|;
  } else {
    $path =~ s|^/+||;
    return qq|<a routerLink="/$path" routerLinkActive="active">$title</a>|;
  }
}

sub contents_for_template {
  my $path = shift;
  my $details = shift;  # could be a file name

  my $ret = "";

  if ($path =~ m|(.*)/menu$|) {
    my $section = $1;
    my $menu_title = (ucfirst $section) =~ s/-/ /gr;
    $menu_title = 'FAQ' if $menu_title =~ /faq/i;
    $ret = "### " . angular_link($menu_title, $section) . "\n";
  }

  if ($path eq 'news/menu') {
    opendir my $dh, 'news';
    while(my $dir_file_name = readdir($dh)) {
      if ($dir_file_name =~ /^$date_re-(.*)\.md$/) {
        my $file_name_sect_id = $1;
        open my $this_file, '<', "news/$dir_file_name" or die "can't open $dir_file_name\n";
        while (defined (my $line = <$this_file>)) {
          if ($line !~ /^\s*$/) {
            if ($line =~ /^#+\s*(.*?)\s*$/) {
              $ret .= " - [$1](news/$file_name_sect_id)\n";
            }
          }
        }
        close $this_file;
      }
    }
  } else {
    if ($path =~ m[^faq/menu]) {
      my @categories = sort keys %{$sections{faq}};

      for my $category_id (@categories) {
        next if $category_id eq 'index';
        my $category_name = $faq_category_names{$category_id};
        $ret .= " - " . angular_link($category_name, "faq/$category_id") . "\n";
      }
    } else {
      if (ref $details) {
        # add faq menu here
      } else {
      open my $file, '<', $details or die "can't open $details: $!\n";

      while (my $line = <$file>) {
        $line =~ s/\[([^\]]+)\]\(([^\)]+)\)/angular_link($1, $2)/ge;
        $line =~ s/,([^ ])/,&#8203;$1/g;
        $line =~ s|(\d\d\d\d-\d\d-\d\d)|<span class="no-break">$1</span>|g;
        $ret .= $line;
      }

      close $file;
      }
    }
  }

  return $ret;
}
