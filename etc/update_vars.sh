#!/bin/bash -

analytics_id="$1"
google_tag_manager_id="$2"
app_deploy_config="$3"
index=$3

perl -pne "s/'<<APP_DEPLOY_CONFIG>>'/$app_deploy_config/; s/<<GOOGLE_ANALYTICS_ID>>/$analytics_id/; s/<<GOOGLE_TAG_MANAGER_ID>>/$google_tag_manager_id/;" $index > /tmp/index.tmp &&
  mv /tmp/index.tmp $index
