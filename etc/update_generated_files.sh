#!/bin/bash -

date

set -eu
set -o pipefail

go_xrfs_abbs=$1
web_config=$2

ABBREVS="AGI_LocusCode CDD DDJB DOI EC ECOGENE EMBL ENSEMBL FB GEO GO Gene3D HAMAP InterPro iPTMnet JCVI_TIGRFAMS MGI ModBase PANTHER PDB PIRSF PR PRINTS PRODOM Pfam ProDom Prosite QuickGO RGD SFLD SGD SMART SO SUPERFAMILY UniPathway UniProtKB UniProtKB-KW UniProtKB-SubCell WB dictyBase Cyclebase"

etc/make-link-js.pl $go_xrfs_abbs $ABBREVS > src/app/config/go-xrf-abbr-external-links.json

echo -n 'Using Pandoc version: '
pandoc --version

./etc/process-markdown.pl --web-config $web_config --doc-config src/app/config/doc-config.json --markdown-docs src/docs --recent-news-component src/app/recent-news/recent-news.component.html --docs-component src/app/documentation/docs/docs.component.html --front-panel-content-component src/app/front-panel-content/front-panel-content.component.html
