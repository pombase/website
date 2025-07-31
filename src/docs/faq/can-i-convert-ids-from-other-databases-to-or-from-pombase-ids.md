# Can I convert IDs from other databases to or from ${database_name} IDs?
<!-- pombase_categories: Tools and resources -->

${database_name} has an identifier mapper that retrieves *${species_abbrev}* gene
systematic IDs and standard names for a selection of different input
ID types:

-   Find *${species_abbrev}* genes using UniProt accessions
-   Retrieve manually curated orthologs for
    -    *S. cerevisiae*: Use standard gene names (CDC28, ACT1, etc.), ORF names (YPR121W, YPL258C, etc.), or SGD IDs (SGD:S000004494, SGD:S000004635, etc.)
    -    Human: use standard gene names (CDK1, BRCA2, etc.) or HGNC identifiers (e.g. HGNC:1722)
%%if db=PomBase
    - *S. japonicus*: use standard gene names (*cdc11*, *pka1*, etc.) or systematic IDs (e.g. SJAG_01188)
%%end db=PomBase
%%if db=JaponicusDB
    - *S. pombe*: use standard gene names (*cdc11*, *pka1*, etc.) or systematic IDs (e.g. SPCC1739.11c)
%%end db=JaponicusDB

For UniProt IDs, we also provide a static mapping file of ${database_name}
systematic IDs and UniProtKB accessions, available on the [Data
Mapping](/downloads/names-and-identifiers) page and by FTP from the file
[gene_IDs_names_products.tsv](${base_url}/latest_release/gene_names_and_identifiers).

For IDs not included in the ${database_name} mapper, we suggest you try the
EBI's PICR web service (<http://www.ebi.ac.uk/Tools/picr/>), which can
convert between UniProtKB, RefSeq, Ensembl Genomes (including *S.
pombe* systematic IDs), and many other common database IDs.

For other *Schizosaccharomyces* species (*S. japonicus*, *S. octosporus*,
*S. cryophilus*), the PICR service converts between UniProtKB accessions
and the identifiers used in Rhind *et al.* Comparative functional
genomics of the fission yeasts ([PMID:21511999](http://www.ncbi.nlm.nih.gov/pubmed?term=21511999)),
but with one caveat: the IDs used by PICR, UniProtKB, and QuickGO
contain underscores, whereas those in Rhind *et al.* do not
(e.g. SJAG\_00455 versus SJAG00455). The IDs with underscores are
correct.

