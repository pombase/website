# Gene Page: Gene Ontology

PomBase uses the [Gene Ontology](http://www.geneontology.org/) (GO) to
describe the biological context of genes.

GO consists of three distinct
[ontologies](http://www.geneontology.org/GO.contents.doc.shtml#ontology)
(or sets of vocabularies) that describe a gene’s:

1.  Molecular Function (MF) — single-step activities such as *kinase
    activity* or *transporter activity*
2.  Biological Process (BP) — a series of functions with a common goal
    such as *MAPK cascade* or *cytokinesis*
3.  Cellular component (CC) — the location where the gene product can be
    found, and what complexes it is part of, for instance *nucleus* or
    *fatty acid synthase complex*

A gene product may be
[annotated](http://www.geneontology.org/GO.contents.doc.shtml#annotation)
to several GO terms from each of the three ontologies;
[cyr1](/spombe/result/SPBC19C7.03), for instance, is annotated to
adenylate cyclase activity, magnesium ion binding and protein binding
(MFs), it acts in cAMP biosynthesis and positively regulates protein
import into nucleus (BPs), and is found in the plasma membrane (CC).

The GO annotation display on PomBase gene pages includes ontology term
details and supporting data. The Summary view shows just the essentials;
each unique combination of gene, GO term, and extension(s) is shown
once:

![summary gene page GO
annotations](/sites/pombase.org/files/images/go_gene_page_summary.png){width="784"
height="600"}

**\
**

1.  The GO term name, which links to a page with additional information,
    including the term definition, any synonyms, [relationships to other
    GO terms](#go_str), and a list of genes annotated to the term.
2.  Link to a page with term details and a list of genes annotated to
    the term and its is\_a and part\_of descendants (see the GO
    documentation on [Ontology
    Structure](http://www.geneontology.org/GO.ontology.structure.shtml)
    and [Ontology
    Relations](http://www.geneontology.org/GO.ontology.relations.shtml)
    for more information).
3.  GO annotations may have [extensions](#ann_ext) to capture any of
    several types of additional detail. *S. pombe* genes link to PomBase
    gene pages.
4.  [GO Slim](/browse-curation/fission-yeast-go-slim-terms) terms
    applicable to the gene.

The Full view shows more details, including separate entries for repeat
determinations of a given gene/term/extension combination (if supported
by more than one line of evidence and/or reported in more than one
paper):

![full gene page GO
annotations](/sites/pombase.org/files/images/go_gene_page_full.png){width="781"
height="600"}

**\
**

1.  The unique [ID and name](#id) for a GO term. The ID links to a page
    with additional information, including the term definition, any
    synonyms, [relationships to other GO terms](#go_str), and a list of
    genes annotated to the term.
2.  An abbreviation (code) for the type of [evidence](#evid) that
    supports the annotation. The evidence categories come from the set
    of [evidence codes](http://www.geneontology.org/GO.evidence.shtml)
    defined by the GO Consortium.
3.  An additional identifier that provides supporting details for
    annotations using certain evidence codes (see below and [GO
    documentation](http://www.geneontology.org/GO.format.gaf-2_0.shtml#with_from)).
4.  The paper from which the annotation comes.
5.  Link to a page with term details and a list of genes annotated to
    the term and its is\_a and part\_of descendants (see the GO
    documentation on [Ontology
    Structure](http://www.geneontology.org/GO.ontology.structure.shtml)
    and [Ontology
    Relations](http://www.geneontology.org/GO.ontology.relations.shtml)
    for more information).
6.  GO annotations may have [extensions](#ann_ext) to capture any of
    several types of additional detail. *S. pombe* genes link to PomBase
    gene pages.
7.  [GO Slim](/browse-curation/fission-yeast-go-slim-terms) terms
    applicable to the gene.

**Term ID and name**

Annotations are made to the definition of a term, not the term name
itself, so we recommend users always read the term definition. The
definition of a term can be found by clicking the term ID. This page
will also supply a list of all genes annotated to the specific term.

[]{#go_str}**GO Structure**

GO is structured in a hierarchal order with less specific terms being
parents of more specific child terms. A child term may have multiple
parents and multiple children; the BP *mitosis*, for instance, has child
terms representing each phase of mitosis, as well as parent terms
connecting it to both a cell cycle phase and nuclear division.
Crucially, whenever an annotation is made to a term, the gene product is
automatically annotated to all the parent terms. The ancestry of a term
can be viewed on the page linked to the term ID. For more information,
see the [GO Ontology
Structure](http://www.geneontology.org/GO.ontology.structure.shtml)
documentation.

Multiple relationships exist to describe the links within the
ontologies. A child term can have an *is\_a* relation to the parent
term, where the child is a more specific type of the parent, or a
*part\_of* relationship where the child makes up a part of the parent.
For instance, the mitochondrion *is\_a* intracellular organelle and is
part\_of a cell. Additionally, GO also include regulatory relationships.
For more information on relationships in GO, see the [GO Ontology
Relations](http://www.geneontology.org/GO.ontology.relations.shtml)
documentation.

**[]{#evid}Evidence codes**

In PomBase, every annotation is supported by a reference that states
where the annotation comes from, and an evidence code that describes the
type of data that supports the annotation. An annotation may be inferred
from experimental ‘wet lab’ data, backed by a literature reference and
citing experimental evidence such as
[IDA](http://www.geneontology.org/GO.evidence.shtml#ida) (Inferred from
Direct Assay) or
[IMP](http://www.geneontology.org/GO.evidence.shtml#imp) (Inferred from
Mutant Phenotype). Further information on evidence codes is available in
the [GO Evidence Codes](http://www.geneontology.org/GO.evidence.shtml)
documentation.

Another source of annotations come from computational methods. Please
note that all computational annotations are based on predictions. In
cases where a sequence model has been used to annotate genes, but the
genes annotated based on the model have not been manually checked, the
[IEA](http://www.geneontology.org/GO.evidence.shtml#iea) (Inferred from
Electronic Annotation) evidence code is assigned. If the annotations
have been manually checked other evidence codes may be used, for
instance [ISO](http://www.geneontology.org/GO.evidence.shtml#iso)
(Inferred from Sequence Orthology) or
[ISM](http://www.geneontology.org/GO.evidence.shtml#ism) (Inferred from
Sequence Model). PomBase uses ISO to cross-reference to the roles of
known *S. cerevisiae* genes, and uses ISM when domains present in a gene
product can give clues to its biological role.

For some types of evidence, such as sequence comparisons or interaction
data, it is important to note what gene or gene product was used in the
comparison or detected in the interaction. In these cases the [With/From
column](http://www.geneontology.org/GO.format.gaf-2_0.shtml#with_from)
provides more information regarding the source of the information.

**[]{#ann_ext}Annotation extensions**

Where available, annotation extensions are displayed underneath the GO
term name. The extensions provide additional specificity to the
annotation by linking the term to another ontology term or a gene
product via a relationship. Examples include specifying substrates of
molecular functions or specifying the cellular localization during a
process (for instance, [pka1](/spombe/result/SPBC106.10) has protein
serine/threonine kinase activity and has the substrates
[mei3](/spombe/result/SPBC119.04) and
[rst2](/spombe/result/SPAC6F12.02). It is a cellular component of the
nucleus during nitrogen starvation, but part of the cytoplasm during
glucose starvation).

The GO Consortium provides further information on annotation extensions
in its [annotation
documentation](http://geneontology.org/page/annotation-extension),
including the [file format
guide](http://www.geneontology.org/GO.format.gaf-2_0.shtml#annotation_ext),
on a [wiki
page](http://wiki.geneontology.org/index.php/Annotation_Extension), and
in a
[publication](http://www.biomedcentral.com/1471-2105/15/155/abstract).
PomBase converts many extension names to more human-friendly text, as
described
[here](/documentation/gene-page-annotation-extension-relation-display).

If an extension mentions another *S. pombe* gene, the extension data
will also be displayed as an annotation in the "[Target
Of](/documentation/gene-page-target)" section of the page for that gene.

**Finding other genes annotated to a specific GO term**

From a gene page, all *S. pombe*genes annotated to a term (or its
children) can be found by clicking on a term ID.

Additionally, the [advanced search](/spombe/query/builder) (or ‘query
builder’) can be used to search for all genes annotated to a particular
GO term (see the [advanced search
documentation](/documentation/advanced-search-documentation) for more
information). To find annotations to specific GO terms in organisms
other than *S. pombe* we recommend using
[AmiGO](http://amigo.geneontology.org) or
[QuickGO](http://www.ebi.ac.uk/QuickGO).
