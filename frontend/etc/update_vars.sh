#!/bin/bash -

analytics_id=$1
app_deploy_config="$2"
index=$3

perl -pne "s/'<<APP_DEPLOY_CONFIG>>'/$app_deploy_config/; s/<<GOOGLE_ANALYTICS_ID>>/$analytics_id/;" $index > /tmp/index.tmp &&
  mv /tmp/index.tmp $index
