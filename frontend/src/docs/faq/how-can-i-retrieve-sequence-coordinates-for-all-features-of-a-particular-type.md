# How can I retrieve sequence coordinates for all features of a particular type?
<!-- pombase_categories: Querying/Searching,Sequence Retrieval -->

Available options:

1.  Download one of the files available via the [Genome     Datasets](/downloads/genome-datasets)page. The GFF3 files contain
    coordinates, whereas the EMBL- and GenBank-format files contain both
    coordinates and sequence data. You can then parse the files for the
    feature type you need. For example, to find all non-coding RNAs,
    search for "ncRNA\_gene"; for coding sequences, use "CDS", etc.
    There are also separate files available for CDS and UTR data.
2.  If you only need genes, you can use the Advanced Search to find all
    genes of a given type. (Note that non-gene features such as repeats
    cannot be retrieved by this method.) Select the "Genes By Type"
    filter, then choose a type from the pulldown menu. The results
    include coordinates, and the "Download Results" options include
    sequences in FASTA format. If you need more than one feature type,
    query for each type and then use Query Management to combine the
    individual queries with the OR operator. See the Advanced Search
    documentation for more information.
3.  The bioinformatically inclined can also use the Ensembl Genomes REST
    API to retrieve transcript feature coordinates, as described in the
    [FAQ on pombe transcriptome     sequences](/faq/s-pombe-transcriptome-available-fasta-format).
    Select the desired feature type(s) from the output file of stable
    IDs (bear in mind that Ensembl idiosyncratically uses "biotype" to
    mean feature type).

Example advanced search query: [snoRNA genes](/spombe/query/builder?filter=37&value=%5B%7B%22param%22:%7B%22filter_1%22:%7B%22filter%22:%229%22,%22query%22:%22snoRNA%22%7D%7D,%22filter_count%22:%221%22%7D%5D)

