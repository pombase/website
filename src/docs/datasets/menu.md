<div class="left-menu-part left-menu-item"><a routerLink="/downloads/genome-datasets">Genome datasets</a></div>
<div class="left-menu-part left-menu-item"><span>Annotation datasets</span></div>
<div class="left-menu-part left-sub-menu-item"><a routerLink="/downloads/go-annotations">GO annotations</a></div>
<div class="left-menu-part left-sub-menu-item"><a routerLink="/downloads/phenotype-annotations">Phenotype annotations</a></div>
%%if db=PomBase
<div class="left-menu-part left-sub-menu-item"><a href="https://www.pombase.org/data/annotations/modifications/">Modifications</a></div>
%%end db=PomBase
<div class="left-menu-part left-sub-menu-item"><a href="${base_url}/data/orthologs/">Orthologs</a></div>
<div class="left-menu-part left-menu-item"><a routerLink="/downloads/protein-datasets">Protein datasets</a></div>
<div class="left-menu-part left-menu-item"><a routerLink="/downloads/names-and-identifiers">Names and IDs</a></div>
<div class="left-menu-part left-menu-item"><span>GO slims</span></div>
<div class="left-menu-part left-sub-menu-item"><a href="${base_url}/data/releases/latest/misc/mf_goslim_${species}_ids_and_names.tsv">GO molecular function slim</a></div>
<div class="left-menu-part left-sub-menu-item"><a href="${base_url}/data/releases/latest/misc/bp_goslim_${species}_ids_and_names.tsv">GO biological process slim</a></div>
<div class="left-menu-part left-sub-menu-item"><a href="${base_url}/data/releases/latest/misc/cc_goslim_${species}_ids_and_names.tsv">GO cellular component slim</a></div>
%%if db=PomBase
<div class="left-menu-part left-menu-item"><a href="https://www.pombase.org/releases/latest/misc/pombe_mondo_slim_ids_and_names.tsv">Mondo Disease Ontology slim</a></div>
%%end db=PomBase
<div class="left-menu-part left-menu-item"><a routerLink="/documents">Documents</a></div>
<div class="left-menu-part left-menu-item"><a routerLink="/downloads/chado-database-dumps">Chado database dumps</a></div>
