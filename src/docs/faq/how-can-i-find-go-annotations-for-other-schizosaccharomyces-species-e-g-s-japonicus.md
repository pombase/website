# How can I find GO annotations for other *Schizosaccharomyces* species (e.g. *S. japonicus*)?
<!-- pombase_categories: Finding data,Using ontologies -->

For the sequenced strains of *S. japonicus*, *S. octosporus* and *S. cryophilus*,
the Ensembl group has generated GO annotation data sets for
protein-coding genes by transferring experiment-based annotations from
*${species_abbrev}* orthologs. You can use the
[QuickGO](http://www.ebi.ac.uk/QuickGO/) browser to retrieve the data for
each species -- follow the "Search and Filter GO annotation sets" link,
then click "Filter" to set a taxon filter for the taxon ID:

- *S. japonicus* (strain yFS275): 402676
- *S. octosporus* (strain yFS286): 483514
- *S. cryophilus* (strain OY26): 653667

Because these automated annotations are inferred only from
experimentally-derived *${species_abbrev}* annotations, coverage will not be
complete.

Note that the GAF downloaded from QuickGO uses UniProtKB accessions in
the gene product ID column (column 2). To use the GAF in any further
analysis, such as term enrichment, you will have to convert the
accessions to systematic IDs. See the 
[FAQ on ID mapping](/faq/can-i-convert-ids-other-databases-or-pombase-ids)
for hints.

One feasible approach to improve annotation coverage is to download the
*${species_abbrev}* GO annotations (see the [GO Annotations download](/downloads/go-annotations) 
page), and then substitute the *${species_abbrev}* IDs with the IDs of
orthologous genes from the other *Schizosaccharomyces* species of
interest. For ortholog IDs, see the 
[FAQ on *Schizosaccharomyces* orthologs](/faq/how-can-i-find-orthologs-between-s.-pombe-and-other-schizosaccharomyces-species),
and use the indicated table from Rhind *et al.* Comparative functional
genomics of the fission yeasts ([PMID:21511999](http://www.ncbi.nlm.nih.gov/pubmed?term=21511999)).

Note that some genes are present in *S. japonicus*, *S. octosporus* or
*S. cryophilus* but absent from *${species_abbrev}*. For some of these gene
products, GO annotations can be transferred from other species. If you
wish to include annotations for these genes in your analysis you will
need to use this option, and extend your GAF with the relevant
annotation lines (contact the [Helpdesk](mailto:helpdesk@pombase.org)
if you need assistance). Combining all approaches gives the best
coverage possible at present. You can use a "GO Slim" tool such as
Princeton's GO Term Mapper to see if there are any gaps in coverage,
as described in the [FAQ on enrichment in *${species_abbrev}*](/faq/how-can-i-find-significant-shared-go-annotations-genes-list).
Also see the FAQs on GO term enrichment in [other *Schizosaccharomyces* species](/faq/can-i-do-go-term-enrichment-other-schizosaccharomyces-species-e.g.-s.-japonicus).

