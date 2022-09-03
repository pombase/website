#!/usr/bin/env perl

# run in the website directory to check for problems in the config file:
#
#   ./etc/check_config.pl config.json src/assets
#
# currently only checks:
#  - that it's valid JSON
#  - the panel header image files exist

use strict;
use warnings;
use Carp;

use JSON -support_by_pp;
use Data::Dumper;

my $web_config_file_name = shift;
my $assets_dir = shift;

die "$0: exiting: needs two arguments\n" unless $assets_dir;


open my $config_fh, '<', $web_config_file_name
  or die "can't open $web_config_file_name";
my $config_contents;
{
  local $/ = undef;
  $config_contents = <$config_fh>;
}
close $config_fh;

my $config = from_json $config_contents;

my $front_page_panels = $config->{front_page_panels};

map {
  my $panel = $_;

  if (defined $panel->{head_image}) {
    my @head_images = @{$panel->{head_image}};
    map {
      my $head_image = $_;
      if ($head_image !~ m|^/media/|) {
        if ($head_image =~ m|^/|) {
          die qq|"head_image" shouldn't start with "/": $head_image\n|;
        }
        if (! -f "$assets_dir/$head_image") {
          die qq|missing file for "head_image": $head_image\n|;
        }
      }
    } @head_images;
  } else {
    die 'missing "head_image" for: ', Dumper([$panel]);
  }

  my $date_added = $panel->{date_added};

  if (defined $date_added) {
    if ($date_added =~ /^(\d\d\d\d)-(\d\d)-(\d\d)/) {
      if ($1 < 2015) {
        die qq|year too far in the past for "date_added": "$date_added"\n|;
      }
      if ($2 > 12) {
        die qq|month should be 1-12 for "date_added": "$date_added"\n|;
      }
      if ($3 > 31) {
        die qq|day of month should be 1-31 for "date_added": "$date_added"\n|;
      }
   } else {
      die "unknown date format: $date_added\n";
    }
  } else {
    die 'missing "date_added" for: ', Dumper([$panel]);
  }
} @$front_page_panels;
