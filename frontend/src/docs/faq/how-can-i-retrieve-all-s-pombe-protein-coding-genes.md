# How can I retrieve all S. pombe protein-coding genes?
<!-- pombase_categories: Datasets,Genome Statistics and Lists,Querying/Searching -->

We plan to offer a downloadable list of protein-coding genes (5052 as of
release version 23\_47, October 2014) in the near future.

In the meantime, you can use the Advanced Search to retrieve a list. All
protein coding genes have the type "protein coding", but this type also
includes a few transposon genes and several genes that are dubious (i.e.
predicted by automated methods considered unlikely to actually encode
protein), which you will presumably want to exclude from the set. To do
so, use the NOT operator and the "Annotation Status" filter. The query
is:

Genes By Type protein coding\
NOT Annotation Status dubious\
NOT Annotation Status transposon

![query for protein coding genes](/sites/pombase.org/files/images/protein_coding_gene_query.png)

You can also perform the query in separate steps:

1.  In the New Query panel, query for Feature Type protein coding
    (query 1)
2.  New Query - NOT Annotation Status dubious (query 2)
3.  New Query - NOT Annotation Status transposon (query 3)
4.  In the Query Management panel, select 2 and 3 and combine them with
    OR (union); this forms query 
5.  Also in Query Management, select query 1 and query 4, and follow the
    instructions to combine them with NOT.

See the [Advanced Search documentation](/documentation/advanced-search-documentation)for more
information on performing the search described here.

Query link: [Protein-coding genes (excluding 'dubious' and 'transposon' status)](/spombe/query/builder?filter=37&value=%5B%7B)

