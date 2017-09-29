# How can I retrieve intron coordinates or sequences?
<!-- pombase_categories: Finding data -->

Downloadable intron datasets are available in FASTA format from the
[Intron Data](/downloads/intron-data) page.

You can also find genes with introns using the PomBase [advanced search](/query).
To find all genes with introns, search for genes with a specified number
of exons, and use the range 2 (i.e. at least one intron) to 20 (more
than the maximum known, 16 introns). You can also restrict the search to
protein-coding genes. Note that the PomBase count includes introns in
UTRs.

Instructions for searching PomBase

1.  Go to the [advanced search](/query).
2.  Select the "Coding exons" query.
3.  Enter values: min 2, max 20. Click "Search".
4.  Optional: to restrict to protein-coding genes, select the "Product
    type" query, then choose "protein". Use the "Intersect" (AND
    operator") button to combine the queries.

Click on a count in the query history to see the results, with a
button for "Download" options including coordinates and sequence.

Also see the [FAQ on finding sequence features in a region](/faq/how-can-i-find-all-sequence-features-region-using-chromosome-coordinates).

<!--
Query link: [protein-coding genes with 2-20 exons](/spombe/query/builder?filter=37&value=%5B%7B%22param%22:%7B%22filter_1%22:%7B%22filter%22:%228%22,%22query_1%22:%222%22,%22query_2%22:%2220%22%7D,%22filter_2%22:%7B%22operator%22:%22AND%22,%22filter%22:%229%22,%22query%22:%22protein_coding%22%7D%7D,%22filter_count%22:%222%22%7D%5D) 
-->



