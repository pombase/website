# How can I retrieve all *${species_abbrev}* genes?
<!-- pombase_categories: Genome statistics and lists,Finding data -->

The [Names and identifiers page](/downloads/names-and-identifiers)
provides lists of all genes, including non-coding RNA genes. The
gene_IDs_names.tsv file contains the systematic IDs and names for both
protein-coding and non-coding RNA genes, whereas two separate files
are available that also include product descriptions.

The [advanced search](/query) includes a query that retrieves all
protein-coding genes at once, as decribed in 
[this FAQ](/faq/how-can-i-retrieve-all-s.-pombe-protein-coding-genes).

This query retrieves genes of all types (protein-coding, non-coding
RNA, and pseudogenes) by combining the "product type" options with the
OR operator:

<app-query-link [goToResults]="true" [linkText]="'All genes'" [predefinedQueryId]="'canned_query:all_genes'"></app-query-link>

