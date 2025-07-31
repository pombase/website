## Fission yeast GO Cellular Component slim

A "GO slim" is a subset of the Gene Ontology terms selected for a
specific purpose in interpreting large-scale data, such as functional
annotation of a genome or high-throughput experimental
results. ${database_name} uses GO slims to provide a simple summary of
*${species_abbrev}'s* biological capabilities by grouping gene products using
broad classifiers.

The table below shows terms in the current fission yeast cellular
component GO slim, and the number of annotations to each term. GO IDs
link to ${database_name} [ontology term
pages](/documentation/ontology-term-page). The annotation totals link
to pages with information about the term and a list of annotated
genes.

Further information is available from the [${database_name} GO slim
documentation](documentation/pombase-go-slim-documentation) and
additional pages linked there. You can also download a list of current
%%if db=PomBase
[GO component slim IDs and term names](${base_url}/latest_release/gene_ontology/cc_go_slim_terms.tsv).
%%end db=PomBase
%%if db=JaponicusDB
[GO component slim IDs and term names](${base_url}/data/releases/latest/misc/cc_goslim_${species}_ids_and_names.tsv).
%%end db=JaponicusDB


<app-slim-table [slimName]="'cc_goslim_${species}'"></app-slim-table>

