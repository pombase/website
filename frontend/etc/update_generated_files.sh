#!/bin/bash -

date

set -eu
set -o pipefail

go_xrfs_abbs=$1

ABBREVS="AGI_LocusCode CDD DDJB EC ECOGENE EMBL ENSEMBL FB GEO GO Gene3D HAMAP InterPro iPTMnet JCVI_TIGRFAMS MGI ModBase PANTHER PDB PIRSF PR PRINTS PRODOM Pfam ProDom Prosite QuickGO RGD SFLD SGD SMART SO SUPERFAMILY UniPathway UniProtKB UniProtKB-KW UniProtKB-SubCell WB dictyBase"

etc/make-link-js.pl $go_xrfs_abbs $ABBREVS > src/app/config/go-xrf-abbr-external-links.json

./etc/process-markdown.pl --web-config pombase_v2_config.json --doc-config src/app/config/doc-config.json --markdown-docs src/docs --recent-news-component src/app/recent-news/recent-news.component.html --docs-component src/app/documentation/docs/docs.component.html --front-panel-content-component src/app/front-panel-content/front-panel-content.component.html
