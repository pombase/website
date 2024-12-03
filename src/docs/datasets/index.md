## Datasets

Note that some of the links below go to pages listing subdirectories
that are organised slightly differently from the links on this
page. Your browser may prompt you to open or download files.

If you have trouble finding anything, please ask the
[helpdesk](mailto:${helpdesk_address}).

-------

### Data download site ###
[Main directory for *${species_abbrev}* data](${base_url}/data/)

-------

### Dataset and ontology versions

The [versions page](/internal-details) is updated each night.

-------

### [Genome sequence and features](/downloads/genome-datasets) ###

-  Genome sequence (FASTA or enriched EMBL format for Artemis)
-  Feature coordinates (coding regions, introns, exons, UTRs, etc.)
-  Genomic regions (centromeres, telomeres, mating type)

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

-------

### Annotation datasets ###

Annotation type|Description
---------------|-----------
[Protein datasets](/downloads/protein-datasets)|Protein sequence FASTA database, peptide features, properties, etc.
[GO annotations](downloads/go-annotations)|Gene Ontology annotation files
[Macromolecular complexes](${base_url}/data/annotations/Gene_ontology/GO_complexes/)|Subunits of protein and ribonucleoprotein complexes (GO cellular component terms and annotated genes)
[Phenotype annotations](downloads/phenotype-annotations)|FYPO phenotype annotation files - complete annotation set (PHAF) or viability summary
%%if db=PomBase
[Human disease associations](${base_url}/data/annotations/human_disease_annotation/)|Fission yeast orthologs of human disease associated genes with disease descriptions and [Mondo](https://mondo.monarchinitiative.org/) ontology terms
%%end db=PomBase
[Modifications](downloads/modifications/)|Protein modifications
%%if db=PomBase
[Orthologs](${base_url}/data/orthologs/)|Manually curated ortholog sets for [human](/faq/how-can-i-find-s.-pombe-ortholog-s-human-gene) and [*S. cerevisiae*](faq/how-can-i-search-s.-cerevisiae-ortholog-s-homolog-s-s.-pombe-gene); also see [documentation](/documentation/orthologs) 
%%end db=PomBase
%%if db=JaponicusDB
[Orthologs](${base_url}/data/orthologs/)|Ortholog sets for human, cerevisiae and *S. pombe*
%%end db=JaponicusDB
-------

### [Gene names and IDs](downloads/names-and-identifiers) ###
Mappings between ${database_name} systematic IDs, gene names, product descriptions, and UniProt accession numbers

-------

### GO slim

Current GO slim IDs and term names:

 - [GO biological process slim](${base_url}/data/releases/latest/misc/bp_goslim_${species}_ids_and_names.tsv)
 - [GO molecular function slim](${base_url}/data/releases/latest/misc/mf_goslim_${species}_ids_and_names.tsv)
 - [GO cellular component slim](${base_url}/data/releases/latest/misc/cc_goslim_${species}_ids_and_names.tsv)


%%if db=PomBase
-------

### Mondo slim
[Current fission yeast Mondo Disease Ontology slim IDs and term names](${base_url}/data/annotations/human_disease_annotation/pombe_mondo_disease_slim_terms.tsv.gz)

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
