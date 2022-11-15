### GO annotations

*${species_abbrev}* GO annotations are available as tab-delimited files
in [GAF 2.2 format](http://geneontology.org/docs/go-annotation-file-gaf-format-2.2/).
The files include annotations made by manual literature
curation, annotations inferred from keyword mappings based on curated
descriptions, and annotations shared by the UniProt
[GOA](http://www.ebi.ac.uk/GOA) team.

#### Annotation files

  - [gene_association.${lc_database_name}.gz](${base_url}/data/annotations/Gene_ontology/gene_association.${lc_database_name}.gz) -
    All current *${species_abbrev}* GO annotations in [GAF 2.2 format](http://geneontology.org/docs/go-annotation-file-gaf-format-2.2/), updated nightly
  - [gene_association_2-1.${lc_database_name}.gz](${base_url}/data/annotations/Gene_ontology/gene_association_2-1.${lc_database_name}.gz) -
    All annotations in the older [GAF 2.1 format](http://geneontology.org/docs/go-annotation-file-gaf-format-2.1/)
  - [${lc_database_name}.gpad.gz](${base_url}/data/annotations/Gene_ontology/${lc_database_name}.gpad.gz)
    and
    [${lc_database_name}.gpi.gz](${base_url}/data/annotations/Gene_ontology/${lc_database_name}.gpi.gz) -
    Newer [GPAD/GPI v2.0 format](https://github.com/geneontology/go-annotation/blob/master/specs/gpad-gpi-2-0.md)
    annotation files, updated nightly


#### Protein complexes

Also see the [list of protein complexes](${base_url}/data/annotations/Gene_ontology/GO_complexes/),
which uses GO macromolecular complex terms and IDs.

#### Notes

The contents of the files downloadable from ${database_name} may
differ from files available elsewhere (e.g. see [this FAQ](/faq/why-are-go-annotations-different-between-${lc_database_name}-and-uniprot-goa)),
and will not include annotations inferred by transitivity (see [this FAQ](/faq/why-are-go-terms-missing-downloadable-annotation-file)).
%%if db=PomBase
Previous versions of the *S. pombe* GO annotation file can be
retrieved from the [archive directory](https://www.pombase.org/data/annotations/Gene_ontology/OLD/).
Note that files produced before March 2021 are only available in GAF 2.1
format.

To cite the fission yeast GO data, please see [Citing ${database_name}](/about/citing-pombase).

%%end db=PomBase

%%if db=JaponicusDB
To cite the fission yeast GO data, please see [Citing ${database_name}](/about/citing-japonicusdb).
%%end db=JaponicusDB
