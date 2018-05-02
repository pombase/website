# Can I search PomBase for protein features?
<!-- pombase_categories: Finding data,Using ontologies -->

A selection of protein sequence motifs and features have been manually
curated using terms from the [Sequence Ontology](http://sequenceontology.org/)
(SO). For example, [Rad54](/gene/SPAC15A10.03c) has a KEN box (a motif
recognized by the anaphase-promoting complex; [SO:0001807](/term/SO:0001807)), and
[Cuf1](/gene/SPAC31A2.11c) and [Trz1](/gene/SPAC1D4.10) have nuclear
localization signals (NLS; [SO:0001528](/term/SO:0001528)). These annotations are included
in the Protein Features section of the gene page.

To search for these features, use the "Protein feature" query in the
[advanced search](/query) (enter a SO ID or description; see the
[documentation](/documentation/advanced-search) for help with
searching).

Also see the FAQs on [transmembrane domains](/faq/how-can-i-find-proteins-have-transmembrane-domains) and
[protein families](/faq/how-can-i-find-all-s.-pombe-proteins-particular-protein-family),
and the section of the search documentation on protein feature and protein domain queries.

Example query:  <app-query-link [goToResults]="true" [linkText]="'nuclear localization signal (SO:0001528)'"
    [predefinedQueryName]="'SO_1528'">
</app-query-link>



