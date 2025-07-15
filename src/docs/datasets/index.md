## Datasets

All of the datasets curated and compiled by PomBase are accessible from this page.
These include genome sequence and features, protein features,
associations to ontology terms, browser data, manually curated
orthologs and gene names and identifiers.

If you cannot locate a dataset of interest please contact the
[helpdesk](mailto:${helpdesk_address}).

-------

%%if db=PomBase
### Latest PomBase data
The most recent release of the PomBase datasets is available from the
[monthly release directory](/latest_release).

We also have an [archive of previous monthly releases](/monthly_releases/).

%%end db=PomBase
%%if db=JaponicusDB
### Data download site
[Main directory for *${species_abbrev}* data](${base_url}/data/)
%%end db=JaponicusDB


-------

### Dataset and ontology versions

The [versions page](/internal-details) is updated each night.

-------

### Genome sequence and features

Visit the [main genome dataset page](/downloads/genome-datasets) for:

-  Genome sequence (FASTA or enriched EMBL format for Artemis)
-  Feature coordinates (coding regions, introns, exons, UTRs, etc.)
-  Genomic regions (centromeres, telomeres, mating type)

-------

### Annotation datasets ###

Annotations are all ontology-based, and extracted from the primary
literature based on experimental data from both hypothesis-driven
low-throughput experiments and large discovery screens (GO
associations are supplemented by non-experimental annotations).  All
annotations are fully provenanced, and supported by appropriate
evidence codes.

Annotation type|Description
---------------|-----------
%%if db=PomBase
[Protein datasets](/downloads/protein-datasets)|Protein sequence in FASTA format, peptide features, properties, etc.
[GO annotations](/downloads/go-annotations/)|Gene Ontology annotation files
[Macromolecular complexes](/latest_release/macromolecular_complexes/)|Subunits of protein and ribonucleoprotein complexes (GO cellular component terms and annotated genes)
[Phenotype annotations](/downloads/phenotype-annotations/)|FYPO phenotype annotation files - complete annotation set (PHAF) or viability summary
[Human disease associations](/latest_release/human_disease_annotation/)|Fission yeast orthologs of human disease associated genes with disease descriptions and [Mondo](https://mondo.monarchinitiative.org/) ontology terms
[Modifications](/downloads/modifications)|Protein modifications
[Orthologs](/latest_release/curated_orthologs/)|Manually curated ortholog sets for [human](/faq/how-can-i-find-s.-pombe-ortholog-s-human-gene) and [*S. cerevisiae*](faq/how-can-i-search-s.-cerevisiae-ortholog-s-homolog-s-s.-pombe-gene); also see [documentation](/documentation/orthologs) 
[Expression](/latest_release/gene_expression/)|Quantitative and qualitative protein and RNA expression data
%%end db=PomBase

%%if db=JaponicusDB
[Protein datasets](/downloads/protein-datasets)|Protein sequence FASTA database, peptide features, properties, etc.
[GO annotations](/downloads/go-annotations)|Gene Ontology annotation files
[Macromolecular complexes](/data/annotations/Gene_ontology/GO_complexes/)|Subunits of protein and ribonucleoprotein complexes (GO cellular component terms and annotated genes)
[Phenotype annotations](/downloads/phenotype-annotations)|FYPO phenotype annotation files - complete annotation set (PHAF) or viability summary
[Modifications](/downloads/modifications)|Protein modifications
[Orthologs](/data/orthologs/)|Ortholog sets for human, cerevisiae and *S. pombe*
%%end db=JaponicusDB

-------

### Gene names and identifiers

Mappings between ${database_name} systematic IDs, gene names, product
descriptions, and UniProt accession numbers:

  - [Names and identifiers](downloads/names-and-identifiers)

### GO slim

Current GO slim IDs and term names:

%%if db=PomBase
 - [GO biological process slim](/latest_release/gene_ontology/bp_go_slim_terms.tsv)
 - [GO molecular function slim](/latest_release/gene_ontology/mf_go_slim_terms.tsv)
 - [GO cellular component slim](/latest_release/gene_ontology/cc_go_slim_terms.tsv)
%%end db=PomBase
%%if db=JaponicusDB
 - [GO biological process slim](${base_url}/data/releases/latest/misc/bp_goslim_${species}_ids_and_names.tsv)
 - [GO molecular function slim](${base_url}/data/releases/latest/misc/mf_goslim_${species}_ids_and_names.tsv)
 - [GO cellular component slim](${base_url}/data/releases/latest/misc/cc_goslim_${species}_ids_and_names.tsv)
%%end db=JaponicusDB

-------

### Datasets displayed in the genome browser

The data files used for the tracks in the [JBrowse genome browser](/documentation/JBrowse_quick_start)
are available from the [`external_datasets` directory](${base_url}/data/external_datasets/).
The directory names are the either the publication details (PubMed ID) or the
GEO/SRA dataset ID.

For detailed information about each genome browser track, please see the
[JBrowse configuration table](https://github.com/pombase/pombase-config/raw/master/website/jbrowse_track_metadata.csv).
This file is a spreadsheet in comma separated value format.  The
columns are described on [the dataset submission page](/documentation/data-submission-form-for-HTP-sequence-linked-data).


%%if db=PomBase
-------

### Mondo slim
[Current fission yeast Mondo Disease Ontology slim IDs and term names](/latest_release/human_disease_annotation/pombe_mondo_disease_slim_terms.tsv)

-------

### Curated inventories

-   [DNA binding sites](/browse-curation/dna-binding-sites.md)
-   [Drug targets](/browse-curation/drugs-known-pombe-targets.md)

-------
  **Note:** *S. pombe* files are no longer available from the old
  "pombase" FTP site within the EBI domain. If you have a link that
  contains **ftp.ebi.ac.uk**, please check these pages for a link
  using **https://www.pombase.org/**. Please [contact the ${database_name}
  curators](mailto:${helpdesk_address}) if you need help finding a
  file or directory.
%%end db=PomBase
