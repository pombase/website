## Gene page: Modifications

The Modifications section lists protein modifications that have been
manually curated, using terms from the
[PSI-MOD](http://obofoundry.org/ontology/mod.html) ontology, for protein-coding
genes. ${database_name} will add RNA modifications to this section in the
future, when relevant data are curated.

#### Graphical overview

The overview show modifications where the residue position is known.
More details are available by mouse-over of the displayed positions.

[![summary gene page modification ontology annotation](assets/gene_page_modification_overview.png "Protein modifications overview"){ .screenshot width="800"}](assets/gene_page_modification_overview.png)

#### Ontology Annotations for Protein Features ####

The summary view (which is the default) shows the names of the most
specific terms used to annotate the gene along with selected
extensions:

[![summary gene page modification ontology annotation](assets/gene_page_modification_summary.png "Protein modifications summary view"){ .screenshot width="600"}](assets/gene_page_modification_summary.png)

(This example is from the [cdc2 gene page](https://www.pombase.org/gene/SPBC11B10.09))

The detailed view shows more information for each annotation, and may
display additional (less specific) terms:

[![full gene page modification ontology annotation](assets/gene_page_modification_full.png "Protein modifications detailed view"){ .screenshot width="800"}](assets/gene_page_modification_full.png)

1.  Graphical overview
2.  ID and Name of the ontology term
3.  Modification annotations may have extensions (see below) to capture
    any of several types of additional detail.
4.  The summary view is filtered, using the ontology structure, so
    that it shows only the most specific terms used to annotate a
    gene.  Modification annotations curated for a gene using less
    specific terms ("superclasses" or "ancestors" in the ontology)
    appear only in the detailed view.
5.  An abbreviation (code) or brief description for the type of
    evidence that supports the annotation. Modification annotations
    use some of the
    [codes](http://geneontology.org/docs/guide-go-evidence-codes/)
    defined by the GO Consortium, plus a small subset of the
    [Evidence Ontology](http://www.evidenceontology.org/) (ECO).
6.  The residue(s) modified (where available).  Note that the PomBase
    reported residues may differ from the published residues in cases
    where the gene structure coordinates have changed. In these cases
    we remap the modification to the new residue number. If it is
    possible that residue numbers have changed for a given protein
    there is a warning at the top of the protein modification section.
7.  The published source of the annotation (where available)
8.  The total number of genes annotated to this term or any of its
    descendants, linked to a list of those genes.
9.  Use the annotation filter to show low throughput, high throughput,
    non-experimental, or all modifications.


#### Annotation extensions #### {#ann_ext}

Where available, annotation extensions are displayed underneath the
ontology term name. The extensions provide additional specificity to
the annotation, often by linking the term to another ontology term or
a gene product via a relationship.  Example:

**modified residue** T167 **increased during** cellular response to nitrogen
starvation **in absence of** cdc2

Possible extensions include the
gene product that adds or removes a modification, specifying modified
residues, or specifying that the modification is observed during a
phase or process.

The annotation extension field can also be used to indicate modification
site occupancy, for experiments that measure the proportion of copies of
the protein (or RNA) that have the modification.
