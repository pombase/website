# Can I get a list of essential pombe genes?
<!-- pombase_categories: Datasets,Genome Statistics and Lists,Querying/Searching,Using Ontologies -->

If an essential gene is deleted, the cell cannot survive under normal
laboratory conditions. A search for deletion alleles annotated to the
Fission Yeast Phenotype Ontology term "inviable vegetative cell
population" (FYPO:0002061) would therefore identify essential fission
yeast genes. Similarly, deletion alleles annotated to "viable vegetative
cell population" (FYPO:0002060) represent non-essential genes.

**Downloadable summary**

A [set of "viability summary" data](ftp://ftp.ebi.ac.uk/pub/databases/pombase/pombe/Phenotype_annotations/FYPOviability.tsv),
as shown at the top of the FYPO table on each gene page, is available as
a downloadable file. The file has two columns: the gene systematic ID
and one of three values: "viable", "inviable" or "condition-dependent".

**Querying**

-   To find genes annotated to "inviable vegetative cell population",
    select the "FYPO ID" filter and type or paste the ID, FYPO:0002061.
    Set the Allele Expression pulldown to "Null Expression" and submit
    the query. The results include all genes that showed inviable
    phenotypes in the HTP deletion project as well some manually
    annotated genes. Do the same for viable (FYPO:0002060).
-   For some deletion mutants, viability depends on experimental
    conditions, which cannot yet be queried in PomBase. These genes are
    annotated to both viable (FYPO:0002060) and inviable (FYPO:0002061)
    at once. To find them, use the "AND" operator in the Query
    Management panel (this search can also be set up all at once in the
    New Query panel).
-   See the [Advanced Search     documentation](/documentation/advanced-search-documentation) for more
    information on performing the searches described here.

**A brief note about FYPO terms**

At present, there are very few null mutants annotated as inviable in
life cycle stages other than vegetative growth, and "inviable vegetative
cell population" best fits the most common usage of "essential gene". If
you do want to include other stages (such as "inviable spore"), you can
use the very generic term "inviable cell population" (FYPO:0002059) or
"viable cell population" (FYPO:0002058) in your query. All of the
caveats about alleles and conditions still apply.

**Query links**

-   [Null alleles annotated to "inviable vegetative cell population"     (FYPO:0002061)](/spombe/query/builder?filter=37&value=%5B%7B%22param%22:%7B%22filter_1%22:%7B%22filter%22:%2219%22,%22query_1%22:%22FYPO:0002061%22,%22query_2%22:%22Null%22%7D%7D,%22filter_count%22:%221%22%7D%5D) 
-   [Null alleles annotated to "viable vegetative cell population"     (FYPO:0002060)](/spombe/query/builder?filter=37&value=%5B%7B%22param%22:%7B%22filter_1%22:%7B%22filter%22:%2219%22,%22query_1%22:%22FYPO:0002060%22,%22query_2%22:%22Null%22%7D%7D,%22filter_count%22:%221%22%7D%5D) 
-   [Null alleles annotated to both FYPO:0002061 and     FYPO:0002060](/spombe/query/builder?filter=37&value=%5B%7B%22param%22:%7B%22filter_1%22:%7B%22filter%22:%2219%22,%22query_1%22:%22FYPO:0002061%22,%22query_2%22:%22Null%22%7D,%22filter_2%22:%7B%22operator%22:%22AND%22,%22filter%22:%2219%22,%22query_1%22:%22FYPO:0002060%22,%22query_2%22:%22Null%22%7D%7D,%22filter_count%22:%222%22%7D%5D) 


