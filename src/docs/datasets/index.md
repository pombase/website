## Datasets

Note that some of the links below go to pages listing subdirectories
that are organised slightly differently from the links on this
page. Your browser may prompt you to open or download files.

If you have trouble finding anything, please ask the
[helpdesk](mailto:${helpdesk_address}).

-------

### Data download site ###
[Main directory for *${species_abbrev}* data](https://www.pombase.org/data/)

-------

### [Genome sequence and features](/downloads/genome-datasets) ###

-  Genome sequence (FASTA or enriched EMBL format for Artemis)
-  Feature coordinates (coding regions, introns, exons, UTRs, etc.)
-  Genomic regions (centromeres, telomeres, mating type)

-------

### Annotation datasets ###

Annotation type|Description
---------------|-----------
[Protein datasets](/downloads/protein-datasets)|Protein sequence FASTA database, peptide features, properties, etc.
[GO annotations](downloads/go-annotations)|Gene Ontology annotation files
[Macromolecular complexes](https://www.pombase.org/data/annotations/Gene_ontology/GO_complexes/)|Subunits of protein and ribonucleoprotein complexes (GO cellular component terms and annotated genes)
[Phenotype annotations](downloads/phenotype-annotations)|FYPO phenotype annotation files - complete annotation set (PHAF) or viability summary
%%if db=PomBase
[HCPIN datasets](https://www.pombase.org/data/high_confidence_physical_interactions/)|Physical interaction and GO substrate data that make up the High Confidence Physical Interaction Network datasets; also see [documentation](/documentation/high-confidence-physical-interaction-network)
%%end db=PomBase
[Modifications](https://www.pombase.org/data/annotations/modifications/)|Protein modification data file (RNA modifications to be added in future)
[Orthologs](https://www.pombase.org/data/orthologs/)|Manually curated ortholog sets for [human](/faq/how-can-i-find-s.-pombe-ortholog-s-human-gene) and [*S. cerevisiae*](faq/how-can-i-search-s.-cerevisiae-ortholog-s-homolog-s-s.-pombe-gene); also see [documentation](/documentation/orthologs) 

-------

### [Gene names and IDs](downloads/names-and-identifiers) ###
Mappings between ${database_name} systematic IDs, gene names, product descriptions, and UniProt accession numbers

-------

### GO slim
Current GO slim IDs and term names
 [GO biological process slim](https://www.pombase.org/data/releases/latest/misc/bp_goslim_pombe_ids_and_names.tsv)
 [GO molecular function slim](https://www.pombase.org/data/releases/latest/misc/mf_goslim_pombe_ids_and_names.tsv)
 [GO cellular component slim](https://www.pombase.org/data/releases/latest/misc/cc_goslim_pombe_ids_and_names.tsv)

-------

### Mondo slim
Current [fission yeast Mondo Disease Ontology slim IDs and term names](https://www.pombase.org/releases/latest/misc/pombe_mondo_slim_ids_and_names.tsv)

%%if db=PomBase
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
