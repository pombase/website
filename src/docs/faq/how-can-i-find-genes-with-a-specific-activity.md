# How can I find genes with a specific activity?
<!-- pombase_categories: Finding data,Using ontologies -->

PomBase uses Gene Ontology (GO) molecular function terms to capture
the activities -- including enzymatic activities, binding,
transporters, etc. -- of gene products. You can therefore use the GO
term query in the [advanced search](/query) to retrieve genes whose
products have a given activity.

In the "GO" query, if you know the ID (for example, "histone
acetyltransferase activity" is [GO:0004402](/term/GO:0004402), and "calcium ion
transmembrane transporter activity" is [GO:0015085](/term/GO:0015085)), type or paste it
into the box. Otherwise, and start typing a name or description; the
autocomplete feature will suggest terms. Choose one to retrieve
annotated genes. You can try using more specific or less specific
terms to retrieve the results that best fit your expectations and
needs. See the [advanced search documentation](documentation/advanced-search)
and the [Gene Page GO documentation](/documentation/gene-page-gene-ontology) 
for more information, including how [ontology searches retrieve
annotations] to general terms.

Example query: <app-query-link [goToResults]="true" [linkText]="'phosphoprotein phosphatase activity (GO:0004721)'"
    [predefinedQueryId]="'GO_4721'">
</app-query-link>


