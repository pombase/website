#!/usr/bin/env perl

use strict;
use warnings;

use JSON -support_by_pp;
use Pandoc;

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

  if (!$data->{index}) {
    die "no index for section: $path\n";
  } else {
    if (!$data->{menu}) {
      die "no menu for section: $path\n";
    }
  }
}

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

sub process_path {
  my $path = shift;

  my $data = $sections{$path};

  print qq|<div *ngIf="section == '$path'">\n|;
  print qq|  <div class="docs-menu">\n|;
  print markdown(contents_for_template("$path/menu", $data->{menu})), "\n";
  print qq|  </div>\n|;

  my @news_pages = ();

  for my $page_name (sort keys %$data) {
    next if $page_name eq "menu";
    print qq|  <div *ngIf="pageName == '$page_name'" class="docs-content">\n|;
    print markdown(contents_for_template("$path/$page_name", $data->{$page_name})), "\n";
    print qq|  </div>\n|;

    if ($path eq 'news' && $page_name =~ /^\d+-\d+-\d+/) {
      push @news_pages, $page_name;
    }
  }
  print qq|</div>\n|;

  if ($path eq 'news') {
    my @news_summary = ();
    if (@news_pages > 5) {
      @news_summary = (reverse @news_pages)[0..5];
    } else {
      @news_summary = reverse @news_pages;
    }

    print $recent_news_file qq|<div class="recent-news"><div class="recent-news-header">Recent news</div>\n|;
    for my $page_name (@news_summary) {
      print $recent_news_file markdown(contents_for_template("news/$page_name", $data->{$page_name})), "\n";
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
  my $file_name = shift;

  open my $file, '<', $file_name or die "can't open $file_name: $!\n";

  my $ret = "";

  if ($path =~ m|(.*)/menu$|) {
    my $section = $1;
    my $menu_title = (ucfirst $section) =~ s/-/ /gr;
    $ret = "### " . angular_link($menu_title, $section) . "\n";
  }

  while (my $line = <$file>) {
    $line =~ s/\[([^\]]+)\]\(([^\)]+)\)/angular_link($1, $2)/ge;
    $line =~ s/,([^ ])/,&#8203;$1/g;
    $line =~ s|(\d\d\d\d-\d\d-\d\d)|<span class="no-break">$1</span>|g;
    $ret .= $line;
  }

  return $ret;
}
