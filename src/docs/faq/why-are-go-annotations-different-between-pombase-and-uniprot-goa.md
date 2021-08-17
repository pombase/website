# Why are GO annotations different between ${database_name} and UniProt/GOA?
<!-- pombase_categories: Finding data,Using ontologies -->

The GO annotations available from ${database_name} (gene pages, advanced search,
etc.) and the GO Consortium site (AmiGO; GO downloads) differ from those
available from the UniProt GOA site (including QuickGO) for three main
reasons:

1.  RNA - ${database_name} provides GO annotations for functional RNAs (e.g.
    rRNA, tRNA, snRNA), but at present the UniProt GOA dataset only
    includes annotations for protein-coding genes.
2.  Time lag - *${species_abbrev}* GO data are updated at the same time on the
    ${database_name} and GO Consortium sites, but the UniProt GOA site may be up
    to a few weeks behind.
3.  Filtering - ${database_name} does not include automated annotations that are
    redundant with manual annotations (contact the
    [helpdesk](mailto:${helpdesk_address}) for further details). The GO
    Consortium site uses the same filtered annotation dataset as
    ${database_name}, whereas the UniProt GOA site includes the automated
    annotations.
