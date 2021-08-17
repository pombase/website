# How can I find transcription factors and their targets in ${database_name}?
<!-- pombase_categories: Finding data -->

All sequence-specific DNA-binding transcription factors should be
annotated to at least two GO Molecular Function terms, either directly
or by transitivity (i.e. annotated to a more specific "descendant" term
linked to one of these terms):

-   GO:0000976 transcription regulatory region sequence-specific DNA
    binding (view in [${database_name}](/term/GO:0000976),
    [QuickGO](http://www.ebi.ac.uk/QuickGO/GTerm?id=GO:0000976) or
    [AmiGO](http://amigo.geneontology.org/amigo/term/GO:0000976))
-   GO:0003700 sequence-specific DNA binding transcription factor
    activity (view in [${database_name}](/term/GO:0003700),
    [QuickGO](http://www.ebi.ac.uk/QuickGO/GTerm?id=GO:0003700) or
    [AmiGO](http://amigo.geneontology.org/amigo/term/GO:0003700))

[Annotation extensions](/faq/what-annotation-extension) are used
to capture two types of "target" data (where available):

-   Annotations to GO:0000976 (or a descendant) may have extensions that
    capture DNA binding specificity using [Sequence Ontology](http://sequenceontology.org)
    (SO) terms. A list of DNA binding sites identified in *${species_abbrev}* is
    available on the [DNA Binding Sites](/browse-curation/dna-binding-sites) page.
-   Annotations to GO:0003700 (or a descendant) may have extensions
    identifying target genes.

Because it is not yet possible to query annotation extensions in the
${database_name} advanced search, to identify target genes you must either
inspect transcription factor gene pages manually, or search the GO
annotation dataset. For the latter:

1.  Download the GO annotation file (GAF) from the [GO Annotations](/downloads/go-annotations) page. The file is
    tab-delimited text, so it can be opened in a spreadsheet application
    or parsed with a script; the
    [format](http://geneontology.org/docs/go-annotation-file-gaf-format-2.2/) is
    described on the GO website.
2.  Look up the GO IDs for the specific terms to which genes are
    directly annotated -- the "Child Terms" feature in QuickGO is good
    for this (for "transcription factor activity", the most commonly
    used term is GO:0000978, RNA polymerase II core promoter proximal
    region sequence-specific DNA binding).
3.  Find annotations to the GO IDs of interest (GO ID is column 5; gene
    ID column 2), and then look at the annotation extensions (column
    16).
4.  Contact the [Helpdesk](mailto:${helpdesk_address}) if you have any
    problems or questions.

Finally, note that not all *${species_abbrev}* transcription factors have been
extensively characterised with respect to target genes, and for those
that have, target curation in ${database_name} may be incomplete. You may
therefore wish to query for transcription factors that have been have
been experimentally characterised, and therefore might have targets
which are not yet curated. To do so, use the Advanced Search to find
which of the genes annotated to the transcription factor-related GO
terms above have the annotation status "published" (e.g. GO ID
"GO:0000978" AND Annotation Status "published"; see the 
[advanced search documentation](/documentation/advanced-search) for more
tips on setting up the query).

Query links:

-   <app-query-link [goToResults]="true" [linkText]="'Genes annotated to &quot;transcription regulatory region sequence-specific DNA binding&quot; (GO:0000976) or &quot;sequence-specific DNA binding transcription factor activity&quot; (GO:0003700)'" [predefinedQueryId]="'GO_976_or_GO_3700'"></app-query-link>
-   <app-query-link [goToResults]="true" [linkText]="'Genes annotated to &quot;RNA polymerase II core promoter proximal region sequence-specific DNA binding&quot; (GO:0000978) with characterisation status &quot;published&quot;'" [predefinedQueryId]="'GO_978_and_published'"></app-query-link>


