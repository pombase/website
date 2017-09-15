# How are PomBase systematic IDs determined?
<!-- pombase_categories: Genome Statistics and Lists -->

Systematic IDs follow patterns based on the feature type, and in some
cases the chromosome, as shown in the table below.

Open reading frame (ORF) IDs also indicate which cosmid or plasmid they
were found on in genome sequencing. In most cases, ORF IDs that end with
a digit indicate that the ORF is on the forward (Watson) strand, and an
ORF with an ID that ends with 'c' is on the reverse (Crick) stand. There
are a few exceptions, however, because some cosmids were moved and their
orientation reversed late in the sequence assembly procedure

IDs with '.1' appended are transcript IDs; the dot-and-digit IDs follow
Ensembl's standard. At present, PomBase has only one transcript
annotated for any given feature, but in the future when alternative
transcripts are annotated the digit will be incremented (.2, .3, etc.).

**Systematic ID patterns**

ID pattern

Description

SPAC\*

features, usually ORFs, on chromosome 1, sequenced on cosmids

SPBC\*

features, usually ORFs, on chromosome 2, sequenced on cosmids

SPCC\*

features, usually ORFs, on chromosome 3, sequenced on cosmids

SPAP\*

features, usually ORFs, on chromosome 1, sequenced on plasmids

SPBP\*

features, usually ORFs, on chromosome 2, sequenced on plasmids

SBCP\*

features, usually ORFs, on chromosome 3, sequenced on plasmids

SPATRNA\*

tRNA genes on chromosome 1

SPBTRNA\*

tRNA genes on chromosome 2

SPCTRNA\*

tRNA genes on chromosome 3

SPLTRA\*

LTRs on chromosome 1

SPLTRB\*

LTRs on chromosome 2

SPLTRC\*

LTRs on chromosome 3

SPNCRNA\*

non-coding RNA genes (no chromosome info in ID)

SPRPTA.\*

repeats (other than LTRs or centromeric repeats) on chromosome 1

SPRPTB.\*

repeats (other than LTRs or centromeric repeats) on chromosome 2

SPRPTC.\*

repeats (other than LTRs or centromeric repeats) on chromosome 3

SPRPTCENA\*

centromeric repeats on chromosome 1

SPRPTCENB\*

centromeric repeats on chromosome 2

SPRPTCENC\*

centromeric repeats on chromosome 3

SPRRNA\*

rRNA genes (no chromosome info in ID)

SPSNORNA\*

snoRNA genes (no chromosome info in ID)

SPSNRNA\*

snRNA genes (no chromosome info in ID)

SPTF\*

transposons (no chromosome info in ID)

SPMTR\*

features on the separately sequenced mating type region contig

SPMIT\*

features on the mitochondrial chromosome

SPMITTRNA\*

subset of SPMIT\*; tRNA genes on mitochondrial chromosome

SPNUMT\*

NUMTs (nuclear mitochondrial pseudogenes) (no chromosome info in ID)

