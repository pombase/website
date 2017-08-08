# Priority unstudied genes

Fission yeast genes are classed as "unknown" if there is no information
about the broad cellular role (biological process) in which it
participates (corresponding to any of the [high level GO Slim classes](/browse-curation/fission-yeast-go-slim-terms)). For these, we
have been unable to identify a broad biological role based on
experimental data in fission yeast or any other organism. Note that, as
all genes in fission yeast have been curated, these genes are documented
as "unknown" (they are not "unannotated").

In fission yeast the "unknown" inventory is 
<app-query-link [predefinedQueryName]="'priority-unstudied-genes:unknown_genes'"></app-query-link> entries, many of
which are apparently species-specific. However, a large number
(<app-query-link [predefinedQueryName]="'priority-unstudied-genes:conserved_unknown'"></app-query-link>) are conserved, and a significant
number of these (<app-query-link [predefinedQueryName]="'priority-unstudied-genes:conserved_unknown_AND_conserved_in_vertebrates'"></app-query-link>) have orthologs in vertebrates. These genes are
listed below.

You can recreate this query, or variations of it, using the Advanced
Search. See the relevant FAQ and the [Advanced Search](/query)
documentation for details. You can also send this list directly to the
advanced search (For example to mine for phenotypes or locations of
interest).

<app-predefined-query-results [predefinedQueryName]="'priority-unstudied-genes:conserved_unknown_AND_conserved_in_vertebrates'"></app-predefined-query-results>
