### New data and new features on PomBase web site

We are pleased to announce that we have updated both data and web site
features for PomBase.

Most importantly, we have added new data types, and upgraded the gene
pages to display them.

We have also added more annotations of existing data types, bringing the
web site content up to September 11, 2012. The new annotations include
the first contributions to come in via the new community curation
system, and we thank the researchers who are participating in the
initial phase of community curation.

**New annotation types:**

-   Phenotype annotations now use the Fission Yeast Phenotype Ontology
    (FYPO), and include allele details, expression levels, and
    experimental conditions. With FYPO, more detailed phenotypes can be
    described, and links between terms for related phenotypes support
    improved phenotype searches.
-   Many GO annotations now include "annotation extensions" that provide
    additional specificity. For example, extensions may capture the
    substrate of a catalytic activity, the cell cycle phase during which
    a function or process occurs, or any of several other types of
    supporting information for the annotation. Annotation extensions are
    described in more detail below.

You can see these new data types on many gene pages, such as
[cdc2](/spombe/result/SPBC11B10.09) or
[pka1](/spombe/result/SPBC106.10).

**New web site features:**

-   Annotation display - Gene page GO and phenotype displays have been
    revamped to show new annotation types described above.
-   Ontology term pages - Each ontology term ID now links to pages with
    information about the term and lists of genes annotated to it.
-   Ontology graph links - GO and phenotype annotation sections now
    include links to graphical ontology displays in the genome browser.
-   Sequence highlighting - Sequence download now offers an option to
    show colour highlighting of regions such as UTRs, introns and exons.
-   Versions - Each gene page now shows the current data version in the
    format PomBase:x.y, where *x* is the Ensembl Genomes (EG) version,
    and *y* is the Chado version. The sequence, and sequence feature
    locations, remain stable within any EG version, whereas annotations
    change with each Chado update.
-   Protein family information is now included in the Protein Features
    gene page section.
-   The Protein Feature section includes a link to the Pfam entry for a
    protein.
-   Transcript source data (e.g. for UTR coordinates) is now displayed
    in the Transcript Features section.
-   A Documentation page contains links to relevant portions of the
    Ensembl Genomes documentation. (More documentation will be added
    over the coming months.)

**What are annotation extensions?**

Annotation extensions are a form of supporting data that can be added GO
annotations (or other ontology annotations) to capture additional
details not provided by the ontology term itself.

The information in GO annotation extensions encompasses several
effector-target relationships, such as

-   localisation dependencies
-   substrates of functions, e.g. targets of a protein kinase -- see the
    has\_substrate extensions on Cdc2's "protein serine/threonine
    kinase" (GO:0004674) annotations
-   activators and inhibitors
-   regulation targets of signalling pathways or transcription factors

Additional extensions describe spatial and temporal aspects of
processes. For example, several S. pombe annotations now include
extensions that indicate in which phase of the cell cycle a gene product
is found in a cellular component or involved in a process -- see the
pka1 annotations to "nucleus" (GO:0005634) and "cytoplasm" (GO:0005737).

You may also find the [GO wiki
page](http://wiki.geneontology.org/index.php/Annotation_Extension) on
annotation extensions informative, although it is primarily aimed at
curators.

Annotation extensions can also be used with phenotype annotations. The
most common usage of phenotype annotation extensions is to capture which
gene, protein, etc. was used in an assay. For example, the sam5 (G441E)
mutation of *pka1* causes nuclear accumulation of Ste11. This is
represented by annotation to the ontology term "nuclear protein
accumulation" (FYPO:0000255), with the extension
"assayed\_using(PomBase:SPBC32C12.02)". Extensions can also indicate
expressivity or penetrance for a phenotype.\
\
\

