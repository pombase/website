# Can I retrieve a list of the ${species_abbrev} GO slim terms?
<!-- pombase_categories: Genome statistics and lists,Using ontologies -->

Yes, you can download the term names and IDs for the each of the
fission yeast GO slims, and the Mondo Disease Ontology slim:

Current GO slim IDs and term names:

%%if db=PomBase
 - [GO biological process slim](/latest_release/gene_ontology/bp_go_slim_terms.tsv)
 - [GO molecular function slim](/latest_release/gene_ontology/mf_go_slim_terms.tsv)
 - [GO cellular component slim](/latest_release/gene_ontology/cc_go_slim_terms.tsv)
%%end db=PomBase
%%if db=JaponicusDB
 - [GO biological process slim](${base_url}/data/releases/latest/misc/bp_goslim_${species}_ids_and_names.tsv)
 - [GO molecular function slim](${base_url}/data/releases/latest/misc/mf_goslim_${species}_ids_and_names.tsv)
 - [GO cellular component slim](${base_url}/data/releases/latest/misc/cc_goslim_${species}_ids_and_names.tsv)
%%end db=JaponicusDB


Current [fission yeast Mondo Disease Ontology slim IDs and term names](/latest_release/human_disease_annotation/pombe_mondo_disease_slim_terms.tsv)

For further information on using the *${species_abbrev}* slims, please see the
${database_name} GO slim pages
([biological process](/browse-curation/fission-yeast-bp-go-slim-terms),
[molecular function](/browse-curation/fission-yeast-mf-go-slim-terms),
[cellular component](/browse-curation/fission-yeast-cc-go-slim-terms)),
[GO slimming tips](/browse-curation/fission-yeast-go-slimming-tips), and
[GO slim documentation](documentation/pombase-go-slim-documentation).


