# How can I find genes in a region using chromosome coordinates?
<!-- pombase_categories: Finding data -->

To retrieve genes in a region in the [advanced search](https://www.pombase.org/query), 
use the "Genome location" query. First, select a chromosome in the
pulldown. You can then either add start and end coordinates to specify
a region, or leave the "Restrict to region" boxes blank to retrieve
all genes on the chromosome.

You can also use the genome browser to find all features (not only
genes), [as described here](/faq/how-can-i-retrieve-sequence-region-using-sequence-coordinates).

Example query:
<app-query-link [goToResults]="true" [linkText]="'Genes between coordinates 1000000-2000000 on chromosome 2'" [predefinedQueryId]="'chr2_1000000-2000000'">
</app-query-link>
