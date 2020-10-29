## PomBase frontend code

See https://github.com/pombase/website/tree/master/

### Build and test status

![Tests](https://github.com/pombase/website/workflows/Tests/badge.svg)

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

`./etc/update_generated_files.sh GO.xrf_abbs pombase_v2_config.json`

where:

 - `GO.xrf_abbs` is http://www.geneontology.org/doc/GO.xrf_abbs
 - `pombase_v2_config.json` is https://curation.pombase.org/dumps/latest_build/pombe-embl/website/pombase_v2_config.json

