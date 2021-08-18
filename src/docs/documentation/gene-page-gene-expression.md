## Gene page: Gene expression

The Gene expression section of a gene page displays curated
qualitative and quantitative information about the level and timing of
the gene's expression. In each subsection, a simple summary appears by
default:

![gene page expression section, summary view](assets/gene_page_expression_summary.png "Gene Page: Gene Expression Summary"){width="800"}

1.  Qualitative descriptions are drawn from a small internal controlled
    vocabulary, with supporting extensions. Each description links to a
    list of all genes annotated to the same term.
    - a\) The expression description name.
    - c\) An optional extension indicating that expression is observed
        during a particular process or phase (using GO terms) or in
        the presence of a particular chemical (using ChEBI terms).
2.  Quantitative expression data include the number of RNA or protein
    molecules measured per cell, and may optionally include a copy
    number range. Quantitative expression annotations also indicate
    whether the experiment measures expression in a population or a
    single cell, and usually include a brief description of
    experimental conditions, drawn from a small ontology maintained by
    PomBase curators.
    -   h\)What was measured, i.e. RNA or protein.
    -   i\) Molecules per cell (RNA or protein, as indicated in the sub-header).
        For population-scale experiment types this is an average, whereas for
        single-cell scale experiments it is an absolute number.
    -   j\) The life cycle stage or cell cycle phase in which expression was
        measured.
%%if db=PomBase
3.  Click to see the gene highlighted in [violin
    plots](https://en.wikipedia.org/wiki/Violin_plot) of quantitative
    expression datasets that include it. (At present data from
    [Marguerat S *et al.*
    (2012)](https://www.pombase.org/reference/PMID:23101633) and
    [Carpy A *et al.*
    (2014)](https://www.pombase.org/reference/PMID:24763107) are
    included.)
%%end db=PomBase


Click "Show details" to reveal additional information:

![gene page expression section, detail view](assets/gene_page_expression_details.png "Gene Page: Gene Expression Details"){width="800"}

1.  Qualitative expression details:
    -   a, b\) The unique ID and name for the expression description.
    -   c\) Optional extension, as in the summary view.
    -   d\) A brief descriptor for the type of evidence that supports the
        annotation. The evidence categories come from the 
        [Evidence Ontology](http://www.evidenceontology.org/) (ECO).
    -   e\) The display can be filtered to show subsets of the total set
        of annotations. Choose a cell cycle phase from the "During"
        pulldown, or throughput from the second pulldown (options that
        match no annotations are greyed out).
    -   f\) The paper from which the annotation comes.
    -   g\) The number of genes annotated to the description (not
        including extensions), linked to a list of the genes.

2.  Quantitative expression details:
    -   h\)What was measured, i.e. RNA or protein.
    -   i\) Molecules per cell, as in the summary view.
    -   j\) The life cycle stage or cell cycle phase in which expression was
        measured.
    -   k\) Information about experimental conditions, such as temperature, type
        of medium used, etc. Descriptions come from a small ontology maintained
        by PomBase curators.
    -   l\) Whether the experiment was done at the level of a single cell or a
        population of cells.
    -   m\) A brief descriptor for the type of evidence that supports the
        annotation. The evidence categories come from the 
        [Evidence Ontology](http://www.evidenceontology.org/) (ECO). If a more specific
        description is not available, the general term "experimental evidence"
        is shown.
    -   n\) The paper from which the annotation comes.

**Important:** Note that the condition descriptions are rather broad,
and therefore do not necessarily capture all details of every aspect
that may affect gene expression. We are also unable to capture strain
details at present. We therefore recommend consulting the papers cited
for the data before comparing or combining data from different
publications.

Several of the [External References](/documentation/gene-page-external-references) 
also link to gene expression data.
