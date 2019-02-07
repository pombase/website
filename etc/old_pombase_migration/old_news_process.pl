#!/usr/bin/env perl

use perl5i::2;
use Moose;

use List::MoreUtils qw(first_index);
use Text::CSV;

open my $fh, '<', $ARGV[0] or die;

my $csv = Text::CSV->new({ sep_char => ",", escape_char => '\\' }) or die;
while (my $cols = $csv->getline($fh)) {
  my $title = $cols->[0];
  my $body = $cols->[1];

  next unless $body;

  my $categories = category_fix($title, $cols->[2]);

  (my $out_file_name = $title) =~ s/\W+/-/g;
  $out_file_name = lc $out_file_name;
  $out_file_name =~ s/-+$//;

  open my $tmp, '>', '/tmp/tmp.xml' or die;

  $body =~ s/data-\w+="[^"]+"//g;
  $body =~ s/\b(style|width|height)="[^"]+"//g;
  $body =~ s|<span\s*>((?:<em>)?[^<]+(?:</em>)?)</span>|$1|g for 1..5;

  print $tmp $body;
  close $tmp;

  my $tidied;

  {
    local $/ = undef;
    open my $tidy_pipe, 'tidy -q -xml --indent yes --indent-spaces 2 /tmp/tmp.xml | pandoc -f html -t markdown |' or die;
    $tidied = <$tidy_pipe>;
    close $tidy_pipe;
  }

  open my $out, '>', "$ENV{HOME}/pombase-www-new/frontend/src/docs/faq/$out_file_name.md" or die;
  print $out "# $title\n";
  print $out "<!-- pombase_categories: $categories -->\n\n";
  print $out "$tidied\n";
  close $out;
}

$csv->eof or $csv->error_diag();
