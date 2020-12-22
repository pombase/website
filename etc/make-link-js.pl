#!/usr/bin/env perl

use strict;
use warnings;
use Data::Dumper;

use YAML 'LoadFile';

use JSON -support_by_pp;

my $file_name = shift;
my @db_ids = @ARGV;

my %result = ();

my $current_abbreviation = undef;
my $current_database_description = undef;
my $current_url_syntax = undef;
my $current_generic_url = undef;

my $xrefs = LoadFile($file_name);

my %db_ids = ();

map {
  my $db_id = $_;

  if ($db_id =~ /(.*):(.*)/) {
    my $db_name = $1;

    $db_ids{$db_name} = {
      entity_type_name => $2,
    };
  } else {
    $db_ids{$db_id} = {};
  }
} @db_ids;

for my $xref (@$xrefs) {
  my @database_names = ($xref->{database});
  if ($xref->{synonyms}) {
    push @database_names, @{$xref->{synonyms}};
  }

  for my $database_name (@database_names) {

  my $db_id_conf = $db_ids{$database_name};

  if (defined $db_id_conf) {
    my $entity_type_name = $db_id_conf->{entity_type_name};

    my $entity_type = undef;

    if (@{$xref->{entity_types}} > 1) {
      if (!defined $entity_type_name) {
        die "no entity type name specified for $database_name which has ",
          scalar(@{$xref->{entity_types}}), " entity types:\n",
          Dumper([$xref->{entity_types}]);
      }

      map {
        my $this_entity_type = $_;
        if ($this_entity_type->{type_name} eq $entity_type_name ||
              $this_entity_type->{type_name} =~ s/ /_/gr eq $entity_type_name) {
          $entity_type = $this_entity_type;
        }
      } @{$xref->{entity_types}};
    } else {
      $entity_type = $xref->{entity_types}->[0];
    }

    delete $db_ids{$database_name};

    $result{$database_name} = {
      name => $database_name,
      description => $xref->{name},
      url_syntax => $entity_type->{url_syntax},
      website => $xref->{generic_urls}->[0],
    };
  }
  }
}

my @missing_dbs = sort keys %db_ids;

if (@missing_dbs) {
  warn "warning: some databases could not be found in $file_name:",
    " @missing_dbs\n";
}

print to_json( \%result, { canonical => 1, pretty => 1 } );

print "\n";
