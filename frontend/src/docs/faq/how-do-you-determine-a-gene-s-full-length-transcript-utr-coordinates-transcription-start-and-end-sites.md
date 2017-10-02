# How do you determine a gene's full-length transcript? / UTR coordinates? / transcription start and end sites?
<!-- pombase_categories: Genome statistics and lists,Finding data -->

PomBase curators have chosen default UTR features using three data
sources and a set of precedence criteria:

1.  Highest priority is given to data from low-throughput "conventional"
    experiments performed on individual mRNAs and reported in
    publications or submitted to EMBL. Where low-throughput data are not
    available, one of three high-throughput datasets is used.
2.  The Broad data published in 2011 by Rhind *et al.* 
    ([PMID:21511999](http://www.ncbi.nlm.nih.gov/pubmed?term=21511999))
    is given precedence because it is the most recent, is higher
    resolution and detected splicing within the UTRs. **Note**: This
    study used a "greedy" algorithm to determine the longest possible
    transcript from transcriptome reads, which may result in the
    prediction of longer UTRs than are actually present. Use these data
    with caution, and refer to the transcript profiling data in the
    genome browser for genes of interest.
3.  For genes not covered by (1) or (2), start/end data from Lantermann
    *et al.* ([PMID:20118936](http://www.ncbi.nlm.nih.gov/pubmed?term=20118936))
    based on transcriptome data from Dutrow *et al.* ([PMID:18641648](http://www.ncbi.nlm.nih.gov/pubmed?term=18641648))
    are used where available.
4.  For genes not covered by (1), (2) or (3), we use data from Wilhelm
    *et al.* ([PMID:18488015](http://www.ncbi.nlm.nih.gov/pubmed/18488015)).

More information is available in the mailing list archive for two HTP
datasets (Broad:
http://listserver.ebi.ac.uk/pipermail/pombelist/2011/000856.html ;
Lanterman/Dutrow:
http://listserver.ebi.ac.uk/pipermail/pombelist/2011/000814.html).

Transcript start and end coordinates from all sources will be available
as individual data tracks in the Ensembl genome browser in the near
future, which will allow you to view and evaluate them. PomBase will
also curate splice and transcript variants as data become available.

<!-- remove this when ticket #350 done -->
Note: exon and CDS coordinates are temporarily unavailable on PomBase gene pages.
