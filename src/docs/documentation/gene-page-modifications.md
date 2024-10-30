## Gene page: Modifications

The Modifications section lists protein modifications that have been
manually curated, using terms from the
[PSI-MOD](http://obofoundry.org/ontology/mod.html) ontology, for protein-coding
genes. ${database_name} will add RNA modifications to this section in the
future, when relevant data are curated.

#### Ontology Annotations for Protein Features ####

The summary view shows only the names of the most specific terms used to annotate the gene:

![summary gene page modification ontology annotation](assets/gene_page_modification_summary.png "Protein modifications"){ .screenshot width="250"}

The detailed view shows more information for each annotation, and may display additional terms:

![full gene page modification ontology annotation](assets/gene_page_modification_full.png "Protein modifications"){ .screenshot width="800"}

1.  Name and ID of the ontology term
2.  Modification annotations may have extensions (see below) to capture
    any of several types of additional detail. *${species_abbrev}* genes link to
    ${database_name} gene pages, and GO term names link to ${database_name} ontology term
    summary pages.
3.  The summary view is filtered, using the ontology structure, so
    that it shows only the most specific terms used to annotate a
    gene. Modification annotations curated for a gene using less
    specific terms ("superclasses" or "ancestors" in the ontology)
    appear only in the detailed view.
4.  An abbreviation (code) or brief description for the type of
    evidence that supports the annotation. Modification annotations
    use some of the
    [codes](http://geneontology.org/docs/guide-go-evidence-codes/)
    defined by the GO Consortium, plus a small subset of the
    [Evidence Ontology](http://www.evidenceontology.org/) (ECO).
5.  The residue(s) modified (where available).  Note that the PomBase
    reported residues may differ from the published residues in cases
    where the gene structure coordinates have changed. In these cases
    we remap the modification to the new residue number. If it is
    possible that residue numbers have changed for a given protein
    there is a warning at the top of the protein modification section.
6.  The published source of the annotation (where available)
7.  The total number of genes annotated to this term or any of its
    descendants, linked to a list of those genes. The gene list page
    includes basic information about the ontology term, and a link to
    send the gene list to the advanced search.

#### Annotation extensions #### {#ann_ext}

Where available, annotation extensions are displayed underneath the
ontology term name. The extensions provide additional specificity to
the annotation, often by linking the term to another ontology term or
a gene product via a relationship. Examples include specifying the
gene product that adds or removes a modification, specifying modified
residues, or specifying that the modification is observed during a
phase or process.  For example, in *S. pombe* Lys4 (shown above) is phosphorylated
on a serine residue during M phase of the mitotic cell
cycle. Likewise, *S. pombe* [Cdc2](/gene/SPBC11B10.09) is phosphorylated during
G2, and phosphorylated on Tyrosine 15 by Wee1; it is phosphorylated
during G2 but not M phase of the mitotic cell cycle; other extensions
are also available for Cdc2.

The annotation extension field can also be used to indicate modification
site occupancy, for experiments that measure the proportion of copies of
the protein (or RNA) that have the modification.
