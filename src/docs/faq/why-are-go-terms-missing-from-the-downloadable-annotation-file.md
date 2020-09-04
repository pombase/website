# Why are GO terms missing from the downloadable annotation file?
<!-- pombase_categories: Finding data,Using ontologies -->

The downloadable file of [PomBase GO
annotations](/downloads/go-annotations) is in the GO Consortium's [GAF
format](http://geneontology.org/docs/go-annotation-file-gaf-format-2.1/),
and only includes "direct" annotations, i.e. the actual term-gene
product connections made by manual curation or computational
transfer. When an annotation is made to a term, the gene product is
automatically inferred to be annotated to all the "ancestor" terms in
the ontology. These inferred annotations are used in PomBase web pages
and searches, but are not included in the GAF file. More information
on ontology structure and annotation inference is available in
documentation at [PomBase](/documentation/gene-page-gene-ontology) and
GO )[ontology](http://geneontology.org/docs/ontology-documentation/)
and [annotation](http://geneontology.org/docs/go-annotations/).

When you use GO annotations in any analysis, we strongly recommend
using tools that take ontology structure and transitive inference of
annotations into account.

<!-- uncomment when GAF download goes live: -->
<!-- Annotations downloadable for search results are also in GAF format, so the same considerations apply. -->