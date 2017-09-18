# How can I find protein localization data?
<!-- pombase_categories: Querying/Searching,Using Ontologies -->

Gene Ontology (GO) cellular component annotations capture the
localizations of gene products to subcellular structures such as
organelles or complexes. GO Cellular Component annotations are displayed
on PomBase gene pages as described in the [PomBase GO
documentation](/documentation/gene-page-gene-ontology). The GO
Consortium provides
[documentation](http://geneontology.org/page/cellular-component-ontology-guidelines)that
describes what the Cellular Component ontology includes. To search for
proteins (or functional RNAs) with a particular localization, use the
[Gene Ontology filter in the Advanced
Search](/documentation/advanced-search-documentation)to find genes
annotated to the relevant GO Cellular Component term(s).

Pombase GO Cellular Component annotations include data from the
whole-genome localization study ( [Matsuyama *et
al.*2006](http://www.ncbi.nlm.nih.gov/pubmed/16823372)) as well as
manually curated data from papers on small-scale experiments, and
inferences from ortholog annotations. Macromolecular complex annotations
are also available in a file (see
[FAQ](/faq/there-list-protein-complexes-s-pombe-and-their-subunits)).

Example query: [nucleus
(GO:0005634)](/spombe/query/builder?filter=37&value=%5B%7B%22param%22:%7B%22filter_1%22:%7B%22filter%22:%221%22,%22query%22:%22GO:0005634%22%7D%7D,%22filter_count%22:%221%22%7D%5D)

