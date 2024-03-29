## PomBase frontend code

See https://github.com/pombase/website/tree/master/

### Build and test status

[![Test status](https://github.com/pombase/website/actions/workflows/test-website.yml/badge.svg)](https://github.com/pombase/website/actions/workflows/test-website.yml)

### Deploying

The site is deployed by building a container from the JSON output of `pombase-chado-json`,
which is run nightly by this script:

https://github.com/pombase/pombase-legacy/blob/master/etc/load-all.sh

The container is build with:

https://github.com/pombase/pombase-chado/blob/master/etc/build_container.sh

### Test setup

#### Get the code

`git clone https://github.com/pombase/website.git pombase-website`

`cd pombase-website/`

### Run test server

`ng serve --port 4242 --disable-host-check --host 0.0.0.0 --proxy-config proxy.conf.json`

### Run JSON/query server

https://github.com/pombase/pombase-chado-json

`cargo run --release --bin pombase-server -- -c pombase_v2_config.json -m web-json/api_maps.json.gz -s web-json/gene_subsets.json -w /var/www/html/`


#### Update generated docs

This is needed when the Markdown documentation changes or if the front
page panel config changes.

`./etc/update_generated_files.sh pombase-config/website/pombase_v2_config.json curation/data_files/`

where:

 - `pombase-config` is a checkout of https://github.com/pombase/pombase-config
 - `curation` is a checkout of https://github.com/pombase/curation
