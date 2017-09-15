# How can I find GO annotations for other Schizosaccharomyces species (e.g. S. japonicus)?
<!-- pombase_categories: Datasets,Querying/Searching,Using Ontologies -->

For the sequenced strains of *S. japonicus*, *S. octosporus*and *S.
cryophilus*, the Ensembl group has generated GO annotation data sets for
protein-coding genes by transferring experiment-based annotations from
*S. pombe*orthologs. You can use the
[QuickGO](http://www.ebi.ac.uk/QuickGO/)browser to retrieve the data for
each species -- follow the "Search and Filter GO annotation sets" link,
then click "Filter" to set a taxon filter for the taxon ID:\
\
*S. japonicus*(strain yFS275) - 402676\
*S. octosporus*(strain yFS286) - 483514\
*S. cryophilus*(strain OY26) - 653667\
\
Because these automated annotations are inferred only from
experimentally-derived *S. pombe*annotations, coverage will not be
complete.

Note that the GAF downloaded from QuickGO uses UniProtKB accessions in
the gene product ID column (column 2). To use the GAF in any further
analysis, such as term enrichment, you will have to convert the
accessions to systematic IDs. See the [FAQ on ID
mapping](/faqs/can-i-convert-ids-other-databases-or-pombase-ids)for
hints.

One feasible approach to improve annotation coverage is to download the
*S. pombe*GO annotations (see the [GO Associations
download](/downloads/go-associations)page), and then substitute the *S.
pombe*IDs with the IDs of orthologous genes from the other
*Schizosaccharomyces*species of interest. For ortholog IDs, see the [FAQ
on
*Schizosaccharomyces*orthologs](/faqs/how-can-i-find-orthologs-between-s-pombe-and-other-schizosaccharomyces-species),
and use the indicated table from [Rhind]{data-scayt_word="Rhind"
data-scaytid="5"} *et al.*Comparative functional genomics of the fission
yeasts ( [[ PMID]{data-scayt_word="PMID"
data-scaytid="6"}:21511999](http://www.ncbi.nlm.nih.gov/pubmed?term=21511999)).

[ [ [ [Note that some genes are present in ]{}
]{style="font-size: small;"} ]{style="font-family: Arial,sans-serif;"}
]{style="color: #000000;"} [ [ [ [ *S. japonicus* ]{}
]{style="font-size: small;"} ]{style="font-family: Arial,sans-serif;"}
]{style="color: #000000;"} [ [ [ [, ]{} ]{style="font-size: small;"}
]{style="font-family: Arial,sans-serif;"} ]{style="color: #000000;"} [ [
[ [ *S. octosporus* ]{} ]{style="font-size: small;"}
]{style="font-family: Arial,sans-serif;"} ]{style="color: #000000;"} [ [
[ [ or ]{} ]{style="font-size: small;"}
]{style="font-family: Arial,sans-serif;"} ]{style="color: #000000;"} [ [
[ [ *S. cryophilus* ]{} ]{style="font-size: small;"}
]{style="font-family: Arial,sans-serif;"} ]{style="color: #000000;"} [ [
[ [but absent from]{} ]{style="font-size: small;"}
]{style="font-family: Arial,sans-serif;"} ]{style="color: #000000;"} [ [
[ [ *S. pombe* ]{} ]{style="font-size: small;"}
]{style="font-family: Arial,sans-serif;"} ]{style="color: #000000;"} [ [
[ [. For some of these gene products, GO annotations can be transferred
from other species. If you wish to include annotations for these genes
in your analysis you will need to use this option, and extend your GAF
with the relevant annotation lines (contact the
[Helpdesk](mailto:helpdesk@pombase.org)if you need assistance).\
]{} ]{style="font-size: small;"}
]{style="font-family: Arial,sans-serif;"} ]{style="color: #000000;"}

Combining all approaches gives the best coverage possible at present.
You can use a "GO Slim" tool such as Princeton's GO Term Mapper to see
if there are any gaps in coverage, as described in the [FAQ on
enrichment in *S.
pombe*](/faqs/how-can-i-find-significant-shared-go-annotations-genes-list).
Also see the FAQs on GO term enrichment in [other
*Schizosaccharomyces*species](/faqs/can-i-do-go-term-enrichment-other-schizosaccharomyces-species-eg-s-japonicus).

