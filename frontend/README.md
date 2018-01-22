Update generated docs with:

    ./etc/update_generated_files.sh /var/pomcur/sources/go-svn/doc/GO.xrf_abbs ~/pombe/pombe-embl/website/pombase_v2_config.json

Run test server:

    ng serve --proxy-config proxy.conf.json

Run JSON and query server:

    CARGO_INCREMENTAL=1 RUST_BACKTRACE=1 cargo run --release --bin pombase-server -- -c pombase_v2_config.json -m web-json/api_maps.json.gz -s web-json/gene_subsets.json -w /var/www/html/
