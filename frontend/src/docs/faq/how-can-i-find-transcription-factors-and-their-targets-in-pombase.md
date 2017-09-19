# How can I find transcription factors and their targets in PomBase?
<!-- pombase_categories: Querying/Searching -->

All sequence-specific DNA-binding transcription factors should be
annotated to at least two GO Molecular Function terms, either directly
or by transitivity (i.e. annotated to a more specific "descendant" term
linked to one of these terms):

-   GO:0000976 transcription regulatory region sequence-specific DNA
    binding (view in
    [QuickGO](http://www.ebi.ac.uk/QuickGO/GTerm?id=GO:0000976) or
    [AmiGO](http://amigo.geneontology.org/amigo/term/GO:0000976))
-   GO:0003700 sequence-specific DNA binding transcription factor
    activity (view in
    [QuickGO](http://www.ebi.ac.uk/QuickGO/GTerm?id=GO:0003700) or
    [AmiGO](http://amigo.geneontology.org/amigo/term/GO:0003700))

[Annotation extensions](/faq/what-annotation-extension) are used to
capture two types of "target" data (where available):

-   Annotations to GO:0000976 (or a descendant) may have extensions that
    capture DNA binding specificity using [Sequence     Ontology](http://sequenceontology.org) (SO) terms. A list of DNA
    binding sites identified in S. pombe is available on the [DNA     Binding Sites](/browse-curation/dna-binding-sites) page.
-   Annotations to GO:0003700 (or a descendant) may have extensions
    identifying target genes.

Because it is not yet possible to query annotation extensions in the
PomBase Advanced Search, to identify target genes you must either
inspect transcription factor gene pages manually, or search the GO
annotation dataset. For the latter:

1.  Download the GO annotation file (GAF) from the [GO     Associations](/downloads/go-associations) page. The file is
    tab-delimited text, so it can be opened in a spreadsheet application
    or parsed with a script; the
    [format](http://geneontology.org/page/go-annotation-file-gaf-format-20) is
    described on the GO website.
2.  Look up the GO IDs for the specific terms to which genes are
    directly annotated -- the "Child Terms" feature in QuickGO is good
    for this (for "transcription factor activity", the most commonly
    used term is GO:0000978, RNA polymerase II core promoter proximal
    region sequence-specific DNA binding).
3.  Find annotations to the GO IDs of interest (GO ID is column 5; gene
    ID column 2), and then look at the annotation extensions (column
    16).
4.  Contact the [Helpdesk](mailto:helpdesk@pombase.org)  if you have any
    problems or questions.

Finally, note that not all *S. pombe*transcription factors have been
extensively characterised with respect to target genes, and for those
that have, target curation in PomBase may be incomplete. You may
therefore wish to query for transcription factors that have been have
been experimentally characterised, and therefore might have targets
which are not yet curated. To do so, use the Advanced Search to find
which of the genes annotated to the transcription factor-related GO
terms above have the annotation status "published" (e.g. GO ID
"GO:0000978" AND Annotation Status "published"; see the [Advanced Search documentation](/documentation/advanced-search-documentation) for more
tips on setting up the query).

Query links:

[Genes annotated to 'transcription regulatory region sequence-specific DNA binding' (GO:0000976) or 'sequence-specific DNA binding transcription factor activity' (GO:0003700)](/spombe/query/builder?filter=37&value=%5B%7B%22operator%22:%22OR%22,%22param%22:%7B%22set_1%22:%7B%22param%22:%7B%22filter_1%22:%7B%22filter%22:%221%22,%22query%22:%22GO:0000976%22%7D%7D,%22filter_count%22:%221%22%7D,%22set_2%22:%7B%22param%22:%7B%22filter_1%22:%7B%22filter%22:%221%22,%22query%22:%22GO:0003700%22%7D%7D,%22filter_count%22:%221%22%7D%7D%7D%5D) 

[Genes annotated to 'RNA polymerase II core promoter proximal region sequence-specific DNA binding' (GO:0000978) with annotation status 'published'](/spombe/query/builder?filter=37&value=%5B%7B%22param%22:%7B%22filter_1%22:%7B%22filter%22:%221%22,%22query%22:%22GO:0000978%22%7D,%22filter_2%22:%7B%22operator%22:%22AND%22,%22filter%22:%2211%22,%22query%22:%22PBO:0000001%22%7D%7D,%22filter_count%22:%222%22%7D%5D) \
\


