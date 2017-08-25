# Gene Page: Phenotypes

<div style="color: red">
  Note: because of changes in this preview, many of the screenshots in
  this documentation are out of date.
</div>

PomBase defines a phenotype as an observable characteristic, or set of
characteristics, of an organism that results from the interaction of its
genotype with a given environment. In PomBase, phenotypes are annotated
using terms from the Fission Yeast Phenotype Ontology (FYPO). FYPO uses
several existing ontologies from the [Open Biological and Biomedical
Ontologies](http://obofoundry.org/) (OBO) collection to construct formal
definitions. Basic documentation for FYPO is available at the [OBO
Foundry](http://obofoundry.org/cgi-bin/detail.cgi?id=fypo), and further
information is available on the [PomBase
wiki](http://curation.pombase.org/pombase-trac/wiki/FissionYeastPhenotypeOntology).

In the phenotype annotation display on PomBase gene pages, the first
item shown is a brief summary indicating whether cells with a null
(deletion) allele of the gene are viable or inviable, or either
depending on experimental conditions. Next, single-allele phenotypes are
shown in two tables. The first table lists phenotypes observed at the
population level, such as viability in culture, and the second shows
cell-level phenotypes. Note that the viable/inviable population terms
describe whether a gene is essential or not, and see the wiki [FYPO
Content and
Structure](http://curation.pombase.org/pombase-trac/wiki/FYPOContentStructure)
documentation for more information on cell and population phenotypes.
Finally, two more tables list population-level and cell-level
multi-allele phenotypes, i.e. phenotypes associated with double mutants,
triple mutants, etc, and the relevant genotype details.

Each table includes ontology term details and supporting data. The
summary view shows just the essentials: The list of terms is filtered,
using the ontology structure, so that it shows only the most specific
terms used to annotate a genotype, and each unique combination of
gene, FYPO term, allele(s) and extension(s) is shown once. For
single-allele phenotypes, the display includes:

![gene page phenotype annotations](assets/single_fypo_gene_page_summary.png "Single-allele FYPO summary on gene page"){width="800"}

1.  The FYPO term name, which links to a page with additional
    information, including the term definition, any synonyms,
    relationships to other FYPO terms, and annotations to the term or
    its descendants. (See the [ontology term page
    documentation](/documentation/ontology-term-page) for more.)
2.  Allele details, including a name (if one is used in the
    literature) and description (where known). Mouse over the allele
    name to show the allele type, which indicates whether partial
    deletions or altered residues refer to amino acids or nucleotides,
    and expression level. If you can provide a description for any
    allele shown as "unknown", please [contact the PomBase
    curators](mailto:helpdesk@pombase.org).
3.  Phenotype annotations may have extensions to capture expressivity
    (the extent to which a phenotype is expressed; for PomBase
    annotations expressivity extensions are often used to capture
    information about phenotype severity) or penetrance (proportion of
    a population that shows the phenotype), or to document which gene
    or protein used in an assay for level, localisation,
    etc. *S. pombe* genes link to PomBase gene pages. Expressivity and
    penetrance use the relations *has\_expressivity* and
    *has\_penetrance* respectively, and can have values such as
    "high", "medium", or "low".  Penetrance can also use numerical
    values. A gene or gene product used in an assay is stored using
    the appropriate PomBase systematic ID and the relation
    *assayed\_using*; the relation is converted to *affecting* in the
    gene page display.  If a mutation affects an activity that
    modifies another gene product, extensions may capture the affected
    enzyme, the affected substrate, or both. The relation
    *assayed\_enzyme* is displayed as *affecting activity of* on gene
    pages, and *assayed\_substrate* is shown as *affecting substrate*.
  
4.  The phenotype display can be filtered to show subsets of the total
    set of annotations. The term filter, available in the summary or
    detailed view, lists several broad phenotypic categories derived
    from high-level FYPO terms:

![FYPO term filter](assets/fypo_term_filter_pulldown.png "FYPO annotation term filter"){width="160"}

    Choose one to restrict the annotation display to terms in the
    selected branch of FYPO. When term filtering is active, a message
    appears to indicate that not all annotations are shown:

![filtering message](assets/fypo_showing_n_annotations.png "filtered annotation display message"){width="600"}

    Change the selection back to "No filter" to see annotations to all terms.

The detailed single-allele phenotype view shows annotations to all
FYPO terms, and includes more details for each annotation. It shows
separate entries for repeat determinations of a given
gene/term/allele/extension combination (if supported by more than one
line of evidence and/or reported in more than one paper), and
annotations to terms:

![gene page phenotype annotations](assets/single_fypo_gene_page_full.png "Single-allele FYPO detailed view on gene page"){width="800"}

1.  The unique ID and name for a term in the phenotype ontology. The
    ID links to a page with additional information, including the term
    definition, any synonyms, relationships to other FYPO terms, and
    annotations to the term or its descendants. (See the [ontology
    term page documentation](/documentation/ontology-term-page) for
    more.)
2.  Allele details, including a name (if one is used in the
    literature) and description (where known). The column is headed
    "Genotypes" for consistency between the single- and multi-allele
    displays. Each genotype name links to a page with full details
    (type, description, and expression) for its allele(s), links to
    gene pages, and a list of all phenotype annotations for the
    genotype. If you can provide a description for any allele shown as
    "unknown", please [contact the PomBase
    curators](mailto:helpdesk@pombase.org).
3.  Mouse over the allele name to show the allele type, which
    indicates whether partial deletions or altered residues refer to
    amino acids or nucleotides, and expression level.
4.  The phenotype display can be filtered to show subsets of the total
    set of annotations. The term filter, available in the summary or
    detailed view, lists several broad phenotypic categories derived
    from high-level FYPO terms. Choose one to restrict the annotation
    display to terms in the selected branch of FYPO. Change the
    selection back to "No filter" to see annotations to all terms. In
    the detailed view, evidence can also be filtered by choosing an
    evidence description from a pulldown. Change the selection back to
    "No filter" to see annotations using any evidence type. Term and
    evidence filters can be combined (note that some term/evidence
    combinations have no matching annotations). When either term or
    evidence filtering is active, a message appears to indicate that
    not all annotations are shown.
5.  A brief descriptor for the type of evidence that supports the
    annotation. The evidence categories come from the [Evidence
    Ontology](http://www.evidenceontology.org/) (ECO).
6.  Information about experimental conditions, such as temperature, type
    of medium used, etc. Descriptions come from a small ontology
    maintained by PomBase curators.
7.  The paper from which the annotation comes.
8.  Phenotype annotations may have extensions to capture expressivity
    (the extent to which a phenotype is expressed; for PomBase
    annotations expressivity extensions are often used to capture
    information about phenotype severity) or penetrance (proportion of a
    population that shows the phenotype), or to document which gene or
    protein used in an assay for level, localisation, etc. *S. pombe*
    genes link to PomBase gene pages. Expressivity and penetrance use
    the relations *has\_expressivity* and *has\_penetrance*
    respectively, and can have values such as "high", "medium", or "low"
    (numerical values may be added in the future if and when the need
    arises). A gene or gene product used in an assay is stored using the
    appropriate PomBase systematic ID and the relation *assayed\_using*;
    the relation is converted to *affecting* in the gene page display.
    If a mutation affects an activity that modifies another gene
    product, extensions may capture the affected enzyme, the affected
    substrate, or both. The relation *assayed\_enzyme* is displayed as
    *affecting activity of* on gene pages, and *assayed\_substrate* is
    shown as *affecting substrate*.

Similar displays are used for multi-allele phenotypes. Unless
otherwise noted below, all items are as described above for
single-allele phenotype displays.

The multi-allele summary shows FYPO terms and genotype descriptions:

![multi-allele FYPO summary view on gene page](assets/multi_fypo_gene_page_summary.png){width="800"}

1.  The FYPO term name, which links to the page for the term.
2.  Genotype details, including a name (if one is used in the
    literature) and descriptions for the relevant alleles (where
    known). Mouse over any genotype name to show more allele details,
    or click to go to the genotype detail page. Multiple genotypes
    annotated to the same term are separated by commas.
3.  Display filter for FYPO terms.

The detailed view includes:

![multi-allele FYPO full view on gene page](assets/multi_fypo_gene_page_full.png){width="800"}

1.  The unique ID and name for a term in the phenotype ontology, with
    links to the FYPO term page.
2.  Genotype details, including a name (if one is used in the
    literature) and descriptions for the relevant alleles (where
    known). Mouse over any genotype name to show more allele details,
    or click to go to the genotype detail page. Multiple genotypes
    annotated to the same term are listed one per line.
3.  Display filter for FYPO terms and evidence (see above).
4.  Evidence description (see above).
5.  Experimental conditions (see above).
6.  The paper from which the annotation comes.

Annotation extensions are also included in the multi-allele Summary and
Full views (although none are included for the annotations in the above
illustrations), using the same display as for single-allele phenotypes.

Also see the [Advanced Search
documentation](/documentation/advanced-search-documentation) for
information on finding genes annotated to phenotype terms.
