# How can I find modifications for my protein of interest?
<!-- pombase_categories: Querying/Searching,Using Ontologies -->

Protein modifications (where curated) are included in the Modifications
section on gene pages. (We plan to include RNA modifications later.) The
[Gene Page modifications documentation](/documentation/gene-page-modifications)describes the
display.

To retrieve all genes whose products have a given modification, use the
PSI-MOD filter in the Advanced Search. In the "Select Filter" pulldown,
if you know the ID (for example, "phosphorylated residue" is MOD:00696)
choose "PSI-MOD ID", and then type or paste the ID into the box.
Otherwise, choose "PSI-MOD Term Name" and start typing; the autocomplete
feature will suggest terms. Choose one, and click the Submit button to
run the search. See the [Advanced Search documentation](/documentation/advanced-search-documentation)for more
information, including how [ontology searches retrieve annotations](/documentation/advanced-search-documentation#filt)to
general terms.

We are aware that protein modification curation is relatively
incomplete. If you know of any protein modifications that are missing
from the gene pages or the search results, please [notify the PomBase curators](mailto:helpdesk@pombase.org).

Example query: [phosphorylated residue (MOD:00696)](/spombe/query/builder?filter=37&value=%5B%7B%22param%22:%7B%22filter_1%22:%7B%22filter%22:%2220%22,%22query%22:%22MOD:00696%22%7D%7D,%22filter_count%22:%221%22%7D%5D)

