#!/bin/bash -

date

set -eu
set -o pipefail

release_env=$1

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

ABBREVS="ENSEMBL EMBL DDJB PANTHER HAMAP Gene3D CDD SO SGD PR RGD MGI EC Pfam PANTHER UniProtKB UniProtKB-SubCell UniPathway FB InterPro ECOGENE UniProtKB-KW PDB WB AGI_LocusCode dictyBase ModBase ProDom PIRSF PRINTS PRODOM Prosite SFLD SMART JCVI_TIGRFAMS SUPERFAMILY GEO"

(cd /var/pomcur/sources/go-svn/; svn update)

etc/make-link-js.pl /var/pomcur/sources/go-svn/doc/GO.xrf_abbs $ABBREVS > src/app/config/go-xrf-abbr-external-links.json

(cd src/docs; ../../etc/make-docs.pl `find ./ -name '*.md'` > ../app/docs/docs.component.html)

if [ x$release == x'true' ]
then
    ng build --env=prod --target=production || exit 1
else
    ng build || exit 1
fi

echo deploying ...

rsync --exclude '*~' -cavPHS dist/ $rsync_dest/
