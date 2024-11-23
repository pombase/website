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

echo Building and releasing using configuration: $release_env

NG='node node_modules/@angular/cli/bin/ng'

$NG version

if [ x$release_env == x'prod' ]
then
    echo building $release_env for production ...
    $NG build --configuration=production --progress=false || exit 1
else
    echo building $release_env for testing ...
    $NG build --progress=false || exit 1
fi

echo done
