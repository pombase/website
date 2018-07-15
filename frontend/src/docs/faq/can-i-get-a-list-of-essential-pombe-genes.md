# Can I get a list of essential pombe genes?
<!-- pombase_categories: Finding data,Genome statistics and lists,Using ontologies -->

If an essential gene is deleted, the cell cannot survive under normal
laboratory conditions. A search for deletion alleles annotated to the
Fission Yeast Phenotype Ontology term "inviable vegetative cell
population" ([FYPO:0002061](/term/FYPO:0002061)) would therefore identify essential fission
yeast genes. Similarly, deletion alleles annotated to "viable vegetative
cell population" ([FYPO:0002060](/term/FYPO:0002177)) represent non-essential genes.

Note that viability/inviability annotations are fairly complete for
protein-coding genes, but very few non-coding RNA genes have been
tested.

**Downloadable summary**

A [set of "viability summary" data](ftp://ftp.ebi.ac.uk/pub/databases/pombase/pombe/Phenotype_annotations/FYPOviability.tsv),
as shown at the top of the FYPO table on each gene page, is available as
a downloadable file. The file has two columns: the gene systematic ID
and one of three values: "viable", "inviable" or "condition-dependent".

**Querying**

-   To find genes annotated to "inviable vegetative cell population",
    You can also set up the query manually: select the "phenotype"
    query and type or paste the ID, FYPO:0002061.  Select the "Null"
    option for "Expresion level" and submit the query. The results
    include all genes that showed inviable phenotypes in the HTP
    deletion project as well some manually annotated genes. Similarly,
    there is a query for genes annotated to "viable vegetative cell
    population" (FYPO:0002060).

-   For some deletion mutants, viability depends on experimental
    conditions, which cannot yet be queried in PomBase. These genes
    are annotated to both viable (FYPO:0002060) and inviable
    (FYPO:0002061) at once. To find them, do both searches above, then
    click the boxes beside both in the query history table and click
    the "Intersect" button (equivalent to the "AND" operator).

-   See the [advanced search documentation](/documentation/advanced-search) for more
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

-   <app-query-link [goToResults]="true" [linkText]="'Null alleles annotated to &quot;inviable vegetative cell population&quot; (FYPO:0002061)'" [predefinedQueryId]="'null_inviable'"></app-query-link>
-   <app-query-link [goToResults]="true" [linkText]="'Null alleles annotated to &quot;viable vegetative cell population&quot; (FYPO:0002060)'" [predefinedQueryId]="'null_viable'"></app-query-link>
-   <app-query-link [goToResults]="true" [linkText]="'Null alleles annotated to both FYPO:0002061 and FYPO:0002060'" [predefinedQueryId]="'null_viable_and_inviable'"></app-query-link>
