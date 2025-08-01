## GO annotations

*${species_abbrev}* GO annotations are available as tab-delimited files
in [GAF 2.2 format](http://geneontology.org/docs/go-annotation-file-gaf-format-2.2/).
The files include annotations made by manual literature
curation, annotations inferred from keyword mappings based on curated
descriptions, and annotations shared by the UniProt
[GOA](http://www.ebi.ac.uk/GOA) team.

%%if db=PomBase
To cite the fission yeast GO data, please see [Citing PomBase](/about/citing-pombase).
%%end db=PomBase

### Annotation files

%%if db=PomBase
Files from the [latest monthly release](${base_url}/latest_release/gene_ontology/):

#### GO Association File (GAF)

All current *S. pombe* GO annotations in tab-delimted
[GAF 2.2 format](http://geneontology.org/docs/go-annotation-file-gaf-format-2.2/):

  - [gene_ontology_annotation.gaf.tsv](${base_url}/latest_release/gene_ontology/gene_ontology_annotation.gaf.tsv)

#### GPAD/GPI

*S. pombe* GO annotation in <a href="https://github.com/geneontology/go-annotation/blob/master/specs/gpad-gpi-2-0.md">GPAD/GPI v2.0 format</a>:

  - [Gene Product Information (GPI)](${base_url}/latest_release/gene_ontology/gene_product_information_taxonid_4896.tsv) -
    details of *S. pombe* gene products
  - [Gene Product Annotation Data (GPAD)](${base_url}/latest_release/gene_ontology/gene_product_annotation_data_taxonid_4896.tsv) -
    annotation for the genes in the GPI file
%%end db=PomBase

%%if db=JaponicusDB
  - [gene_association.${lc_database_name}.gz](${base_url}/data/annotations/Gene_ontology/gene_association.${lc_database_name}.gz) -
    All current *${species_abbrev}* GO annotations in [GAF 2.2 format](http://geneontology.org/docs/go-annotation-file-gaf-format-2.2/), updated nightly
  - [gene_association_2-1.${lc_database_name}.gz](${base_url}/data/annotations/Gene_ontology/gene_association_2-1.${lc_database_name}.gz) -
    All annotations in the older [GAF 2.1 format](http://geneontology.org/docs/go-annotation-file-gaf-format-2.1/)
  - [${lc_database_name}.gpad.gz](${base_url}/data/annotations/Gene_ontology/${lc_database_name}.gpad.gz)
    and
    [${lc_database_name}.gpi.gz](${base_url}/data/annotations/Gene_ontology/${lc_database_name}.gpi.gz) -
    Newer <a href="https://github.com/geneontology/go-annotation/blob/master/specs/gpad-gpi-2-0.md">GPAD/GPI v2.0 format</a>
    annotation files, updated nightly
%%end db=JaponicusDB


### Protein complexes

Also see the [list of protein complexes](${base_url}/latest_release/macromolecular_complexes/),
which uses GO macromolecular complex terms and IDs.

### Notes

The contents of the files downloadable from ${database_name} may
differ from files available elsewhere (e.g. see [this FAQ](/faq/why-are-go-annotations-different-between-${lc_database_name}-and-uniprot-goa)),
and will not include annotations inferred by transitivity (see [this FAQ](/faq/why-are-go-terms-missing-downloadable-annotation-file)).
%%if db=PomBase

Previous versions of the *S. pombe* GO annotation file can be
retrieved from the [archive directory](https://www.pombase.org/data/annotations/Gene_ontology/OLD/).
Note that files produced before March 2021 are only available in GAF 2.1
format.

%%end db=PomBase

%%if db=JaponicusDB
To cite the fission yeast GO data, please see [Citing ${database_name}](/about/citing-japonicusdb).
%%end db=JaponicusDB
