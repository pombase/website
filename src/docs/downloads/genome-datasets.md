## Genome sequence and features

Note that most of the datasets available here are compressed (.gz), and
can be uncompressed by utilities available in all common operating
systems. Your browser may prompt you to open or download files.

### Genome sequence

%%if db=PomBase
The current genome sequence is available in FASTA format from the
[monthly release directory](${base_url}/latest_release/genome_sequence_and_features/genome_sequence/).
Separate file are available for each chromosome, as well as a combined
FASTA file.
%%end db=PomBase

%%if db=JaponicusDB
The current [genome sequence](${base_url}/data/genome_sequence_and_features/genome_sequence/)
is available in FASTA format. The linked directory contains a file for
the whole genome sequence as well as separate files for each
chromosome.
%%end db=JaponicusDB

#### Feature coordinates only

These files contain coordinates, but no sequence data:

%%if db=JaponicusDB
 -  [GFF3 format](${base_url}/data/genome_sequence_and_features/gff3/)
%%end db=JaponicusDB

%%if db=PomBase
 -  [GFF3 format](${base_url}/latest_release/genome_sequence_and_features/gff_format)
    files contain coordinates for features of all types.
 -  [CDS coordinates](${base_url}/latest_release/genome_sequence_and_features/feature_coordinates) are in a tab-delimited file with columns for systematic ID, start coordinate, end coordinate, and strand.
 -  [Exon coordinates](${base_url}/latest_release/genome_sequence_and_features/feature_coordinates) are in the same tab-delimited file format as CDS coordinates.

#### Feature coordinates and sequence data

-   [Chromosome contigs](${base_url}/latest_release/genome_sequence_and_features/artemis_contigs/)
    in enriched EMBL-based format for loading into
    Artemis (see the [Artemis FAQ](/faq/there-equivalent-artemis-java-applet-pombase)) 
-   Older files in [EMBL format](/data/genome_sequence_and_features/OLD/20170906/embl/)
    and [GenBank format](/data/genome_sequence_and_features/OLD/20170906/genbank/)
    are available, and reflect the current genome sequence, with feature annotations from January 2017.
%%end db=PomBase

<!-- put this between the two existing lines above:
-   [Manually curated LTRs]() in GFF3 format
-->

#### Feature sequences

%%if db=PomBase

These files are provided in FASTA format.  They contain RNA/DNA
sequences except for the "Peptide sequences" file.

 - [Coding sequences (CDS)](${base_url}/latest_release/genome_sequence_and_features/fasta_format/feature_sequences/cds.fa)
 - [CDS + introns](${base_url}/latest_release/genome_sequence_and_features/fasta_format/feature_sequences/cds+introns.fa)
 - [CDS + introns + UTRs](${base_url}/latest_release/genome_sequence_and_features/fasta_format/feature_sequences/cds+introns+utrs.fa)
 - [Introns within coding sequences](${base_url}/latest_release/genome_sequence_and_features/fasta_format/feature_sequences/introns_within_cds.fa)
 - [5' UTRs](${base_url}/latest_release/genome_sequence_and_features/fasta_format/feature_sequences/five_prime_utrs.fa) and
   [3' UTRs](${base_url}/latest_release/genome_sequence_and_features/fasta_format/feature_sequences/three_prime_utrs.fa)
 - [Peptide sequences](${base_url}/latest_release/genome_sequence_and_features/fasta_format/feature_sequences/peptide.fa)

Browse available files from the latest release: [feature sequence files](${base_url}/latest_release/genome_sequence_and_features/fasta_format/feature_sequences/)

%%end db=PomBase

%%if db=JaponicusDB
[Sequences in FASTA format](${base_url}/data/genome_sequence_and_features/feature_sequences/) for:

-   Coding sequences (CDS)
-   CDS + introns
-   CDS + introns + UTRs
-   Introns within coding sequences
-   5' and 3' UTRs
-   Peptide sequences
%%end db=JaponicusDB

<!-- -   Non-coding RNA genes -->

#### Genomic regions

Region|Description
------|-----------
[Telomeres](status/telomeres)|Telomeric sequence
[Centromeres](status/centromeres)|Centromeric sequence and maps
[Mating Type Region](status/mating-type-region)|Links to genome browser for 972 h- (chromosome 2 coordinates) and h+ (mating region contig)

#### Other data

%%if db=PomBase
-   Additional information and historical data are available for [introns](downloads/intron-data)
-   [Cosmid sequences](https://www.pombase.org/data/archive/Cosmid_sequences/) and [Chromosome tiling paths from genome sequence assembly](https://www.pombase.org/data/archive/Cosmid_assembly_data/)
%%end db=PomBase
-   You can also browse the files available from the [Ensembl Genomes FTP
site](ftp://ftp.ensemblgenomes.org/pub/current/fungi/).
