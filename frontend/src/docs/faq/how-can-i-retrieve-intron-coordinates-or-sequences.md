# How can I retrieve intron coordinates or sequences?
<!-- pombase_categories: Querying/Searching,Sequence Retrieval -->

Downloadable [ intron]{data-scayt_word="intron"
data-scaytid="1"}datasets are available in FASTA format from the [Intron
Data](/downloads/intron-data)page.

You can also find genes with [ introns]{data-scayt_word="introns"
data-scaytid="2"}using the [ PomBase]{data-scayt_word="PomBase"
data-scaytid="3"}Advanced Search. To find all genes with introns, search
for genes with a specified number of [exons]{data-scayt_word="exons"
data-scaytid="11"}, and use the range 2 (i.e. at least one
[intron]{data-scayt_word="intron" data-scaytid="6"}) to 20 (more than
the maximum known, 16 [introns]{data-scayt_word="introns"
data-scaytid="7"}). You can also restrict the search to protein-coding
genes. Note that the [ PomBase]{data-scayt_word="PomBase"
data-scaytid="9"}count includes [introns]{data-scayt_word="introns"
data-scaytid="8"}in [UTRs]{data-scayt_word="UTRs" data-scaytid="16"}.

Instructions for searching [ PomBase]{data-scayt_word="PomBase"
data-scaytid="18"}

1.  Go to the Advanced Search -
    http://www.pombase.org/spombe/query/builder
2.  Under "Select Filter" choose "Genes That Have N Exons" (under the
    "Gene Filters" heading)
3.  Enter values: Minimum 2, Maximum 20
4.  Optional: to restrict to protein-coding genes, click "+". Leave the
    operator set to "AND", and choose "Genes by Type", then choose
    "protein\_coding".
5.  Click "Submit". The results page has links to download the resulting
    list of genes or the genomic, cDNA or protein sequences. Note that
    we plan to offer additional download options, including coordinates,
    in the future. In the meantime, see the [FAQ on finding sequence
    features in a
    region](/faqs/how-can-i-find-all-sequence-features-region-using-chromosome-coordinates).

Query link: [protein-coding genes with 2-20
exons](/spombe/query/builder?filter=37&value=%5B%7B%22param%22:%7B%22filter_1%22:%7B%22filter%22:%228%22,%22query_1%22:%222%22,%22query_2%22:%2220%22%7D,%22filter_2%22:%7B%22operator%22:%22AND%22,%22filter%22:%229%22,%22query%22:%22protein_coding%22%7D%7D,%22filter_count%22:%222%22%7D%5D)\
\


