# Can I retrieve functional annotations for genes in a list?
<!-- pombase_categories: Finding data,Tools and resources,Using ontologies -->

You can find the GO annotations for your genes corresponding to
functional roles and localizations. Our recommended approach depends on
how many specific topics you are interested in:

-   For a small number of specific GO terms (e.g. localization to the
    nucleus or cytoplasm, or a role in signaling or DNA metabolism),
    you can use the [advanced search](/query). Paste your gene list
    into the "Gene symbols and IDs" query, and then combine it with a GO query for
    each term of interest (see the [search documentation](/documentation/advanced-search)
    for more information).

-   If you are interested in many GO terms, or if you do not know in
    advance which terms may be relevant, we recommend that you use a "GO
    term enrichment" tool. Such tools are typically used to find terms
    overrepresented for a gene list, but can be used to retrieve all GO
    annotations if the p-value threshold is set artificially high.

Both the Advanced Search and term enrichment tools take advantage of the
hierarchical structure of GO, such that annotations to specific terms
are propagated to "ancestor" terms via *is\_a* and *part\_of* relations.
See the [${database_name} GO documentation](/documentation/gene-page-gene-ontology), and the GO
Consortium documentation linked there, for more information. (These
approaches also make it easier to maintain and update your data than
storing individual GO annotations locally.)

Also see the [FAQ on GO term enrichment](/faq/how-can-i-find-significant-shared-go-annotations-genes-list)
and the [${database_name} GO Slim documentation](/documentation/pombase-go-slim-documentation) page.

