## Gene page: Phenotypes

${database_name} defines a phenotype as an observable characteristic, or set of
characteristics, of an organism that results from the interaction of
its genotype with a given environment. In ${database_name}, phenotypes are
annotated using terms from the Fission Yeast Phenotype Ontology
(FYPO). FYPO uses several existing ontologies from the 
[Open Biological and Biomedical Ontologies](http://obofoundry.org/) (OBO)
collection to construct formal definitions. Basic documentation for
FYPO is available at the [OBO Foundry](http://obofoundry.org/ontology/fypo.html), and further
information is available on the [${database_name} wiki](http://curation.pombase.org/pombase-trac/wiki/FissionYeastPhenotypeOntology).

In the phenotype annotation display on ${database_name} gene pages, the first
item shown is a brief summary indicating whether cells with a null
(deletion) allele of the gene are viable or inviable, or either
depending on experimental conditions. Next, single-locus phenotypes
are shown in two tables. The first table lists phenotypes observed at
the population level, such as viability in culture, and the second
shows cell-level phenotypes. Note that the viable/inviable population
terms describe whether a gene is essential or not, and see the wiki
[FYPO Content and Structure](http://curation.pombase.org/pombase-trac/wiki/FYPOContentStructure)
documentation for more information on cell and population phenotypes.
Finally, two more tables list population-level and cell-level
multi-locus phenotypes, i.e. phenotypes associated with double
mutants, triple mutants, etc, and the relevant genotype
details. Diploid genotypes are included in the single- or multi-locus
tables as appropriate.

Each table includes ontology term details and supporting data. The
summary view shows just the essentials: The list of terms is filtered,
using the ontology structure, so that it shows only the most specific
terms used to annotate a genotype, and each unique combination of
gene, FYPO term, allele(s) and extension(s) is shown once. For
single-allele phenotypes, the display includes:

![single-locus FYPO summary on gene page](assets/single_fypo_gene_page_summary.png){width="800"}

1.  The FYPO term name, which links to a page with additional
    information, including the term definition, any synonyms,
    relationships to other FYPO terms, and annotations to the term or
    its descendants. (See the [ontology term page documentation](/documentation/ontology-term-page) for more.)
2.  Allele details, including a name (if one is used in the
    literature) and description (where known). Diploid genotypes
    specify both alleles for the locus, and are shown in bold. Mouse
    over the allele name to show the allele type, which indicates
    whether partial deletions or altered residues refer to amino acids
    or nucleotides, and expression level. If you can provide a
    description for any allele shown as "unknown", please [contact the
    ${database_name} curators](mailto:helpdesk@pombase.org).
3.  Phenotype annotations may have extensions to capture penetrance
    (proportion of a population that shows the phenotype) or severity
    (previously designated "expressivity"), or to document which gene
    or protein used in an assay for level, localisation,
    etc. *${species_abbrev}* genes link to ${database_name} gene pages. Severity and
    penetrance use the relations *has\_severity* and *has\_penetrance*
    respectively, and can have values such as "high", "medium", or
    "low". Penetrance can also use numerical values. A gene or gene
    product used in an assay is stored using the appropriate ${database_name}
    systematic ID and the relation *assayed\_using*; the relation is
    converted to *affecting* in the gene page display. If a mutation
    affects an activity that modifies another gene product, extensions
    may capture the affected enzyme, the affected substrate, or
    both. The relation *assayed\_enzyme* is displayed as *affecting
    activity of* on gene pages, and *assayed\_substrate* is shown as
    *affecting substrate*.
4.  The phenotype display can be filtered to show subsets of the total
    set of annotations. Two filters, for ploidy and ontology terms,
    are available in the summary or detailed view. If there are both
    haploid and diploid genotypes curated, the first filter defaults
    to "Haploid or Diploid" to show all genotypes. The term filter
    lists several broad phenotypic categories derived from high-level
    FYPO terms:

![FYPO annotation term filter](assets/fypo_term_filter_pulldown.png){width="160"}

Choose one to restrict the annotation display to terms in the selected
branch of FYPO. When term filtering is active, a message appears to
indicate that not all annotations are shown:

![filtered annotation display message](assets/fypo_showing_n_annotations.png){width="600"}

Change the selection back to "No filter" to see annotations to all
terms.

The detailed single-locus phenotype view shows annotations to all FYPO
terms, and includes more details for each annotation. It shows
separate entries for repeat determinations of a given
gene/term/allele/extension combination (if supported by more than one
line of evidence and/or reported in more than one paper), and
annotations to terms hidden in the summary view:

![Single-locus FYPO detailed view on gene page](assets/single_fypo_gene_page_full.png){width="800"}

1.  The unique ID and name for a term in the phenotype ontology. The
    ID links to a page with additional information, including the term
    definition, any synonyms, relationships to other FYPO terms, and
    annotations to the term or its descendants. (See the [ontology term page documentation](/documentation/ontology-term-page) for
    more.)

2.  Allele details, including a name (if one is used in the
    literature) and description (where known). The column is headed
    "Genotypes" for consistency between the single- and multi-locus
    displays. Diploid genotypes specify both alleles for the locus,
    and are shown in bold. Each genotype name links to a page with
    full details (type, description, and expression) for its
    allele(s), links to gene pages, and a list of all phenotype
    annotations for the genotype. If you can provide a description for
    any allele shown as "unknown", please [contact the ${database_name}
    curators](mailto:helpdesk@pombase.org).
3.  Mouse over the allele name to show the allele type, which
    indicates whether partial deletions or altered residues refer to
    amino acids or nucleotides, and expression level.
4.  The phenotype display can be filtered to show subsets of the total
    set of annotations. The ploidy filter (not shown in this
    screenshot) selects haploid, diploid, or both genotypes where
    curated. The term filter, available in the summary or detailed
    view, lists several broad phenotypic categories derived from
    high-level FYPO terms. Choose one to restrict the annotation
    display to terms in the selected branch of FYPO. Change the
    selection back to "No filter" to see annotations to all terms. In
    the detailed view, annotations can also be filtered by evidence or
    throughput by choosing an descriptions from pulldown menus. Change
    the selection back to "No filter" to see annotations using any
    evidence type. Different filters, such as term and evidence, can
    be combined (note that some term/evidence combinations have no
    matching annotations). When any filtering is active, a message
    appears to indicate that not all annotations are shown.
5.  A brief descriptor for the type of evidence that supports the
    annotation. The evidence categories come from the [Evidence Ontology](http://www.evidenceontology.org/) (ECO).
6.  Information about experimental conditions, such as temperature, type
    of medium used, etc. Descriptions come from a small ontology
    maintained by ${database_name} curators.
7.  The paper from which the annotation comes.
8.  Phenotype annotations may have extensions to capture penetrance
    (proportion of a population that shows the phenotype) or severity
    (previously designated "expressivity"), or to document which gene
    or protein used in an assay for level, localisation,
    etc. *${species_abbrev}* genes link to ${database_name} gene pages. Severity and
    penetrance use the relations *has\_severity* and *has\_penetrance*
    respectively, and can have values such as "high", "medium", or
    "low".  Penetrance can also use numerical values. A gene or gene
    product used in an assay is stored using the appropriate ${database_name}
    systematic ID and the relation *assayed\_using*; the relation is
    converted to *affecting* in the gene page display.  If a mutation
    affects an activity that modifies another gene product, extensions
    may capture the affected enzyme, the affected substrate, or
    both. The relation *assayed\_enzyme* is displayed as *affecting
    activity of* on gene pages, and *assayed\_substrate* is shown as
    *affecting substrate*.

Similar displays are used for multi-locus phenotypes. Unless otherwise
noted below, all items are as described above for single-locus
phenotype displays.

The multi-locus summary shows FYPO terms and genotype descriptions:

![multi-locus FYPO summary view on gene page](assets/multi_fypo_gene_page_summary.png){width="800"}

1.  The FYPO term name, which links to the page for the term.
2.  Genotype details, including a name (if one is used in the
    literature) and descriptions for the relevant alleles (where
    known). Mouse over any genotype name to show more allele details,
    or click to go to the genotype detail page. Multiple genotypes
    annotated to the same term are separated by commas. Diploid
    genotypes specify both alleles for each locus, and are shown in
    bold.
3.  Display filters for ploidy and FYPO terms (as described above for
    single-locus phenotypes).

The detailed view includes:

![multi-locus FYPO full view on gene page](assets/multi_fypo_gene_page_full.png){width="800"}

1.  The unique ID and name for a term in the phenotype ontology, with
    links to the FYPO term page.
2.  Genotype details, including a name (if one is used in the
    literature) and descriptions for the relevant alleles (where
    known). Mouse over any genotype name to show more allele details,
    or click to go to the genotype detail page. Multiple genotypes
    annotated to the same term are listed one per line. Diploid
    genotypes specify both alleles for each locus, and are shown in
    bold.
3.  Display filter for ploidy, FYPO terms, evidence, and throughput (see above).
4.  Evidence description (see above).
5.  Experimental conditions (see above).
6.  The paper from which the annotation comes.

Annotation extensions are also included in the multi-locus Summary and
Full views (although none are included for the annotations in the above
illustrations), using the same display as for single-locus phenotypes.

Also see the [Advanced search documentation](/documentation/advanced-search) for
information on finding genes annotated to phenotype terms.
