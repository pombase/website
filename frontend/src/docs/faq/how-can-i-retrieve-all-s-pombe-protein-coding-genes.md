# How can I retrieve all *S. pombe* protein-coding genes?
<!-- pombase_categories: Finding data,Genome statistics and lists -->

The [advanced search](/query) includes a query that retrieves all
protein-coding genes at once. Click "Canned queries", then click "All
protein coding genes (ex. dubious and transposon)".

Further explanation: All protein coding genes have the type "protein
coding", but this type also includes a few transposon genes and
several genes that are dubious (i.e.  predicted by automated methods
considered unlikely to actually encode protein), which you will
presumably want to exclude from the set. The canned query does this.

Query link: <app-query-link [goToResults]="true" [linkText]="'Protein-coding genes (excluding &quot;dubious&quot; and &quot;transposon&quot; status)'" [predefinedQueryName]="'canned_query:all_protein_coding_ex_dubious_and_transposon'"></app-query-link>
