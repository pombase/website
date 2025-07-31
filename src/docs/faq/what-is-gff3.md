# What is GFF3?
<!-- pombase_categories: Data submission and formats -->

Generic Feature Format Version 3 (GFF3) is a tab-delimited text file
format used to represent genomic sequence features.

${database_name} produces GFF3 format
%%if db=PomBase
[files of *${species_abbrev}* sequence features](${base_url}/latest_release/genome_sequence_and_features/gff_format/),
%%end db=PomBase
%%if db=JaponicusDB
[files of *${species_abbrev}* sequence features](https://www.pombase.org/data/genome_sequence_and_features/gff3/),
%%end db=JaponicusDB
and accepts high-throughput data submissions in this format.

The [file format specification](https://github.com/The-Sequence-Ontology/Specifications/blob/master/gff3.md) is
available from the [Sequence Ontology](http://www.sequenceontology.org/) GitHub site. 
Validation tools are available from various online providers.

