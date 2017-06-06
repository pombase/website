#!/usr/bin/env perl

use strict;
use warnings;

use JSON -support_by_pp;

my $file_name = shift;
my @abbrevs = @ARGV;

my %result = ();

my $current_abbreviation = undef;
my $current_database_description = undef;
my $current_url_syntax = undef;
my $current_generic_url = undef;

open my $fh, '<', $file_name or die "can't open $file_name: $!";

while (<$fh>) {
  if (/^abbreviation:\s*(.*)/) {
    if ($current_abbreviation) {
      $result{$current_abbreviation} = {
        name => $current_abbreviation,
        description => $current_database_description,
        url_syntax => $current_url_syntax,
        website => $current_generic_url,
      };
      $current_abbreviation = undef;
    $current_url_syntax = undef;
      $current_database_description = undef;
    }

    if (grep { $_ eq $1 } @abbrevs) {
      $current_abbreviation = $1;
    }
  } else {
    if (/^url_syntax:\s*(.*)/) {
      $current_url_syntax = $1;
    } else {
      if (/^database:\s*(.*)/) {
        $current_database_description = $1;
      } else {
        if (/^generic_url:\s*(.*)/) {
          $current_generic_url = $1;
        }
      }
    }
  }
}

if ($current_abbreviation) {
  $result{$current_abbreviation} = {
    name => $current_abbreviation,
    description => $current_database_description,
    url_syntax => $current_url_syntax,
    website => $current_generic_url,
  };
}

print to_json( \%result, { canonical => 1, pretty => 1 } );

print "\n";
