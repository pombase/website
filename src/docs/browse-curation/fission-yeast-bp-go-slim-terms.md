## Fission yeast GO Biological Process slim

A "GO slim" is a subset of the Gene Ontology terms selected for a
specific purpose in interpreting large-scale data, such as functional
annotation of a genome or high-throughput experimental
results. PomBase uses a GO slim to provide a simple summary of
*S. pombe's* biological capabilities by grouping gene products using
broad classifiers.

The table below shows terms in the current fission yeast biological
process GO slim, and the number of annotations to each term. GO IDs
link to PomBase [ontology term pages](/documentation/ontology-term-page).
Icons beside each GO term link to [esyN](http://www.esyn.org/), which
provides a graphical view of interactions for the genes from the
PomBase [High Confidence Physical Interaction Network (HCPIN)](documentation/high-confidence-physical-interaction-network)
dataset. Only the subset of genes linked into the interaction network
will be displayed in the esyN network view. The annotation totals link
to pages with information about the term and a list of annotated
genes.

Further information is available from the [PomBase GO slim
documentation](documentation/pombase-go-slim-documentation) and
additional pages linked there. You can also download a list of current
[GO process slim IDs and term
names](ftp://ftp.pombase.org/nightly_update/misc/bp_goslim_pombe_ids_and_names.tsv)
from the PomBase FTP site.

<!-- [esyN documentation](http://www.esyn.org/tutorial.html) -->

<!--
Note that both proteins and RNAs can be annotated to GO terms, and the
tables on this page include annotated RNAs. For some GO terms, notably
'cytoplasmic translation', RNAs make up a significant proportion of
the total annotated genes.
-->

<app-slim-table [slimName]="'bp_goslim_pombe'"></app-slim-table>

