## Genome sequence and features

<div style="color: red">
**Warning:** Files in the old FTP site within the EBI domain are no
  longer updated. If you have a link that contains **ftp.ebi.ac.uk**,
  please check these pages for a link using
  **ftp.pombase.org**. Please [contact the PomBase
  curators](mailto:helpdesk@pombase.org) if you need help finding a
  file or directory.
</div>

Links below go to web pages or directly to directories within the
PomBase FTP site. When you reach the FTP site, choose the file(s) you
need and click to download (connect as "guest" if prompted; see [this
FAQ](faq/do-i-need-password-download-ftp-site) for more information).

Note that most of the datasets available here are compressed (.gz), and
can be uncompressed by utilities available in all common operating
systems.

### Genome sequence

The current [genome sequence](ftp://ftp.pombase.org/pombe/genome_sequence_and_features/genome_sequence/) (ftp)
is available in FASTA format. The linked directory contains a file for
the whole genome sequence as well as separate files for each
chromosome.

#### Feature coordinates only

These files contain coordinates, but no sequence data:

-   [GFF3 format](ftp://ftp.pombase.org/pombe/genome_sequence_and_features/gff3/) (ftp)
    files contain coordinates for features of all types.
-   [CDS coordinates](ftp://ftp.pombase.org/pombe/genome_sequence_and_features/CDS_Coordinates/) (ftp) are in a tab-delimited file with columns for systematic ID, start coordinate, end coordinate, and strand.
-   [Exon coordinates](ftp://ftp.pombase.org/pombe/genome_sequence_and_features/Exon_Coordinates/) (ftp) are in the same tab-delimited file format as CDS coordinates.

#### Feature coordinates and sequence data

-   [Chromosome contigs](ftp://ftp.pombase.org/pombe/genome_sequence_and_features/artemis_files/) (ftp)
    in enriched EMBL-based format for loading into
    Artemis (see the [Artemis FAQ](/faq/there-equivalent-artemis-java-applet-pombase) 
-   Older files in [EMBL format](ftp://ftp.pombase.org/pombe/genome_sequence_and_features/OLD/20170906/embl/)
    and [GenBank format](ftp://ftp.pombase.org/pombe/genome_sequence_and_features/OLD/20170906/genbank/)
    are available, and reflect the current genome sequence, with feature annotations from January 2017 (ftp).

<!-- put this between the two existing lines above:
-   [Manually curated LTRs]() in GFF3 format
-->

#### Feature sequences

[Sequences in FASTA format](ftp://ftp.pombase.org/pombe/genome_sequence_and_features/feature_sequences/) for:

-   Coding sequences (CDS)
-   CDS + introns
-   CDS + introns + UTRs
<!-- -   Introns -->
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
-   [Cosmid sequences](ftp://ftp.pombase.org/archive/Cosmid_sequences/) and [Chromosome tiling paths from genome sequence assembly](ftp://ftp.pombase.org/archive/Cosmid_assembly_data/)
-   You can also browse the files available from the [Ensembl Genomes FTP
site](ftp://ftp.ensemblgenomes.org/pub/current/fungi/).
