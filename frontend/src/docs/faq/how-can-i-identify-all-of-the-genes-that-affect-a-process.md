# How can I identify all of the genes that affect a process?
<!-- pombase_categories: Finding data,Using ontologies -->

The best way to find genes that have any effect on a process, we
recommend searching for both GO and FYPO terms relevant to the process.

As described in the [FAQ on GO and FYPO annotations](/faq/why-are-some-genes-abnormal-phenotype-annotated-corresponding-go-process-while-others-are-not),
PomBase curators annotate all genes with phenotypes that affect a
process, whereas GO annotations are restricted to genes whose products
act directly in a process or its regulation. By querying for genes
annotated to either a GO term or a FYPO term, you can find genes with
relevant phenotypes (including "downstream effects") as well as genes
involved in a process (with or without mutant phenotypes affecting the
process).

Use the union (OR operator) button in the PomBase [advanced search](/query), 
available in the query history, as described in the [advanced search documentation](documentation/advanced-search). 
For example, to find genes that affect cellular respiration, search
for "[FYPO:0000078](/term/FYPO:0000078) (abnormal cellular respiration)"; search for
"[GO:0045333](/term/GO:0045333) (cellular respiration)"; and then combine them in a third
query. For any process, you can try using more specific or less
specific terms to retrieve the results that best fit your expectations
and needs.

Example query: <app-query-link [goToResults]="true" [linkText]="'genes annotated to 'abnormal cellular respiration' (FYPO:0000078) or 'cellular respiration' (GO:0045333)'"
    [predefinedQueryName]="'FYPO_78_or_GO_45333'">
</app-query-link>
