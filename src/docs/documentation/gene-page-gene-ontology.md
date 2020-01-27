## Gene page: Gene Ontology

PomBase uses the [Gene Ontology](http://www.geneontology.org/) (GO) to
describe the biological context of genes.

GO consists of three distinct
[ontologies](http://www.geneontology.org/docs/ontology-documentation/)
(or sets of vocabularies) that describe a gene's:

1.  Molecular Function (MF) — single-step activities such as *kinase
    activity* or *transporter activity*
2.  Biological Process (BP) — a series of functions with a common goal
    such as *MAPK cascade* or *cytokinesis*
3.  Cellular component (CC) — the location where the gene product can be
    found, and what complexes it is part of, for instance *nucleus* or
    *fatty acid synthase complex*

A gene product may be
[annotated](http://www.geneontology.org/docs/go-annotations/) to several GO
terms from each of the three ontologies; [mcm3](/gene/SPCC1682.02c),
for instance, is annotated to ATP-dependent DNA helicase activity, ATP
binding, and DNA replication origin binding (MFs), it acts in mitotic
DNA replication initiation and negatively regulates the MCM helicase
activity (BPs), and is found locations including the replication fork
and the pre-replicative complex (CC).

Each table includes ontology term details and supporting data. The GO
annotation display on PomBase gene pages includes ontology term
details and supporting data. The summary view shows just the
essentials: The list of terms is filtered, using the ontology
structure, so that it shows only the most specific terms used to
annotate a genotype, and each unique combination of gene, GO term, and
extension(s) is shown once:

![summary gene page GO annotations](assets/go_gene_page_summary.png){width="600"}

1.  The GO term name, which links to a page with additional
    information, including the term definition, any synonyms,
    relationships to other GO terms, and annotations to the
    term or its descendants. (See the PomBase [ontology term page documentation](/documentation/ontology-term-page) and the GO
    documentation on the [GO graph](http://geneontology.org/docs/ontology-documentation/) and
    [Relations in GO](http://geneontology.org/docs/ontology-relations/) for
    more information.)
2.  [GO Slim](/browse-curation/fission-yeast-go-slim-terms) terms
    applicable to the gene.
3.  GO annotations may have [extensions](#annotation-extensions) to capture any of
    several types of additional detail. *S. pombe* genes link to PomBase
    gene pages, and ontology term names link to ontology term pages.

The detailed view shows annotations to all GO terms, and includes more
details for each annotation. It shows separate entries for repeat
determinations of a given gene/term/extension combination (if
supported by more than one line of evidence and/or reported in more
than one paper), and annotations to terms hidden in the summary view:


![full gene page GO annotations](assets/go_gene_page_full.png){width="800"}


1.  The unique ID and name for a GO term, linked to an ontology
    term page as described above.
2.  An abbreviation (code) for the type of (see "Evidence codes" below) that
    supports the annotation. The evidence categories come from the set
    of [evidence codes](http://geneontology.org/docs/guide-go-evidence-codes/)
    defined by the GO Consortium.

3.  An additional ontology term or identifier that provides supporting
    details for annotations using certain evidence codes (see below
    and [GO documentation](http://geneontology.org/docs/go-annotation-file-gaf-format-2.1/)).
4.  An optional qualifier that modifies the connection between the
    gene product and the GO term. Entries come from the set of allowed qualifiers described in
    [GO's annotation overview](http://geneontology.org/docs/go-annotations/)
    or internal PomBase usage.
5.  The paper from which the annotation comes.
6.  The number of genes annotated to the term, linked to an ontology
    term page as described above.
7.  [GO Slim](/browse-curation/fission-yeast-go-slim-terms) terms
    applicable to the gene.
8.  GO annotations may have extensions(see "Annotation extensions" below) to capture any of
    several types of additional detail. *S. pombe* genes link to PomBase
    gene pages.

#### Term ID and name ####

Annotations are made to the definition of a term, not the term name
itself, so we recommend that users always read the term
definition. The definition of a term can be found on the ontology term
page linked to the term name and ID.

#### GO Structure ####

GO is structured in a hierarchal order with less specific terms being
parents of more specific child terms. A child term may have multiple
parents and multiple children; the BP *mitotic sister chromatid
segregation*, for instance, has child terms representing each part of
the segregation process (sister chromatid cohesion, separation, etc.)
as well as parent terms connecting it to both the mitotic cell cycle
and chromosome segregation.  Crucially, whenever an annotation is made
to a term, the gene product is automatically annotated to all the
parent terms. The ancestry of a term can be viewed in browsers such as
AmiGO or QuickGO, accessible via links on the ontology term page. For
more information, see the [GO graph](http://geneontology.org/docs/ontology-documentation/)
documentation.

Multiple relationships exist to describe the links within the
ontologies. A child term can have an *is\_a* relation to the parent
term, where the child is a more specific type of the parent, or a
*part\_of* relationship where the child makes up a part of the parent.
For instance, the mitochondrion *is\_a* intracellular organelle and is
part\_of a cell. Additionally, GO also include regulatory relationships.
For more information on relationships in GO, see the 
[Relations in GO](http://geneontology.org/docs/ontology-relations/)
documentation.

#### Evidence codes ####

In PomBase, every annotation is supported by a reference that states
where the annotation comes from, and an evidence code that describes
the type of data that supports the annotation. An annotation may be
inferred from experimental ‘wet lab’ data, backed by a literature
reference and citing experimental evidence such as
[IDA](http://wiki.geneontology.org/index.php/Inferred_from_Direct_Assay_(IDA))
(Inferred from Direct Assay) or
[IMP](http://wiki.geneontology.org/index.php/Inferred_from_Mutant_Phenotype_(IMP))
(Inferred from Mutant Phenotype). Further information on evidence
codes is available in the [GO Evidence Codes](http://geneontology.org/docs/guide-go-evidence-codes/)
documentation.

Another source of annotations come from computational methods. Please
note that all computational annotations are based on predictions. In
cases where a sequence model has been used to annotate genes, but the
genes annotated based on the model have not been manually checked, the
[IEA](http://wiki.geneontology.org/index.php/Inferred_from_Electronic_Annotation_(IEA))
(Inferred from Electronic Annotation) evidence code is assigned. If
the annotations have been manually checked other evidence codes may be
used, for instance
[ISO](http://wiki.geneontology.org/index.php/Inferred_from_Sequence_Orthology_(ISO))
(Inferred from Sequence Orthology) or
[ISM](http://wiki.geneontology.org/index.php/Inferred_from_Sequence_Model_(ISM))
(Inferred from Sequence Model). PomBase uses ISO to cross-reference to
the roles of known *S. cerevisiae* genes, and uses ISM when domains
present in a gene product can give clues to its biological role.

For some types of evidence, such as sequence comparisons or
interaction data, it is important to note what gene or gene product
was used in the comparison or detected in the interaction. In these
cases the [With/From column](http://geneontology.org/docs/go-annotation-file-gaf-format-2.1/)
provides more information regarding the source of the information.

#### Annotation extensions ####

Where available, annotation extensions are displayed underneath the GO
term name. The extensions provide additional specificity to the
annotation by linking the term to another ontology term or a gene
product via a relationship. Examples include specifying substrates of
molecular functions or specifying the cellular localization during a
process (for instance, [pka1](/gene/SPBC106.10) has protein
serine/threonine kinase activity and has the substrates
[mei3](/gene/SPBC119.04) and [rst2](/gene/SPAC6F12.02). It is a
cellular component of the nucleus during nitrogen starvation, but
found in the vacuole during glucose starvation).
g
The GO Consortium provides further information on annotation
extensions in its [file format guide](http://geneontology.org/docs/go-annotation-file-gaf-format-2.1/),
on a [wiki page](http://wiki.geneontology.org/index.php/Annotation_Extension),
and in publications from [2014](https://www.ncbi.nlm.nih.gov/pubmed/?term=24885854) and [2017](https://www.ncbi.nlm.nih.gov/pubmed/?term=27812947).
PomBase converts many extension names to more human-friendly text, as
described [here](/documentation/annotation-extension-relation-display).

If an extension mentions another *S. pombe* gene, the extension data
will also be displayed as an annotation in the "[Target of](/documentation/gene-page-target)" 
section of the page for that gene.

#### Finding other genes annotated to a specific GO term ####

From a gene page, all *S. pombe* genes annotated to a term (or its
children) can be found by clicking on a term name or ID to reach the
ontology term page.

Additionally, the [advanced search](/query) can be used to search for
all genes annotated to a particular GO term (see the [advanced search documentation](/documentation/advanced-search) 
for more information). To find annotations to specific GO terms in organisms
other than *S. pombe* we recommend using
[AmiGO](http://amigo.geneontology.org) or
[QuickGO](http://www.ebi.ac.uk/QuickGO).
