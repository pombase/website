#!/usr/bin/env perl

use strict;
use warnings;

use JSON -support_by_pp;

my $file_name = shift;
my @abbrevs = @ARGV;

my %result = ();

my $current_abbreviation = '';

open my $fh, '<', $file_name or die "can't open $file_name: $!";

while (<$fh>) {
  if (/^abbreviation:\s*(.*)/) {
    if (grep { $_ eq $1 } @abbrevs) {
      $current_abbreviation = $1;
    }
  } else {
    if (/^url_syntax:\s*(.*)/ && $current_abbreviation) {
      $result{$current_abbreviation} = $1;
      $current_abbreviation = '';
    }
  }
}

print to_json( \%result, { pretty => 1 } );

print "\n";
