# How can I get GO annotation search results to match AmiGO?
<!-- pombase_categories: Querying/Searching,Using Ontologies -->

In [AmiGO](http://amigo.geneontology.org/), the "term association"
search retrieves gene products annotated to a GO term and to any of its
child terms, following all relationships in the ontology, including
*regulates*.\
\
The PomBase GO search excludes *regulates*relationships by default, so
annotation totals will differ from those in AmiGO for any terms that
have child terms connected by *regulates*links. For example, a search
for "cytokinesis" in AmiGO will include genes annotated to "regulation
of cytokinesis", whereas a search in PomBase will not. To include
regulation, and have results that match AmiGO, you must search for both
terms -- see [instructions
here](/faq/how-can-i-search-genes-involved-both-go-process-and-regulation-process).\
\
For more information on *regulates*, see the [GO Ontology Relations
documentation](http://www.geneontology.org/GO.ontology.relations.shtml).

