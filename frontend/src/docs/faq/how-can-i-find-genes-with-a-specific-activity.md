# How can I find genes with a specific activity?
<!-- pombase_categories: Finding data,Using ontologies -->

PomBase uses Gene Ontology (GO) molecular function terms to capture
the activities -- including enzymatic activities, binding,
transporters, etc. -- of gene products. You can therefore use the GO
term query in the [advanced search](/query) to retrieve genes whose
products have a given activity.

In the "GO" query, if you know the ID (for example, "histone
acetyltransferase activity" is GO:0004402, and "calcium ion
transmembrane transporter activity" is GO:0015085), type or paste it
into the box. Otherwise, and start typing a name or description; the
autocomplete feature will suggest terms. Choose one to retrieve
annotated genes. You can try using more specific or less specific
terms to retrieve the results that best fit your expectations and
needs. See the [advanced search documentation](documentation/advaced-search)
and the [Gene Page GO documentation](/documentation/gene-page-gene-ontology) 
for more information, including how [ontology searches retrieve
annotations] to general terms.

<!--
Example query: [phosphoprotein phosphatase activity (GO:0004721)](/spombe/query/builder?filter=37&value=%5B%7B%22param%22:%7B%22filter_1%22:%7B%22filter%22:%221%22,%22query%22:%22GO:0004721%22%7D%7D,%22filter_count%22:%221%22%7D%5D) 
-->
