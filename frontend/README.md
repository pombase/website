## The PomBase frontend code

### Test setup

#### Get the code

`git clone https://github.com/pombase/website.git pombase-website`

`cd pombase-website/frontend`

### Run test server

`ng serve --proxy-config proxy.conf.json`

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

