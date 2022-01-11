#!/bin/bash -

date

set -eu
set -o pipefail

web_config=$1
data_files_dir=$2

database_name=$(jq '."database_name"' $web_config | perl -pne 's/"(.+?)"/$1/g')

echo Generating documentation for: $database_name
echo

ABBREVS="PomBase ENA AGI_LocusCode HGNC CDD DDJB DOI PUBMED PMID ISBN EC EMBL ENSEMBL:gene FB GEO GO:molecular_function HAMAP InterPro iPTMnet TIGRFAMS MGI:gene ModBase PANTHER PDB PIRSF PR PRINTS PRODOM Pfam:polypeptide_region ProDom Prosite QuickGO RGD SFLD SGD SMART SO:sequence_feature SUPERFAMILY UniPathway UniProtKB UniProtKB-KW UniProtKB-SubCell WB:gene dictyBase Cyclebase ZFIN:gene CGD TAIR:gene AlphaFold JaponicusDB RHEA"

DB_XREFS_FILE=/tmp/db-xrefs-$$.yaml

curl http://current.geneontology.org/metadata/db-xrefs.yaml > $DB_XREFS_FILE

# get link configuration from GO
etc/make-link-js.pl $DB_XREFS_FILE $ABBREVS > src/app/config/go-xrf-abbr-external-links.json

echo -n 'Using Pandoc version: '
pandoc --version

./etc/process-markdown.pl --web-config $web_config \
   --data-files-dir $data_files_dir \
   --doc-config src/app/config/doc-config.json \
   --json-docs src/app/config/docs.json \
   --markdown-docs src/docs \
   --recent-news-component src/app/recent-news/recent-news.component.html \
   --docs-component src/app/documentation/docs/docs.component.html \
   --front-panel-content-component src/app/front-panel-content/front-panel-content.component.html
