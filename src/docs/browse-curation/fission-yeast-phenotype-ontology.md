## Fission Yeast Phenotype Ontology

${database_name} curators develop and use the Fission Yeast Phenotype Ontology
(FYPO) to annotate phenotypes of mutant alleles and of over- or
under-expressing wild type genes. 

The contents and structure of FYPO are described on the
[FYPO wiki](https://github.com/pombase/fypo/wiki/Fission-Yeast-Phenotype-Ontology-(FYPO)) at GitHub
and in the publication:

Harris MA, Lock A, Bähler J, Oliver SG, Wood V. FYPO: The Fission
Yeast Phenotype Ontology. Bioinformatics. 2013 July 1;29(13):
1671–1678.
[PubMed abstract (PMID:23658422)](https://www.ncbi.nlm.nih.gov/pubmed/23658422) or
[Full text at Bioinformatics](https://bioinformatics.oxfordjournals.org/content/29/13/1671.long)

### Browsing FYPO terms

At present, FYPO is included collections such as the National Center
for Biomedical Ontology's
[BioPortal](https://bioportal.bioontology.org/) and EBI's
[Ontology Lookup Service (OLS)](https://www.ebi.ac.uk/ontology-lookup/),
both of which allow searching and browsing.

- BioPortal [FYPO summary page](https://bioportal.bioontology.org/ontologies/FYPO)
- BioPortal
  [FYPO terms](https://bioportal.bioontology.org/ontologies/FYPO/?p=classes)
  (the term display supports tree-viewer browsing, text searches, and
  a graphical display)
- [OLS FYPO browser](https://www.ebi.ac.uk/ols/ontologies/fypo)

We hope to deploy a browser at PomBase in the not-too-distant future
that will include annotations as well as terms.

### Finding FYPO terms and annotations in ${database_name}

FYPO terms are displayed on ${database_name} gene pages, along with supporting
evidence and allele and expression details, as described in the
${database_name} gene page documentation.

The ${database_name} [advanced search](/query) can use either term names or IDs to search
FYPO, and returns a list of genes that have alleles annotated to the
specified term or any of its descendants.
%%if db=PomBase
For example, see the
[FAQ on finding essential genes](/faq/can-i-get-list-essential-pombe-genes).
%%end db=PomBase

### Curating phenotypes with FYPO

The ${database_name} online curation tool,
[Canto](https://curation.pombase.org/${species}), uses FYPO terms for
annotation of *${species_abbrev}* phenotypes.
[Phenotype curation documentation](https://curation.pombase.org/${species}/docs/fypo_annotation)
is available via Canto.

### Submitting Bulk Data

If you have a large set of phenotype data to submit, you may want to
do a bulk submission. See the documentation on the
[recommended file format](https://www.pombase.org/submit-data/phenotype-data-bulk-upload-format),
and use the Phenotype Data Submission Form.

