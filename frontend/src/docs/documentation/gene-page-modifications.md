# Modifications

The Modifications section lists protein modifications that have been
manually curated for protein-coding genes. PomBase will add RNA
modifications to this section in the future, when relevant data are
curated.

The Protein Modifications table shows ontology annotations, using
[PSI-MOD](http://www.psidev.info/MOD) for protein modifications (as
shown in the example), and the [Sequence
Ontology](http://sequenceontology.org/) (SO) for certain protein
sequence features.

**Ontology Annotations for Protein Features**

Summary view:

![summary gene page modification ontology
annotation](/sites/pombase.org/files/images/gene_page_modification_summary.png "Protein modifications"){width="800"
height="413"}

1.  Ontology (PSI-MOD or SO)
2.  Name of the ontology term
3.  Modification annotations may have [extensions](#ann_ext) to capture
    any of several types of additional detail. *S. pombe* genes link to
    PomBase gene pages, and GO term names link to PomBase ontology term
    summary pages.
4.  The residue(s) modified (where available)
5.  The total number of genes annotated to this term or any of its
    descendants, linked to a list of those genes.

Full view:

![full gene page modification ontology
annotation](/sites/pombase.org/files/images/gene_page_modification_full.png "Protein modifications"){width="800"
height="559"}

1.  Ontology (PSI-MOD or SO)
2.  Name and ID of the ontology term
3.  Modification annotations may have [extensions](#ann_ext) to capture
    any of several types of additional detail. *S. pombe* genes link to
    PomBase gene pages, and GO term names link to PomBase ontology term
    summary pages.
4.  An abbreviation (code) for the type of evidence that supports the
    annotation. Modification annotations use a subset of the [evidence
    codes](http://www.geneontology.org/GO.evidence.shtml) defined by the
    GO Consortium.
5.  The residue(s) modified (where available)
6.  The published source of the annotation (where available)
7.  The total number of genes annotated to this term or any of its
    descendants, linked to a list of those genes.

**[]{#ann_ext}Annotation extensions**\
Where available, annotation extensions are displayed underneath the
ontology term name. The extensions provide additional specificity to the
annotation, often by linking the term to another ontology term or a gene
product via a relationship. Examples include specifying the gene product
that adds or removes a modification, specifying modified residues, or
specifying that the modification is observed during a phase or process
(for instance, Cdc2 is phosphorylated during G2, and phosphorylated on
Tyrosine 15 by Wee1; it is phosphorylated during G2 but not M phase of
the mitotic cell cycle; other extensions are also available for Cdc2).

The annotation extension field can also be used to indicate modification
site occupancy, for experiments that measure the proportion of copies of
the protein (or RNA) that have the modification.
