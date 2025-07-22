## GO Slims - Gene Ontology subsets

"GO slims" are subsets of the Gene Ontology (GO) that provide a broad
overview of annotation distribution. Slims can offer a useful overview
of a genome or the results of a large-scale experiment. For more
information on GO slims, please see ${database_name} [GO Slimming
Tips](/browse-curation/fission-yeast-go-slimming-tips) and the [GO
Subset Guide](http://geneontology.org/docs/go-subset-guide/) at the
Gene Ontology website.

${database_name} provides a GO slim term set for each major branch of GO:

- [GO molecular function slim term set](/browse-curation/fission-yeast-mf-go-slim-terms)
- [GO biological process slim term set](/browse-curation/fission-yeast-bp-go-slim-terms)
- [GO cellular component slim term set](/browse-curation/fission-yeast-cc-go-slim-terms)

Each fission yeast GO slim has been constructed to optimise coverage
of gene products annotated to terms in the branch of GO. For the
biological process and cellular component branches, coverage is almost
complete; the molecular function branch has somewhat lower
coverage. These slims provide good starting points for users who wish
to identify terms of biological interest to create a "custom slim", or
to become familiar with the genome contents.

In the GO slim tables, GO IDs link to the QuickGO browser, where you
can explore the ontology and annotations further. The annotation
totals include annotations to the slim term and to descendants
following the *is\_a*, *part\_of*, *regulates*,
*positively\_regulates,* and *negatively\_regulates* relationships,
and link to gene lists. (Note: the cellular component ontology does
not contain any "regulates" links.) 

The bottom of each GO slim page lists some simple statistics: the
total number of gene products annotated to slim terms, and the number
of protein-coding gene products not covered by the slim, either
because they are not annotated to any term in the GO branch, or
because they have annotations to terms not covered by the slim.

Current GO slim IDs and term names can be downloaded from the ${database_name} ftp site:

 - [GO biological process slim](/latest_release/gene_ontology/bp_go_slim_terms.tsv)
 - [GO molecular function slim](/latest_release/gene_ontology/mf_go_slim_terms.tsv)
 - [GO cellular component slim](/latest_release/gene_ontology/cc_go_slim_terms.tsv)
