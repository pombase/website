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

<!--
Example query: [phosphorylated residue (MOD:00696)](/spombe/query/builder?filter=37&value=%5B%7B%22param%22:%7B%22filter_1%22:%7B%22filter%22:%2220%22,%22query%22:%22MOD:00696%22%7D%7D,%22filter_count%22:%221%22%7D%5D) 
-->
