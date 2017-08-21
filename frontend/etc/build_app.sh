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



if [ x$release == x'true' ]
then
    echo building ...
    ng build --env=prod --target=production --progress=false || exit 1
    echo done
else
    exit  # run ng serve instead
fi

if [ $rsync_dest != null ]
then
    echo deploying ...
    rsync --exclude '*~' -cavPHS dist/ $rsync_dest/
fi
