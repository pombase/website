# How can I find protein localization data?
<!-- pombase_categories: Finding data,Using ontologies -->


Gene Ontology (GO) cellular component annotations capture the
localizations of gene products to subcellular structures such as
organelles or complexes. GO Cellular Component annotations are
displayed on PomBase gene pages as described in the 
[PomBase GO documentation](/documentation/gene-page-gene-ontology).
The GO Consortium' ontology 
[overview]( graph](http://geneontology.org/docs/ontology-documentation/)
that describes what the Cellular Component ontology includes. To
search for proteins (or functional RNAs) with a particular
localization, use the GO query in the [advanced search](/query) to
find genes annotated to the relevant GO Cellular Component term(s).

Pombase GO Cellular Component annotations include data from the
whole-genome localization study (Matsuyama et al. 2006) as well as
manually curated data from papers on small-scale experiments, and
inferences from ortholog annotations. Macromolecular complex
annotations are also available in a file (see
[FAQ](faq/there-list-protein-complexes-s.-pombe-and-their-subunits)).

Example query: <app-query-link [goToResults]="true" [linkText]="'nucleus (GO:0005634)'"
    [predefinedQueryId]="'GO_5634'">
</app-query-link>
