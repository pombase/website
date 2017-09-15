#!/usr/bin/env perl

use perl5i::2;
use Moose;

# select node_revisions.title, node_revisions.body,
# group_concat(term_data.name) from node_revisions join term_node on
# term_node.nid = node_revisions.nid and term_node.vid =
# node_revisions.vid join term_data on term_node.tid = term_data.tid
# group by node_revisions.title into outfile '/tmp/drupal_nodes.csv'
# FIELDS TERMINATED BY ',' ENCLOSED BY '"' LINES TERMINATED BY '\n';

my %category_title_map =
(
  'Querying/Searching' => [
    "Can I use a wild card at the beginning of a search string?",
    "Can I provide a list of genes to search on?",
    "How can I find all of the genes that have a given mutant phenotype?",
    "Can I get a list of essential pombe genes?",
    "How can I find protein localization data?",
    "How can I find genes with a specific activity?",
    "How can I find modifications for my protein of interest?",
    "How can I find proteins that have transmembrane domains?",
    "How can I find snoRNA genes?",
    "How can I retrieve intron coordinates or sequences?",
    "How can I find intron branch sites?",
    "How can I retrieve UTR sequences?",
    "How can I search for the S. cerevisiae ortholog(s)/homolog(s) of an S. pombe gene?",
    "How can I find all S. pombe proteins in a particular protein family?",
    "Can I search for genes based on conservation in different taxa?",
    "How can I find S. pombe ortholog(s) of a human gene?",
    "How can I find all S. pombe genes that are conserved in human?",
    "How can I find S. pombe genes associated with human disease?",
    "How can I find S. pombe orthologs for species other than human and S. cerevisiae?",
    "Is there a list of drug targets in S. pombe?",
    "How can I search or browse GO annotations?",
    "How can I browse the phenotype ontology (FYPO)?",
    "How can I retrieve all S. pombe genes?",
    "Can I use BLAST to search for short sequences?",
    "How can I display a sequence region using sequence coordinates in the genome browser?",
    "How can I find all sequence features in a region using chromosome coordinates?",
    "Can I download sequences for many genes at once, including flanking regions?",
    "How can I find genes in a region using chromosome coordinates?",
    "Is there an equivalent to the Artemis java applet in PomBase?",
    "How do you determine a gene's full-length transcript? / UTR coordinates? / transcription start and end sites?",
    "Can I view nucleotide sequence in the genome browser?",
    "How can I find transposons in the S. pombe genome?",
    "What is the \"PBO\" option in the Advanced Search?",
    "Do you have polyadenylation data for fission yeast?",
    "How can I retrieve all S. pombe protein-coding genes?",
    "Can I get cDNA sequences for pombe?",
    "How can I retrieve sequence coordinates for all features of a particular type?",
    "How can I see nucleotide-level similarity between S. pombe and other Schizosaccharomyces species?",
    "How can I find transcription factor binding sites in PomBase?",
    "How can I find rRNA genes?",
    "Can I do GO term enrichment for other Schizosaccharomyces species (e.g. S. japonicus)?",
    "How can I find GO annotations for other Schizosaccharomyces species (e.g. S. japonicus)?",
    "How can I retrieve sequences for non-protein-coding genes?",
    "How can I find orthologs between S. pombe and other Schizosaccharomyces species?",
    "Can I retrieve annotations to metabolic databases such as EC, MetaCyc, Reactome, or Rhea for S. pombe genes?",
    "How can I find significant shared FYPO annotations for genes in a list?",
    "Can I do an enrichment analysis using phenotypes?",
    "I found a discrepancy between a GenBank (EMBL/ENA or DDBJ) entry and a sequence in Pombase. What should I do?",
    "Can I find promoters in PomBase?",
    "Can I search PomBase for protein features?",
    "How can I find S. pombe genes that complement or are complemented by a gene from another species?",
    "How can I identify all of the genes that affect a process?",
    "Can I access PomBase via SQL?",
    "Why are GO annotations different between PomBase and UniProt/GOA?",
    "Can I retrieve functional annotations for genes in a list?",
    "What is GO term enrichment? How can I do it for my genes?",
    "Can I download all S. pombe phenotype data?",
    "Can I find all of the unconserved (orphan) genes in fission yeast?",
    "How can I find transcription factors and their targets in PomBase?",
    "Can I find replication origins in PomBase?",
    "Can I search for a gene list and retrieve results in the same order as in the input list?"
  ],
  'Data Submission and Formats' => [
    "How can I get my data into PomBase?",
    "How can I submit high-throughput data to PomBase?",
    "What file formats can I use to submit high-throughput data?",
    "What is WIG format?",
    "What is PSL format?",
    "What is bigWig format?",
    "What is bigBed format?",
    "What is bedGraph format?",
    "What is BED format?",
    "What is VCF?",
    "What is BAM format?",
    "What is GFF3?"
  ],
  'Datasets' => [
    "How can I show or hide tracks in the genome browser?",
    "How can I submit high-throughput data to PomBase?",
    "Do you have polyadenylation data for fission yeast?",
    "Where can I download the genome sequence?",
    "What file formats can I use to submit high-throughput data?",
    "Can I get a list of essential pombe genes?",
    "Is there a list of protein complexes in S. pombe, and their subunits?",
    "How do I receive updates to the list of S. cerevisiae and S. pombe orthologs?",
    "How can I obtain the list of human and S. pombe orthologs?",
    "Is the S. pombe transcriptome available in FASTA format?",
    "How can I find intron branch sites?",
    "Can I view my data privately in the genome browser?",
    "How do you determine a gene's full-length transcript? / UTR coordinates? / transcription start and end sites?",
    "How are sequence feature types defined in PomBase?",
    "How can I retrieve UTR sequences?",
    "How can I find transcription factor binding sites in PomBase?",
    "How can I find GO annotations for other Schizosaccharomyces species (e.g. S. japonicus)?",
    "How can I retrieve sequences for non-protein-coding genes?",
    "Can I view variation data in PomBase?",
    "Can I find promoters in PomBase?",
    "Can I download all S. pombe phenotype data?",
    "Can I find replication origins in PomBase?",
    "Can I download the interaction data used by esyN?",
    "How can I retrieve all S. pombe protein-coding genes?",
    "Can I get cDNA sequences for pombe?",
    "Can I obtain a dump of all curated data in PomBase?"
  ],
  'Gene Page' => [
    "Can I hide the Quick Links box?",
    "Why are some genes annotated to both viable and inviable phenotypes?",
    "How can I retrieve a gene sequence, including upstream and downstream sequences?",
    "Why do gene pages only show curated orthologs for human and S. cerevisiae?"
  ],

  'Genome Browser' => [
    "How can I show or hide tracks in the genome browser?",
    "How can I display a sequence region using sequence coordinates in the genome browser?",
    "Can I view nucleotide sequence in the genome browser?",
    "How can I find all sequence features in a region using chromosome coordinates?",
    "How can I retrieve the sequence of a region using sequence coordinates?",
    "How can I retrieve a gene sequence, including upstream and downstream sequences?",
    "Are there any rDNA repeat sequences in PomBase?",
    "How can I locate the mating type region?",
    "How can I locate centromeres?",
    "Can I view my data privately in the genome browser?",
    "Can I view variation data in PomBase?"
  ],
  'Genome Statistics and Lists' => [
    "How do I receive updates to the list of S. cerevisiae and S. pombe orthologs?",
    "How can I obtain the list of human and S. pombe orthologs?",
    "When was the genomic sequence last updated?",
    "How many conserved unstudied proteins are there? How is the list generated?",
    "What does the \"characterisation status\" mean for a gene?",
    "Can I get a list of essential pombe genes?",
    "Can I get a list of systematic IDs, primary names, synonyms and gene products in S. pombe?",
    "Where can I find basic statistics on the S. pombe genome, such as genome size, total number of genes, mean intergenic distance, etc.?",
    "How can I retrieve all S. pombe genes?",
    "How are non-coding RNA genes identified?",
    "How can I use GO slims with S. pombe?",
    "Is there a list of protein complexes in S. pombe, and their subunits?",
    "Is there a list of drug targets in S. pombe?",
    "Why do gene pages only show curated orthologs for human and S. cerevisiae?",
    "How can I find all S. pombe genes that are conserved in human?",
    "How are sequence feature types defined in PomBase?",
    "How do you determine a gene's full-length transcript? / UTR coordinates? / transcription start and end sites?",
    "Can I find all of the unconserved (orphan) genes in fission yeast?",
    "How are PomBase systematic IDs determined?",
    "Can I download the interaction data used by esyN?",
    "How can I retrieve all S. pombe protein-coding genes?",
    "Where can I find information about PomBase data versions?"
  ],
  'Locating Genomic Regions' => [
    "Can I view nucleotide sequence in the genome browser?",
    "How can I display a sequence region using sequence coordinates in the genome browser?",
    "How can I locate telomeres and subtelomeric regions?",
    "How can I locate the mating type region?",
    "How can I locate centromeres?",
    "Are there any rDNA repeat sequences in PomBase?",
    "Is there an equivalent to the Artemis java applet in PomBase?"
  ],
  'Orthology' => [
    "How do I receive updates to the list of S. cerevisiae and S. pombe orthologs?",
    "How can I search for the S. cerevisiae ortholog(s)/homolog(s) of an S. pombe gene?",
    "How can I obtain the list of human and S. pombe orthologs?",
    "How can I find all S. pombe genes that are conserved in human?",
    "How can I find S. pombe ortholog(s) of a human gene?",
    "How can I find S. pombe genes associated with human disease?",
    "Can I view my protein of interest in a multiple alignment with related proteins in other species?",
    "How can I find S. pombe orthologs for species other than human and S. cerevisiae?",
    "How can I find all S. pombe proteins in a particular protein family?",
    "Can I search for genes based on conservation in different taxa?",
    "Why do gene pages only show curated orthologs for human and S. cerevisiae?",
    "How can I find orthologs between S. pombe and other Schizosaccharomyces species?",
    "How can I see nucleotide-level similarity between S. pombe and other Schizosaccharomyces species?"
  ],
  'Sequence Retrieval' => [
    "Where can I download the genome sequence?",
    "Can I download sequences for many genes at once, including flanking regions?",
    "Can I view nucleotide sequence in the genome browser?",
    "How can I retrieve a gene sequence, including upstream and downstream sequences?",
    "How can I find all sequence features in a region using chromosome coordinates?",
    "How can I retrieve the sequence of a region using sequence coordinates?",
    "How can I display a sequence region using sequence coordinates in the genome browser?",
    "Can I get a file with a specific set of genome features?",
    "How can I retrieve intron coordinates or sequences?",
    "How can I find intron branch sites?",
    "How can I retrieve UTR sequences?",
    "How can I find snoRNA genes?",
    "Are there any rDNA repeat sequences in PomBase?",
    "How are sequence feature types defined in PomBase?",
    "How can I find transposons in the S. pombe genome?",
    "Can I retrieve the sequence for any of the cosmids used to build the S. pombe genome sequence?",
    "Is the S. pombe transcriptome available in FASTA format?",
    "How can I find rRNA genes?",
    "How can I retrieve sequences for non-protein-coding genes?",
    "I found a discrepancy between a GenBank (EMBL/ENA or DDBJ) entry and a sequence in Pombase. What should I do?",
    "Can I find replication origins in PomBase?",
    "Can I get cDNA sequences for pombe?",
    "How can I retrieve sequence coordinates for all features of a particular type?",
    "Can I download the sequence for a whole chromosome?"
  ],
  'Tools and Resources' => [
    "How do I cite data from PomBase? How do I cite the genome sequence, comparison data, etc.?",
    "Can I view nucleotide sequence in the genome browser?",
    "Can I use BLAST to search for short sequences?",
    "Can I convert IDs from other databases to or from PomBase IDs?",
    "Is there any programmatic access to PomBase data?",
    "Can I access PomBase via an API?",
    "How can I browse the phenotype ontology (FYPO)?",
    "Is there an equivalent to the Artemis java applet in PomBase?",
    "Can I get a file with a specific set of genome features?",
    "How can I use GO slims with S. pombe?",
    "How can I find transposons in the S. pombe genome?",
    "How can I get cosmids for my favorite gene?",
    "How can I find significant shared GO annotations for genes in a list?",
    "Can I view my protein of interest in a multiple alignment with related proteins in other species?",
    "How can I find S. pombe orthologs for species other than human and S. cerevisiae?",
    "Can I convert a file from GTF to GFF3?",
    "Can I convert a file from GFF to GTF?",
    "Can I generate a comprehensive restriction enzyme map of the genome in PomBase?",
    "Is the S. pombe transcriptome available in FASTA format?",
    "Can I retrieve the sequence for any of the cosmids used to build the S. pombe genome sequence?",
    "Can I do GO term enrichment for other Schizosaccharomyces species (e.g. S. japonicus)?",
    "How can I find significant shared FYPO annotations for genes in a list?",
    "Can I do an enrichment analysis using phenotypes?",
    "Can I access PomBase via SQL?",
    "Can I retrieve functional annotations for genes in a list?",
    "What is GO term enrichment? How can I do it for my genes?",
    "Can I visualise networks in PomBase?",
    "Can I obtain a dump of all curated data in PomBase?",
    "How can I see nucleotide-level similarity between S. pombe and other Schizosaccharomyces species?"
  ],
  'Using Ontologies' => [
    "Why are some genes annotated to both viable and inviable phenotypes?",
    "How can I find all of the genes that have a given mutant phenotype?",
    "Can I get a list of essential pombe genes?",
    "How can I browse the phenotype ontology (FYPO)?",
    "How can I find genes with a specific activity?",
    "How can I find protein localization data?",
    "Is there a list of protein complexes in S. pombe, and their subunits?",
    "How can I find modifications for my protein of interest?",
    "How can I find significant shared GO annotations for genes in a list?",
    "How can I use GO slims with S. pombe?",
    "How can I search or browse GO annotations?",
    "What is an annotation extension?",
    "What is the \"PBO\" option in the Advanced Search?",
    "Can I do GO term enrichment for other Schizosaccharomyces species (e.g. S. japonicus)?",
    "How can I find GO annotations for other Schizosaccharomyces species (e.g. S. japonicus)?",
    "Can I retrieve annotations to metabolic databases such as EC, MetaCyc, Reactome, or Rhea for S. pombe genes?",
    "How can I find significant shared FYPO annotations for genes in a list?",
    "Can I do an enrichment analysis using phenotypes?",
    "Can I search PomBase for protein features?",
    "How can I find S. pombe genes that complement or are complemented by a gene from another species?",
    "Why are some genes with an abnormal phenotype annotated to the corresponding GO process while others are not?",
    "How can I identify all of the genes that affect a process?",
    "Why are GO annotations different between PomBase and UniProt/GOA?",
    "Can I retrieve functional annotations for genes in a list?",
    "What is GO term enrichment? How can I do it for my genes?",
    "Can I download all S. pombe phenotype data?"
  ]
);

use List::MoreUtils qw(first_index);
use Text::CSV;

sub category_fix {
  my $title = shift;
  my $category_text = shift;

  my @categories = split /,/, $category_text;

  my @new_categories = ();
  for my $category (@categories) {
    if ($category_title_map{$category}) {
      my $index = first_index {$_ eq $title} @{$category_title_map{$category}};
      $index = 999 if $index == -1;
#      push @new_categories, $category . ":$index";
      push @new_categories, $category;
    }
  }

  return join ',', @new_categories;
}

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
  print $tmp $body;
  close $tmp;

  my $tidied;

  {
    local $/ = undef;
    open my $tidy_pipe, 'tidy -q -xml --indent yes --indent-spaces 2 /tmp/tmp.xml | pandoc -f html -t markdown |' or die;
    $tidied = <$tidy_pipe>;
    close $tidy_pipe;
  }

  open my $out, '>', "/tmp/faq/$out_file_name.md" or die;
  print $out "# $title\n";
  print $out "<!-- pombase_categories: $categories -->\n\n";
  print $out "$tidied\n";
  close $out;
}

$csv->eof or $csv->error_diag();
