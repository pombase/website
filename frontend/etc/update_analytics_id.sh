#!/bin/bash -

analytics_id=$1
index=$2

perl -pne "s/<<GOOGLE_ANALYTICS_ID>>/$analytics_id/;" $index > /tmp/index.tmp &&
  mv /tmp/index.tmp $index
