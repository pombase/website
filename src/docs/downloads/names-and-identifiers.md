### ${database_name} name and identifier mappings

%%if db=PomBase
#### Identifier mapping file
 - [gene_IDs_names_products.tsv](/latest_release/gene_names_and_identifiers/) - 
   tab-delimited file of systematic ID, primary gene name (where
   assigned), chromosome, product description, UniProtKB accession,
   all synonyms, and product type (protein coding, ncRNA, etc.) for
   each gene

Note: A tab-delimited file of systematic identifiers mapped to EC
numbers was previously maintained, but has not been updated since March
2012. The most recent version of the
[gp2EC.txt](https://www.pombase.org/data/names_and_identifiers/OLD/gp2EC.txt)
file is available in the archive, but because it is out of date it
may contain errors or omissions.
%%end db=PomBase

%%if db=JaponicusDB
These files are available in the [names and IDs directory](${base_url}/data/names_and_identifiers/)

#### Gene names

-   [gene_IDs_names.tsv](${base_url}/data/names_and_identifiers/gene_IDs_names.tsv)
    tab-delimited file of systematic ID, primary gene name (where
    assigned), and all synonyms for each gene

-   [gene_IDs_names_products.tsv](${base_url}/data/names_and_identifiers/gene_IDs_names_products.tsv)
    tab-delimited file of systematic ID, primary gene name (where
    assigned), chromosome, product description, UniProtKB accession,
    all synonyms, and product type (protein coding, ncRNA, etc.) for
    each gene

#### Systematic ID to gene product

Files include systematic name, primary name (where assigned),
synonyms (where assigned), and gene product description

-   [sysID2product.tsv](${base_url}/data/names_and_identifiers/sysID2product.tsv)
    protein-coding genes
-   [sysID2product.rna.tsv](${base_url}/data/names_and_identifiers/sysID2product.rna.tsv)
    non-coding RNA genes
-   [pseudogeneIDs.tsv](https://www.pombase.org/data/names_and_identifiers/pseudogeneIDs.tsv)
    pseudogenes
%%end db=JaponicusDB
