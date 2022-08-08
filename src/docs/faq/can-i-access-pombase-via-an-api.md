# Can I access ${database_name} via an API?
<!-- pombase_categories: Tools and resources -->

There are two APIs for ${database_name} data:

 - InterMine: more advanced and is updated regularly
 - Ensembl: updated less often but is better known

### InterMine API

The ${database_name} data can be accessed programmatically using the InterMine API.
See the [InterMine Documentation and examples](https://intermine.readthedocs.io/en/latest/web-services/) to find out more.

Available data types include:

  - gene and protein identifiers and other properties 
  - allele and genotypes
  - annotation details (genes, genotypes, ontology terms, evidence codes and PubMed IDs)

InterMine Client libraries are available in multiple languages.

### Ensembl API
This API can be used to query *${species_abbrev}* data in Ensembl Genomes.  Note
that EG is updated much less frequently than ${database_name}, so EG data will
rarely be as up-to-date as the ${database_name} web site.

Documentation:

1.  [Ensembl Genomes Perl API installation and basic use instructions](http://www.ensembl.org/info/docs/api/index.html) -
    Includes links to additional Ensembl API documentation
2.  [Tutorial for using the API with the core database](http://www.ensembl.org/info/docs/api/core/core_tutorial.html) -
    Includes examples about connecting to the database, retrieving
    chromosomes, genes, transcript and translations along with the
    corresponding xrefs
