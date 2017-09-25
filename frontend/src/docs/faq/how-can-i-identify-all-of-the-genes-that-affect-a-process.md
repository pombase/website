gg# How can I identify all of the genes that affect a process?
<!-- pombase_categories: Finding data,Using ontologies -->

The best way to find genes that have any effect on a process, we
recommend searching for both GO and FYPO terms relevant to the process.

As described in the [FAQ on GO and FYPO annotations](/faq/why-are-some-genes-with-an-abnormal-phenotype-annotated-to-the-corresponding-go-process-while-others-are-not),
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
for "FYPO:0000078 (abnormal cellular respiration)"; search for
"GO:0045333 (cellular respiration)"; and then combine them in a third
query. For any process, you can try using more specific or less
specific terms to retrieve the results that best fit your expectations
and needs.

<!--
Example query: [genes annotated to 'abnormal cellular respiration' (FYPO:0000078) or 'cellular respiration' (GO:0045333)](/spombe/query/builder?filter=37&value=%5B%7B%22operator%22:%22OR%22,%22param%22:%7B%22set_1%22:%7B%22param%22:%7B%22filter_1%22:%7B%22filter%22:%221%22,%22query%22:%22GO:0045333%22%7D%7D,%22filter_count%22:%221%22%7D,%22set_2%22:%7B%22param%22:%7B%22filter_1%22:%7B%22filter%22:%2219%22,%22query_1%22:%22FYPO:0000078%22,%22query_2%22:%22all_alleles%22%7D%7D,%22filter_count%22:%221%22%7D%7D%7D%5D) 
-->
