#!/usr/bin/env perl

use strict;
use warnings;

use JSON -support_by_pp;
use Pandoc;

my %sections = ();

for my $file (sort @ARGV) {
  if (my ($path, $name) = $file =~ m|(?:\./)?([\w/]+)/(.*)\.md|) {
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
  my $data = $sections{$path};

  print qq|<div *ngIf="section == '$path'">\n|;
  print qq|  <div class="docs-menu">\n|;
  print markdown(contents_for_template("$path/menu", $data->{menu})), "\n";
  print qq|  </div>\n|;

  for my $page_name (sort keys %$data) {
    next if $page_name eq "menu";
    print qq|  <div *ngIf="pageName == '$page_name'" class="docs-content">\n|;
    print markdown(contents_for_template("$path/$page_name", $data->{$page_name})), "\n";
    print qq|  </div>\n|;
  }
  print qq|</div>\n|;
}

print "</div>\n";


my $doc_config_file = "../app/config/doc-config.json";

open my $doc_config, '>', $doc_config_file
  or die "can't open $doc_config_file: $!\n";

print $doc_config to_json( [sort keys %sections], { canonical => 1, pretty => 1 } );

close $doc_config;

sub markdown {
  my $md = shift;

  my $html = "";

  pandoc '--columns' => 1000, -f => 'markdown', -t => 'html', { in => \$md, out => \$html };

  return $html;
}


sub angular_link {
  my $title = shift;
  my $path = shift;

  return qq|<a routerLink="/$path" routerLinkActive="active">$title</a>|;
}

sub contents_for_template {
  my $path = shift;
  my $file_name = shift;

  open my $file, '<', $file_name or die "can't open $file_name: $!\n";

  my $ret = "";

  if ($path =~ m|(.*)/menu$|) {
    $ret = "### " . angular_link(ucfirst $1, $1) . "\n";
  }

  while (my $line = <$file>) {
    $line =~ s/\[([^\]]+)\]\(([^\)]+)\)/angular_link($1, $2)/e;
    $line =~ s/,([^ ])/,&#8203;$1/g;
    $line =~ s|(\d\d\d\d-\d\d-\d\d)|<span class="no-break">$1</span>|g;
    $ret .= $line;
  }

  return $ret;
}
