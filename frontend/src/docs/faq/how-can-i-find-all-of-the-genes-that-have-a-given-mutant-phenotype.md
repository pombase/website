# How can I find all of the genes that have a given mutant phenotype?
<!-- pombase_categories: Querying/Searching,Using Ontologies -->

You can search for genes annotated to a Fission Yeast Phenotype Ontology
term in the Advanced Search (http://www.pombase.org/spombe/query/builder
or go to the Find tab and click "Advanced Search").

In the "Select Filter" pulldown, if you know the ID (for example,
"inviable cell" is FYPO:0000049, and "elongated cell" is FYPO:0000017)
choose "FYPO ID", and then type or paste the ID into the box. Otherwise,
choose "FYPO Term Name" and start typing; the autocomplete feature will
suggest phenotypes. Choose one, and click the Submit button to run the
search. You can download the list in plain text or a few other formats
from the query results page.

Note that the FYPO search retrieves annotations by following the *is\_a,
part\_of, output\_of, has\_output,*and *has\_part*relationships in the
ontology. For example, FYPO includes the relation "inviable swollen
elongated cell with enlarged nucleus" (FYPO:0002083) *has\_part*"swollen
cell" (FYPO:0000025). Genes annotated to FYPO:0002083 will therefore be
retrieved in a search for FYPO:0000025. See the [Advanced Search
documentation](/documentation/advanced-search-documentation)for more
information.

Example query: [Genes annotated to "elongated cell" (FYPO:0000017), all
alleles](/spombe/query/builder?filter=37&value=%5B%7B%22param%22:%7B%22filter_1%22:%7B%22filter%22:%2219%22,%22query_1%22:%22FYPO:0000017%22,%22query_2%22:%22all_alleles%22%7D%7D,%22filter_count%22:%221%22%7D%5D)

Also see the FAQ on [finding essential
genes](/faq/can-i-get-list-essential-pombe-genes).

