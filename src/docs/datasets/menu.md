<div class="left-menu-part left-menu-item"><a routerLink="/downloads/genome-datasets">Genome datasets</a></div>
<div class="left-menu-part left-menu-item"><span>Annotation datasets</span></div>
<div class="left-menu-part left-sub-menu-item"><a routerLink="/downloads/go-annotations">GO annotations</a></div>
<div class="left-menu-part left-sub-menu-item"><a routerLink="/downloads/phenotype-annotations">Phenotype annotations</a></div>
%%if db=PomBase
<div class="left-menu-part left-sub-menu-item"><a href="/latest_release/protein_features/protein_modifications.tsv">Modifications</a></div>
<div class="left-menu-part left-sub-menu-item"><a href="/latest_release/curated_orthologs/">Orthologs</a></div>
%%end db=PomBase
%%if db=JaponicusDB
<div class="left-menu-part left-sub-menu-item"><a href="${base_url}/data/orthologs/">Orthologs</a></div>
%%end db=JaponicusDB
<div class="left-menu-part left-menu-item"><a routerLink="/downloads/protein-datasets">Protein datasets</a></div>
<div class="left-menu-part left-menu-item"><a routerLink="/downloads/names-and-identifiers">Names and IDs</a></div>
<div class="left-menu-part left-menu-item"><span>GO slims</span></div>
%%if db=JaponicusDB
<div class="left-menu-part left-sub-menu-item"><a href="${base_url}/data/releases/latest/misc/mf_goslim_${species}_ids_and_names.tsv">GO molecular function slim</a></div>
<div class="left-menu-part left-sub-menu-item"><a href="${base_url}/data/releases/latest/misc/bp_goslim_${species}_ids_and_names.tsv">GO biological process slim</a></div>
<div class="left-menu-part left-sub-menu-item"><a href="${base_url}/data/releases/latest/misc/cc_goslim_${species}_ids_and_names.tsv">GO cellular component slim</a></div>
%%end db=JaponicusDB
%%if db=PomBase
<div class="left-menu-part left-sub-menu-item"><a href="/gene_ontology/bp_go_slim_terms.tsv">GO molecular function slim</a></div>
<div class="left-menu-part left-sub-menu-item"><a href="/gene_ontology/mf_go_slim_terms.tsv">GO biological process slim</a></div>
<div class="left-menu-part left-sub-menu-item"><a href="/gene_ontology/cc_go_slim_terms.tsv">GO cellular component slim</a></div>
<div class="left-menu-part left-menu-item"><a href="/latest_release/human_disease_annotation/pombe_mondo_disease_slim_terms.tsv">Mondo Disease Ontology slim</a></div>
%%end db=PomBase
<div class="left-menu-part left-menu-item"><a routerLink="/documents">Documents</a></div>
<div class="left-menu-part left-menu-item"><a routerLink="/downloads/chado-database-dumps">Chado database dumps</a></div>
