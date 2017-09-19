# Can I convert IDs from other databases to or from PomBase IDs?
<!-- pombase_categories: Tools and Resources -->

PomBase does not have its own tool for ID conversion. We suggest you try
the EBI's PICR web service ( <http://www.ebi.ac.uk/Tools/picr/>), which
can convert between UniProtKB, RefSeq, Ensembl Genomes (including *S.
pombe*systematic IDs) and many other common database IDs.

For UniProt IDs, we provide a static mapping file of PomBase systematic
IDs and UniProtKB accessions, available on the [Data Mapping](/downloads/data-mappings) page and by FTP from
<ftp://ftp.ebi.ac.uk/pub/databases/pombase/pombe/Mappings/PomBase2UniProt.tsv>.

For other *Schizosaccharomyces*species ( *S. japonicus, S. octosporus,
S. cryophilus*), the PICR service converts between UniProtKB accessions
and the identifiers used in Rhind *et al.*Comparative functional
genomics of the fission yeasts (
[PMID:21511999](http://www.ncbi.nlm.nih.gov/pubmed?term=21511999)), but
with one caveat: the IDs used by PICR, UniProtKB, and QuickGO contain
underscores, whereas those in Rhind *et al.*do not (e.g. SJAG\_00455
versus SJAG00455). The IDs with underscores are correct.

