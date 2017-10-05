#!/bin/bash -

date

set -eu
set -o pipefail

go_xrfs_abbs=$1

ABBREVS="AGI_LocusCode CDD DDJB EC ECOGENE EMBL ENSEMBL FB GEO GO Gene3D HAMAP InterPro iPTMnet JCVI_TIGRFAMS MGI ModBase PANTHER PDB PIRSF PR PRINTS PRODOM Pfam ProDom Prosite QuickGO RGD SFLD SGD SMART SO SUPERFAMILY UniPathway UniProtKB UniProtKB-KW UniProtKB-SubCell WB dictyBase"

etc/make-link-js.pl $go_xrfs_abbs $ABBREVS > src/app/config/go-xrf-abbr-external-links.json

(cd src/docs; ../../etc/make-docs.pl ../app/recent-news/recent-news.component.html `find ./ -name '*.md'` > ../app/documentation/docs/docs.component.html)
