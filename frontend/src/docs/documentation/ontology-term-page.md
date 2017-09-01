# Ontology term pages

<div style="color: red">
  Note: because of changes in this preview, many of the screenshots in
  this documentation are out of date.
</div>

For each ontology term loaded into PomBase, a page summarizes
essential details about the term, and shows any annotations to it or
its descendants via *is\_a*, *part\_of*, and the *regulates* relations
(the GO documentation on [Ontology
Structure](http://www.geneontology.org/GO.ontology.structure.shtml)
and [Ontology
Relations](http://www.geneontology.org/GO.ontology.relations.shtml)
has some useful information on this topic). For FYPO terms only, the
has_part relation is also used.

The main illustrations use a GO term page. Note that not all ontology
terms have all of the depicted features.

![ontology term page](assets/ontology_term_page_summary.png){width="800"}

1.  Ontology term details. The term's name, ID, and definition are shown.
2.  The term's immediate parent(s), linked to the corresponding
    ontology term page(s).
3.  Links to external browsers are available for some ontologies. GO,
    FYPO and PSI-MOD terms have links to
    [BioPortal](http://bioportal.bioontology.org/), and GO term pages
    also link to [AmiGO](http://amigo.geneontology.org/amigo) and
    [QuickGO](http://www.ebi.ac.uk/QuickGO/). SO IDs link to
    [MISO](http://sequenceontology.org/browser/obob.cgi).
4.  Link to a page that lists genes annotated to the term or its
    descendants. From the linked page, the gene list can be sent to
    the advanced search for use in queries.
5.  In the annotation summary view, the term of interest is listed
    first, followed by any descendant term that has direct
    annotations. For each term, genes (or genotypes) are listed in a
    compact display, with separate lines only for unique combinations
    of gene, term, and extension. As in the gene page summary display,
    most details are hidden.

As on gene pages, a more detailed annotation display is available:

![ontology term page](assets/ontology_term_page_detail.png){width="800"}

1.  The detailed view shows one line per annotation, with separate
    entries for repeat determinations of a given gene/term/extension
    combination (if supported by more than one line of evidence and/or
    reported in more than one paper). The annotated gene (or genotype)
    is listed in the first column.
2.  The rest of the detailed annotation display (term name,
    extensions, evidence, reference, etc.) is as described in the gene
    page documentation for each annotation type.
3.  The table is organized into sections, one per descendant term, and
    each section includes genes annotated directly to the indicated
    term. An icon near each descendant term ID shows the relationship
    type that links the terms. For example, a meiotic spindle astral
    microtubule (GO:1990574) is a type of astral microtubule, and a
    mitotic spindle astral microtubule is part of an astral
    microtubule.

FYPO term pages have a few distinctive features:

![ontology term page](assets/ontology_term_page_fypo.png){width="800"}

1.  Links near the top of the page go to lists of genes and genotypes.
2.  The annotation display is split into single-allele and
    multi-allele sections, as on gene pages.
3.  Annotated genotypes (rather than genes) are listed for each term.
4.  In the detailed view, evidence filtering is available as described
    in the [gene page
    documentation](documentation/gene-page-phenotypes).

Ontology term pages are available for [GO](http://geneontology.org/),
[FYPO](/browse-curation/fission-yeast-phenotype-ontology),
[SO](http://sequenceontology.org/),
[PSI-MOD](http://www.psidev.info/MOD),
[PBO](/faqs/what-pbo-option-advanced-search), and PECO, the internal
ontology we use for phenotype experimental conditions.
