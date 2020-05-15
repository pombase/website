### Priority unstudied genes

Fission yeast genes are classed as "unknown" if there is no information
about the broad cellular role (biological process) in which it
participates (corresponding to any of the [high level GO biological process slim classes](/browse-curation/fission-yeast-go-slim-terms)). For these, we
have been unable to identify a broad biological role based on
experimental data in fission yeast or any other organism. Note that, as
all genes in fission yeast have been curated, these genes are documented
as "unknown" (they are not "unannotated").

In fission yeast the "unknown" inventory is 
<app-query-link [goToResults]="true" [predefinedQueryId]="'priority-unstudied-genes:unknown_genes'"></app-query-link> entries, many of
which are apparently found only in the fission yeast clade. However, a large number
(<app-query-link [goToResults]="true" [predefinedQueryId]="'priority-unstudied-genes:conserved_unknown'"></app-query-link>) are conserved, and a significant
number of these (<app-query-link [goToResults]="true" [predefinedQueryId]="'priority-unstudied-genes:conserved_unknown_AND_conserved_in_vertebrates'"></app-query-link>) have orthologs in vertebrates. These genes are
listed below.

You can recreate this query, or variations of it, using the Advanced
Search. See the [relevant FAQ](/faq/how-can-i-find-all-s.-pombe-genes-are-conserved-human)
and the [Advanced Search](/query) documentation for details. You can also
send this list directly to the advanced search (For example to mine
for phenotypes or locations of interest).

<app-predefined-query-results [description]="'Unstudied genes'" [predefinedQueryId]="'priority-unstudied-genes:conserved_unknown_AND_conserved_in_vertebrates'"></app-predefined-query-results>
