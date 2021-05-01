#!/bin/bash -

analytics_id=$1
app_deploy_config="$2"
input_index_file=$3
output_index_file=$4

perl -pne "s/'<<APP_DEPLOY_CONFIG>>'/$app_deploy_config/; s/<<GOOGLE_ANALYTICS_ID>>/$analytics_id/;" $input_index_file > /tmp/index.tmp &&
  mv /tmp/index.tmp $output_index_file
