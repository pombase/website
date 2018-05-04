# How can I find *S. pombe* genes associated with human disease?
<!-- pombase_categories: Orthology,Finding data -->

*S. pombe* genes whose human orthologs have been implicated in disease
are annotated with terms from the internal PBO vocabulary. To retrieve
all of these genes, you can use the most general "disease associated"
term in a query. In the [advanced search](/query), select
"Disease". You can either start typing 'disease associated', and
choose 'disease_associated' from the autocomplete options, or enter
the ID 'PBO:5000000'.

Also see the FAQs on [finding genes conserved in human](/faq/how-can-i-find-all-s.-pombe-genes-are-conserved-human),
[finding the ortholog of a specific gene](/faq/how-can-i-find-s.-pombe-ortholog-s-human-gene), and on
[downloading the full set of curated orthologs](/faq/how-can-i-obtain-list-human-and-s.-pombe-orthologs).


Example queries:

-  <app-query-link [goToResults]="true" [linkText]="'disease\_associated (PBO:5000000)'"
    [predefinedQueryId]="'all_diseases'">
  </app-query-link>

-  <app-query-link [goToResults]="true" [linkText]="'cancer (PBO:0000239)'"
    [predefinedQueryId]="'cancer'">
  </app-query-link>
