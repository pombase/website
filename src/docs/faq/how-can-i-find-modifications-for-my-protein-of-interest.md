# How can I find modifications for my protein of interest?
<!-- pombase_categories: Finding data,Using ontologies -->

Protein modifications (where curated) are included in the
Modifications section on gene pages. (We plan to include RNA
modifications later.) The [gene page modifications documentation](/documentation/gene-page-modifications) 
describes the display.

To retrieve all genes whose products have a given modification, use
the "Protein modifications" query in the [Advanced Search]. If you
know the ID (for example, "phosphorylated residue" is MOD:00696), type
or paste it into the box. Otherwise, start typing a name or
description; the autocomplete feature will suggest terms. Choose one
to retrieve annotated genes. See the [advanced search documentation](/documentation/advanced-search) 
for more information, including how ontology searches retrieve
annotations to general terms.

Example query: 
<app-query-link [goToResults]="true" [linkText]="'phosphorylated residue (MOD:00696)'" [predefinedQueryId]="'MOD_696'">
</app-query-link>

There is also an ontology term page for each modification term used to
annotate *S. pombe* proteins, e.g. [MOD:00696](/term/MOD:00696).
