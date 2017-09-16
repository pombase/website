# How can I find genes with a specific activity?
<!-- pombase_categories: Querying/Searching,Using Ontologies -->

PomBase uses Gene Ontology (GO) molecular function terms to capture the
activities -- including enzymatic activities, binding, transporters,
etc. -- of gene products. You can therefore use the GO filters in the
Advanced Search to retrieve genes whose products have a given activity.

In the "Select Filter" pulldown, if you know the ID (for example,
"histone acetyltransferase activity" is GO:0004402, and "calcium ion
transmembrane transporter activity" is GO:0015085) choose "GO ID", and
then type or paste the ID into the box. Otherwise, choose "GO Term Name"
and start typing; the autocomplete feature will suggest terms. Choose
one, and click the Submit button to run the search. You can download the
list in plain text or a few other formats from the query results page.
You can try using more specific or less specific terms to retrieve the
results that best fit your expectations and needs. See the [Advanced
Search documentation](/documentation/advanced-search-documentation)and
the [Gene Page GO
documentation](/documentation/gene-page-gene-ontology)for more
information, including how [ontology searches retrieve
annotations](/documentation/advanced-search-documentation#filt)to
general terms.

Example query: [phosphoprotein phosphatase activity
(GO:0004721)](/spombe/query/builder?filter=37&value=%5B%7B%22param%22:%7B%22filter_1%22:%7B%22filter%22:%221%22,%22query%22:%22GO:0004721%22%7D%7D,%22filter_count%22:%221%22%7D%5D)

