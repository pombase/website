#!/usr/bin/env perl

# run this script in the main website directory to find broken internal links:
#
#   ./etc/check_docs_broken_links.pl src/docs src/assets PomBase


use strict;
use warnings;
use Carp;

my $docs_dir = shift;
my $assets_dir = shift;

my $web_config_file_name = shift;

die "$0: exiting: needs three arguments\n" unless $web_config_file_name;

use File::Find;

my %valid_paths = ();

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



sub substitute_vars {
  my $var_name = shift;
  my $line_ref = shift;

  if (exists $var_substitutions{$var_name}) {
    return $var_substitutions{$var_name};
  }
}

sub process_line {
  my $line_ref = shift;

  $$line_ref =~ s/\$\{(\w+)\}/substitute_vars($1, $line_ref)/ge;

  $$line_ref =~ s/\.md$//;
}

sub make_id_from_page_name {
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
      process_line(\$first_line);
      my $id = make_id_from_page_name($first_line);
      $valid_paths{"$section/$id"} = 1;
      my $second_line = <$f>;
      if ($second_line =~ /<!-- pombase_categories:\s*(.*?)\s*-->/) {
        for my $category (map {
          s/^\s+//;
          s/\s+$//;
          $_;
        } split /,/, $1) {
          my $category_as_id = make_id_from_page_name($category);
          $valid_paths{"faq/$category_as_id"} = 1;
        }
      }
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


my $invalid_paths = 0;


my @links = ();

for my $file_to_scan (@files_to_scan) {
  open my $file, '<', $file_to_scan or
    die "can't open $file_to_scan: $!\n";

  while (defined (my $line = <$file>)) {
    if ($line =~ /^\s*<!--.+-->\s*$/) {
      # comment
      next;
    }

    if ($line =~ m!\[.+?\]\(/?([a-zA-Z][^\)\s]*)(:?\s+.*)?\)!) {
      my $link = $1;

      if ($link =~ m@^(https?|ftp)://|^mailto:@) {
        next;
      }

      if ($link =~ m@^(spombe/(result|query)|results|gene|genotype|term|reference|archive|slim:\w+|vis|internal-details)/|(query|motif_search)$@) {
        next;
      }

      process_line(\$link);

      $link =~ s/#.*//;

      my @link_parts = split "/", $link;

      if (@link_parts == 2 && $link !~ /\.(png|jpe?g|gif)$/) {
        $link = $link_parts[0] . '/' . make_id_from_page_name($link_parts[1]);
      }

      if (!$valid_paths{$link}) {
        print "$file_to_scan:$.:  $link\n   $line\n";
        $invalid_paths++;
      }
    }
  }

  close $file;
}

if ($invalid_paths > 0) {
  warn "problems found: $invalid_paths\n";
  exit 1;
}
