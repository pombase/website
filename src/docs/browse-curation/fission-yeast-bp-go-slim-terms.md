## Fission yeast GO Biological Process slim

A "GO slim" is a subset of the Gene Ontology terms selected for a
specific purpose in interpreting large-scale data, such as functional
annotation of a genome or high-throughput experimental
results. ${database_name} uses a GO slim to provide a simple summary of
*${species_abbrev}'s* biological capabilities by grouping gene products using
broad classifiers.

The table below shows terms in the current fission yeast biological
process GO slim, and the number of annotations to each term. GO IDs
link to ${database_name} [ontology term pages](/documentation/ontology-term-page).
The annotation totals link
to pages with information about the term and a list of annotated
genes.

Further information is available from the [${database_name} GO slim
documentation](documentation/pombase-go-slim-documentation) and
additional pages linked there. You can also download a list of current
%%if db=PomBase
[GO process slim IDs and term names](/latest_release/gene_ontology/bp_go_slim_terms.tsv).
%%end db=PomBase
%%if db=JaponicusDB
[GO process slim IDs and term names](${base_url}/data/releases/latest/misc/bp_goslim_${species}_ids_and_names.tsv).
%%end db=JaponicusDB

<!--
Note that both proteins and RNAs can be annotated to GO terms, and the
tables on this page include annotated RNAs. For some GO terms, notably
'cytoplasmic translation', RNAs make up a significant proportion of
the total annotated genes.
-->

<app-slim-table [slimName]="'bp_goslim_${species}'"></app-slim-table>


