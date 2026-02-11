## Phenotype annotations

%%if db=PomBase
Phenotype annotations
%%end db=PomBase
%%if db=JaponicusDB
[Phenotype annotations](/data/annotations/Phenotype_annotations/phenotype_annotations.japonicusdb.phaf.gz)
%%end db=JaponicusDB
for alleles of
*${species_abbrev}* genes are manually curated from the literature using
Fission Yeast Phenotype Ontology (FYPO) terms.

%%if db=PomBase
PHAF format phenotype data file from the latest monthly release:

  - [pombase_single_locus_haploid_phenotype_annotation.phaf.tsv](${base_url}/latest_release/phenotypes_and_genotypes/pombase_single_locus_haploid_phenotype_annotation.phaf.tsv)

See below for details of the PHAF format.

This file contains phenotypes and genotype details for single locus
haploid genotypes.

We also provide file of single locus diploid genotypes and phenotypes:

  - [pombase_single_locus_diploid_phenotype_annotation.tsv](${base_url}/latest_release/phenotypes_and_genotypes/pombase_single_locus_diploid_phenotype_annotation.tsv)

See below for details of the diploid PHAF format.

The genotypes and phenotypes directory from the latest release
contains other related files:

  - [phenotypes_and_genotypes directory](${base_url}/latest_release/phenotypes_and_genotypes/)


%%end db=PomBase

Note that PHAF format contains annotations for single locus, single allele
phenotypes (single mutants) and homozygous diploids phenotypes only.

This file uses the the ${database_name} phenotype data bulk annotation
format (PHAF), detailed below. This format is similar to the
one that can be used to submit phenotype annotations to ${database_name} in bulk,
as described on the [Phenotype data bulk upload format](/documentation/phenotype-data-bulk-upload-format) 
page, with the addition of the `Database` column. Note that, because
Database is column 1 in the downloadable file, column numbers differ
by 1 between the download and upload formats.

Propagating phenotype annotations: Note that the file contains only
direct annotations to FYPO terms. It does not include annotations that
can be inferred by propagating between terms within the ontology. To
make full use of the FYPO annotation data, we strongly recommend also
using the ontology structure and inferred annotations. Please contact
the [${database_name} helpdesk](mailto:${helpdesk_address}) if you need
assistance.

### The Fission Yeast Phenotype Ontology (FYPO)

FYPO is the formal ontology used to annotate phenotypes
observed in fission yeast.  The ontology is maintained by PomBase
[on GitHub](https://github.com/pombase/fypo).

The latest version of the ontology is available in OBO And OWL format
files from the
[FYPO OBO Foundry page](https://obofoundry.org/ontology/fypo.html).

Please cite this publication if you make direct use of FYPO:\
*FYPO: The Fission Yeast Phenotype Ontology*\
Harris MA, Lock A, Bähler J, Oliver SG, Wood V.\
Bioinformatics. 2013 Jul 1;29(13):1671-8. doi:
[10.1093/bioinformatics/btt266](https://doi.org/10.1093/bioinformatics/btt266). Epub
2013 May 8. [PMID:23658422](http://www.ncbi.nlm.nih.gov/pubmed/23658422)

## Viability summary

%%if db=PomBase
A [set of "viability summary" data](${base_url}/latest_release/phenotypes_and_genotypes/gene_viability.tsv)
%%end db=PomBase
%%if db=JaponicusDB
A [set of "viability summary" data](https://www.pombase.org/data/annotations/Phenotype_annotations/FYPOviability.tsv)
%%end db=JaponicusDB
as shown at the top of the FYPO table on each gene page, is available as
a downloadable file. The file has two columns: the gene systematic ID
and one of three values: "viable", "inviable" or "condition-dependent".

To cite the fission yeast phenotype data (complete or viability
summary), please see [Citing ${database_name}](/about/citing-${lc_database_name}).

## PHAF download format

| Column | Contents | Description/Notes | Example | Cardinality |
|--------|---------|------------|--------|------------|
| 1 | Database |   | PomBase | 1 |
| 2 | Gene systematic ID | See the [names and identifiers file](https://www.pombase.org/downloads/names-and-identifiers) for all | SPBC11B10.09 | 1 |
| 3 | FYPO ID | From the [FYPO ontology](https://obofoundry.org/ontology/fypo.html) | FYPO:0000001 | 1 |
| 4 | Allele description | Standardized description of the change <p> See [*Genetics* 10.1093/genetics/iyad143](https://doi.org/10.1093/genetics/iyad143) for syntax | G146D | mandatory/single |
| 5 | Expression |  One of these values: ‘overexpression’, ‘knockdown’, ‘endogenous’, ‘null’, ‘not specified’. Deletions always have ‘null’ expression. | overexpression | 1 |
| 6 | Parental strain | "unknown" is allowed | 975 h+ | 1 |
| 7 | Background strain name | Deprecated | |  |
| 8 | Background genotype description | Alleles that are present but considered unlikely to affect the phenotype of interest (i.e. selectable markers) | ura4-D18 leu1-32 ade6-M210 | |
| 9 | Gene name (symbol) | The fission yeast Gene Naming Committee approved unique name | cdc2 | 0,1 |
| 10 | Allele name | Preferred allele name, and any alternative names are in column 11. | cdc2-1w | optional/single |
| 11 | Allele synonym | Alternative allele names (>1 pipe separated) | wee2-1 | 0 or more |
| 12 | Allele type | Allowed: deletion, amino acid mutation, partial amino acid deletion, nucleotide mutation, partial nucleotide deletion, disruption, other, unknown, wild type  | amino acid mutation | 1 |
| 13 | Evidence | We use a small selection from the [Evidence Ontology](http://www.evidenceontology.org/) (ECO) | ECO:0000336 | 1 |
| 14 | Condition | A term ID or name from the [FYECO ontology](https://github.com/pombase/fypo/blob/master/fyeco.obo) | high temperature, low glucose MM | mandatory/multiple |
| 15 | Penetrance | A percentage, which can be prefixes with "<", ">" or "~" (approximately).  Alternatively entry from FYPO_EXT ontology: "high" (FYPO_EXT:0000001), "medium" (FYPO_EXT:0000002), "low" (FYPO_EXT:0000003) or "full" (FYPO_EXT:0000004) | 85, <20, ~30.4 or "high", etc. | 1 |
| 16 | Severity | Uses the FYPO_EXT ontology described in the column 15 description | "medium"  | 1 |
| 17 | Extension | Used when a mutation in one gene affects another gene/protein. e.g, if a mutation in gene A decreased phosphorylation of protein B, gene B’s ID is listed as an extension.  Allowed extension relations: assayed_using, assayed_enzyme, assayed_substrate, assayed_transcript, or is_bearer_of | assayed_using(PomBase:SPBC582.03) | 0,1 |
| 18 | Reference | PubMed IDs only at present | PMID:23697806 | mandatory/single |
| 19 | Taxon |   | taxon:4896 | mandatory/single |
| 20 | Date |   | 2012-01-01 | mandatory/single |

### Diploid PHAF file download format

We also provide file of single locus diploid genotypes and phenotypes:

  - [pombase_single_locus_diploid_phenotype_annotation.tsv](${base_url}/latest_release/phenotypes_and_genotypes/pombase_single_locus_diploid_phenotype_annotation.tsv)

#### Diploid PHAF file format

| Column | Contents | Description/Notes | Example | Cardinality |
|--------|---------|------------|--------|------------|
| 1 | Database |   | PomBase | 1 |
| 2 | Gene systematic ID | See the [names and identifiers file](https://www.pombase.org/downloads/names-and-identifiers) for all | SPBC11B10.09 | 1 |
| 3 | Gene name (symbol) |   | cdc2 | 0,1 |
| 4 | FYPO ID | From the [FYPO ontology](https://obofoundry.org/ontology/fypo.html) | FYPO:0000001 | 1 |
| 5 | FYPO term name | name of the term in colun 3 | normal meiosis | 1 |
| 6 | Allele 1 name |  | cdc2-1w |  |
| 7 | Allele 1 description | Standardized description of the change <p> See [*Genetics* 10.1093/genetics/iyad143](https://doi.org/10.1093/genetics/iyad143) for syntax | G146D | mandatory/single |
| 8 | Allele 1 type | Allowed: deletion, amino acid mutation, partial amino acid deletion, nucleotide mutation, partial nucleotide deletion, disruption, other, unknown, wild type  | amino acid mutation | 1 |
| 9 | Allele 1 expression |  One of these values: ‘overexpression’, ‘knockdown’, ‘endogenous’, ‘null’, ‘not specified’. Deletions always have ‘null’ expression. | overexpression | 1 |
| 10 | Allele 2 name |  |  |  |
| 11 | Allele 2 description |  | | mandatory/single |
| 12 | Allele 2 type |   | | 1 |
| 13 | Allele 2 expression |    |  | 1 |
| 14 | Evidence | We use a small selection from the [Evidence Ontology](http://www.evidenceontology.org/) (ECO) | ECO:0000336 | 1 |
| 15 | Condition | A term ID or name from the [FYECO ontology](https://github.com/pombase/fypo/blob/master/fyeco.obo)  | high temperature, low glucose MM | mandatory/multiple |
| 16 | Penetrance | A percentage, which can be prefixes with "<", ">" or "~" (approximately).  Alternatively entry from FYPO_EXT ontology: "high" (FYPO_EXT:0000001), "medium" (FYPO_EXT:0000002), "low" (FYPO_EXT:0000003) or "full" (FYPO_EXT:0000004) | 85, <20, ~30.4 or "high", etc. | 1 |
| 17 | Severity | Uses the FYPO_EXT ontology described in note 15  | "medium"  | 1 |
| 18 | Extension | Used when a mutation in one gene affects another gene/protein. e.g, if a mutation in gene A decreased phosphorylation of protein B, gene B’s ID is listed as an extension.  Allowed extension relations: assayed_using, assayed_enzyme, assayed_substrate, assayed_transcript, or is_bearer_of | assayed_using(PomBase:SPBC582.03) | 0,1 |
| 19 | Reference | PubMed IDs only at present | PMID:23697806 | mandatory/single |
| 20 | Taxon |   | taxon:4896 | mandatory/single |
| 21 | Date |   | 2012-01-01 | mandatory/single |
