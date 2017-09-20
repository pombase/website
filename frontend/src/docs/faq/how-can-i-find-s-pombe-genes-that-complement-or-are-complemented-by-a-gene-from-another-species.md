# How can I find S. pombe genes that complement or are complemented by a gene from another species?
<!-- pombase_categories: Querying/Searching,Using Ontologies -->

If there is complementation data available for an *S. pombe* gene, it
will be displayed in the Complementation section of the gene page. For
example, [*ura3*](/spombe/result/SPAC57A10.12c) can be complemented by
*S. cerevisiae*
[*URA1*](http://www.yeastgenome.org/locus/S000001699/overview), and
itself complements human
[DHODH](http://www.genenames.org/cgi-bin/gene_symbol_report?hgnc_id=HGNC:2867).\
\
To search for complementation annotations, use one of the "PBO" filters
in the [Advanced Search](/spombe/query/builder) (see the
[documentation](/documentation/advanced-search-documentation) for help
with searching). The complementation descriptions are stored as entries
in the [PBO](/faq/what-pbo-option-advanced-search) internal ontology, so
a search for PBO term names that match "complements" or "complemented
by" will retrieve genes with complementation data curated. The most
general term, "complementation" (PBO:2000000) retrieves all genes that
have any complementation annotation.

Example queries:

-   [Genes with any complementation annotation     (PBO:2000000)](/spombe/query/builder?filter=37&value=%5B%7B%22param%22:%7B%22filter_1%22:%7B%22filter%22:%2223%22,%22query%22:%22PBO:2000000%22%7D%7D,%22filter_count%22:%221%22%7D%5D) 
-   [functionally complements S. cerevisiae URA1     (PBO:0011087)](/spombe/query/builder?filter=37&value=%5B%7B%22param%22:%7B%22filter_1%22:%7B%22filter%22:%2223%22,%22query%22:%22PBO:0011087%22%7D%7D,%22filter_count%22:%221%22%7D%5D) 

 

