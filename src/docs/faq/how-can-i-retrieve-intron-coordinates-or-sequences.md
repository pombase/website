# How can I retrieve intron coordinates or sequences?
<!-- pombase_categories: Finding data -->

%%if db=PomBase
Downloadable intron datasets are available in FASTA format from the
[Intron Data](/downloads/intron-data) page.
%%end db=PomBase

You can also find genes with introns using the ${database_name} [advanced search](/query).
To find all genes with introns, search for genes with a specified number
of exons, and use the range 2 (i.e. at least one intron) to 20 (more
than the maximum known, 16 introns). You can also restrict the search to
protein-coding genes. Note that the ${database_name} count includes introns in
UTRs.

Instructions for searching ${database_name}

1.  Go to the [advanced search](/query).
2.  Select the "Coding exons" query.
3.  Enter values: min 2, max 20. Click "Search".
4.  Optional: to restrict to protein-coding genes, select the "Product
    type" query, then choose "protein". Use the "Intersect" (AND
    operator") button to combine the queries.

Click on a count in the query history to see the results, with a
button for "Download" options including coordinates and sequence.

Also see the [FAQ on finding sequence features in a region](/faq/how-can-i-find-all-sequence-features-region-using-chromosome-coordinates).

Query link: <app-query-link [goToResults]="true" [linkText]="'protein-coding genes with 2-20 exons'" [predefinedQueryId]="'2-20_exons'"></app-query-link>
