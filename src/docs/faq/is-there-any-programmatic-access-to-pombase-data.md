# Is there any programmatic access to ${database_name} data?
<!-- pombase_categories: Tools and resources -->

The Ensembl Genomes REST API Endpoints page provides a REST-ful
interface allows language-independent programmatic access to all
genomes accessible through Ensembl Genomes, including the same
Schizosaccharomyces pombe genome sequence data available in
${database_name}. (Note that, while the sequence has not changed recently,
annotation data are likely to be out of date relative to the ${database_name}
web site Ensembl Genomes is updated much less frequently than
${database_name}.) The REST interface provides data in a variety of formats
including GFF3, FASTA and JSON. Data types accessible via this
interface include:

-   genomic features, including genes and CDSs
-   genomic and protein sequences
-   cross-references including ontologies
-   gene trees and orthologues

In addition, the interface also provides access to the Variant Effect
Predictor tool and a tool for mapping genomic coordinates between
different versions of genome assemblies.

The [user guide](https://github.com/Ensembl/ensembl-rest/wiki) provides
comprehensive descriptions of interface functionality, plus examples
using a variety of languages and interfaces. The following URLs are
examples specific to *S. pombe*:

-   retrieve the cDNA sequence of the specified gene in FASTA:
    <http://rest.ensembl.org/sequence/id/SPAC2F7.03c?content-type=text/x-fasta;type=cdna>
-   retrieve list of homologues from the pan-taxonomic comparative
    <database for the specified gene in JSON format:
    http://rest.ensembl.org/homology/id/SPAC2F7.03c?content-type=application/json&format=condensed&compara=pan_homology>
