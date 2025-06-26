# Can I get a list of systematic IDs, primary names, synonyms and gene products in *${species_abbrev}*?
<!-- pombase_categories: Genome statistics and lists -->

The list is available from in file:
%%if db=PomBase
[gene_IDs_names_products.tsv](/latest_release/gene_names_and_identifiers)
%%end db=PomBase
%%if db=JaponicusDB
[sysID2product.tsv](${base_url}/data/names_and_identifiers/sysID2product.tsv)
%%end db=JaponicusDB

See [${database_name} name and identifier mappings](/downloads/names-and-identifiers)
for more details and for information about other downloads.

