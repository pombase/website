#!/bin/bash -

date

set -eu
set -o pipefail

release_env=$1
go_xrfs_abbs=$2

if [ x"$release_env" = x ]
then
    echo needs an arg
    exit 1
fi

if [ ! -f angular-cli.json ]
then
    echo "no 'release_config.json' - wrong directory?"
    exit 1
fi

echo Building and releasing using configuration: $release_env

rm -f release_config.json

env_config_file="etc/${release_env}_release_config.json"

if [ -f $env_config_file ]
then
    ln -s $env_config_file release_config.json
else
    echo No such configuration file: $env_config_file - exiting
    exit 1
fi

export base_url=`jq -r .baseUrl release_config.json`
export analytics_id=`jq -r .analyticsId release_config.json`
export rsync_dest=`jq -r .rsyncDest release_config.json`
export release=`jq -r .release release_config.json`

perl -pne 's/<<APP_BASE_URL>>/$ENV{"base_url"}/; s/<<GOOGLE_ANALYTICS_ID>>/$ENV{"analytics_id"}/; ' src/index.html.template > src/index.html

ABBREVS="AGI_LocusCode CDD DDJB EC ECOGENE EMBL ENSEMBL FB GEO GO Gene3D HAMAP InterPro iPTMnet JCVI_TIGRFAMS MGI ModBase PANTHER PDB PIRSF PR PRINTS PRODOM Pfam ProDom Prosite QuickGO RGD SFLD SGD SMART SO SUPERFAMILY UniPathway UniProtKB UniProtKB-KW UniProtKB-SubCell WB dictyBase"

etc/make-link-js.pl $go_xrfs_abbs $ABBREVS > src/app/config/go-xrf-abbr-external-links.json

(cd src/docs; ../../etc/make-docs.pl `find ./ -name '*.md'` > ../app/docs/docs.component.html)

if [ x$release == x'true' ]
then
    ng build --env=prod --target=production || exit 1
else
    exit  # run ng serve instead
fi

if [ $rsync_dest != null ]
then
    echo deploying ...
    rsync --exclude '*~' -cavPHS dist/ $rsync_dest/
fi
