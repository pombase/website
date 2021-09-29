## Genome sequence and features

Note that most of the datasets available here are compressed (.gz), and
can be uncompressed by utilities available in all common operating
systems. Your browser may prompt you to open or download files.

### Genome sequence

The current [genome sequence](${base_url}/data/genome_sequence_and_features/genome_sequence/)
is available in FASTA format. The linked directory contains a file for
the whole genome sequence as well as separate files for each
chromosome.

#### Feature coordinates only

These files contain coordinates, but no sequence data:

-   [GFF3 format](${base_url}/data/genome_sequence_and_features/gff3/)
    files contain coordinates for features of all types.
%%if db=PomBase
-   [CDS coordinates](${base_url}/data/genome_sequence_and_features/CDS_Coordinates/) are in a tab-delimited file with columns for systematic ID, start coordinate, end coordinate, and strand.
-   [Exon coordinates](${base_url}/data/genome_sequence_and_features/Exon_Coordinates/) are in the same tab-delimited file format as CDS coordinates.
%%end db=PomBase

%%if db=PomBase
#### Feature coordinates and sequence data

-   [Chromosome contigs](https://www.pombase.org/data/genome_sequence_and_features/artemis_files/)
    in enriched EMBL-based format for loading into
    Artemis (see the [Artemis FAQ](/faq/there-equivalent-artemis-java-applet-pombase)) 
-   Older files in [EMBL format](https://www.pombase.org/data/genome_sequence_and_features/OLD/20170906/embl/)
    and [GenBank format](https://www.pombase.org/data/genome_sequence_and_features/OLD/20170906/genbank/)
    are available, and reflect the current genome sequence, with feature annotations from January 2017.
%%end db=PomBase

<!-- put this between the two existing lines above:
-   [Manually curated LTRs]() in GFF3 format
-->

#### Feature sequences

[Sequences in FASTA format](${base_url}/data/genome_sequence_and_features/feature_sequences/) for:

-   Coding sequences (CDS)
-   CDS + introns
-   CDS + introns + UTRs
-   Introns within coding sequences
-   5' and 3' UTRs
-   Peptide sequences
<!-- -   Non-coding RNA genes -->

#### Genomic regions

Region|Description
------|-----------
[Telomeres](status/telomeres)|Telomeric sequence
[Centromeres](status/centromeres)|Centromeric sequence and maps
[Mating Type Region](status/mating-type-region)|Links to genome browser for 972 h- (chromosome 2 coordinates) and h+ (mating region contig)

#### Other data

-   Additional information and historical data are available for [introns](downloads/intron-data)
%%if db=PomBase
-   [Cosmid sequences](https://www.pombase.org/data/archive/Cosmid_sequences/) and [Chromosome tiling paths from genome sequence assembly](https://www.pombase.org/data/archive/Cosmid_assembly_data/)
%%end db=PomBase
-   You can also browse the files available from the [Ensembl Genomes FTP
site](ftp://ftp.ensemblgenomes.org/pub/current/fungi/).
