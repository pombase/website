## Gene page: Gene structure history

The "Gene structure history" section in the gene page shows all previous gene structures for the main feature of a gene (CDS for coding genes, and transcript for RNA genes). If available, the reasons for the change are indicated as comments or references to databases such as PubMed. In addition, a link to the annotated genome sequence before the structure was changed is provided.

### List of all gene structure changes

You can find a list of all changes to all gene structures in [this file](https://github.com/pombase/genome_changelog/blob/master/results/pombase_tables/gene-coordinate-change-data.tsv). To download the file, right-click [here](https://raw.githubusercontent.com/pombase/genome_changelog/master/results/pombase_tables/gene-coordinate-change-data.tsv) and select "Save link as...". Every pair of rows in the file corresponds to a change in the gene structure. The column `Before / After` indicates whether the coordinates refer to the gene structure before or after the change. In addition, if a reference was added or removed, it appears on the added or removed row, respectively. Comments associated with changes are also included.

Before using these coordinates for analysis, take into account that they may refer to a previous genome sequence / assembly (nucleotide sequence may have changed). You can find a list of the dates where the genome sequence has changed in [this file](https://github.com/pombase/genome_changelog/blob/master/results/genome_sequence_changes.tsv). The relevant columns in the file are:

* **date**: date of the change.
* **chromosome**: chromosome affected.
* **link**: link to the file prior to the change.

For example, to extract the sequence of SPAPB15E9.01c before 2002-03-22, complement(3980427..3982657):

* Download the sequence of chromosome 1 prior to that change (the one where revision is 20011004). https://www.pombase.org/data/genome_sequence_and_features/artemis_files/OLD/20011004/chromosome1.contig
* Extract the feature from that genome sequence.
