#!/usr/bin/env perl

# run this script in the main website directory to find broken internal links:
#
#   ./etc/check_docs_broken_links.pl src/docs src/assets PomBase


use strict;
use warnings;
use Carp;

my $docs_dir = shift;
my $assets_dir = shift;

my $database_name = shift;

die "$0: exiting: needs three arguments\n" unless $database_name;

use File::Find;

my %valid_paths = ();


sub make_id_from_page_name {
  my $heading = shift;

  if (!$heading) {
    croak "no heading";
  }

  $heading =~ s/^#+\s*//;

  (my $id = lc $heading) =~ s/[^A-Za-z\._]+/-/g;

  $id =~ s/-(with|the|at|from|to|the|of|that|is|for|an|a|in)-/-/g for 1..5;
  $id =~ s/^(are|is)-//;

  $id =~ s/-+$//;
  $id =~ s/^-+//;

  return $id;
}


my @files_to_scan = ();

find(\&wanted_docs, $docs_dir);

sub wanted_docs {
  return if /^\.\.?$/;

  my $local_file_name = $_;
  my $current = $File::Find::name;

  $current =~ s|$docs_dir/||;

  if ($current =~ m|^(.+)/(.+)\.$database_name\.md$| ||
      $current =~ m|^(.+)/([^\.]+)\.md$|) {

    my $section = $1;
    my $page_name = $2;

    push @files_to_scan, "$docs_dir/$current";

    if ($section eq 'faq') {
      open my $f, '<', "../$current" or
        die "can't open $current: $!\n";

      my $first_line = <$f>;
      my $id = make_id_from_page_name($first_line);
      $valid_paths{"$section/$id"} = 1;
      close $f;
    } else {

      my $id = make_id_from_page_name($page_name);

      $valid_paths{"$section/$id"} = 1;
    }
  }

  if (-d $current) {
    $valid_paths{$current} = 1;
  }
}


find(\&wanted_assets, $assets_dir);

sub wanted_assets {
  return if /^\.\.?$/;

  my $current = $File::Find::name;

  $current =~ s|$assets_dir/||;

  if ($current =~ m@^([^\.]+)\.(png|jpe?g|gif)$@ ||
      $current =~ m@^([^\.]+)\.$database_name\.(png|jpe?g|gif)$@) {
    $valid_paths{"assets/$1.$2"} = 1;
  }
}


my $invalid_path = 0;


my @links = ();

for my $file_to_scan (@files_to_scan) {
  open my $file, '<', $file_to_scan or
    die "can't open $file_to_scan: $!\n";

  while (defined (my $line = <$file>)) {
    if ($line =~ /^\s*<!--.+-->\s*$/) {
      # comment
      next;
    }

    if ($line =~ /\[.+?\]\(([a-zA-Z][^\)\s]*)(:?\s+.*)?\)/) {
      my $link = $1;

      if ($link =~ m@^(https?|ftp)://|^mailto:@) {
        next;
      }

      if ($link =~ m@^(spombe/result|results|gene|reference|archive)/|query$@) {
        next;
      }

      $link =~ s/#.*//;

      my @link_parts = split "/", $link;

      if (@link_parts == 2 && $link !~ /\.(png|jpe?g|gif)$/) {
        $link = $link_parts[0] . '/' . make_id_from_page_name($link_parts[1]);
      }

      if (!$valid_paths{$link}) {
        print "$file_to_scan:$.:  $link\n   $line\n";
        $invalid_path = 1;
      }
    }
  }

  close $file;
}


exit $invalid_path;
