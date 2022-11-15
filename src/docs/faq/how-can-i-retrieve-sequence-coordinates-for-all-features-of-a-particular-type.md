# How can I retrieve sequence coordinates for all features of a particular type?
<!-- pombase_categories: Finding data -->

Available options:

1.  Download one of the files available via the 
    [Genome Datasets](/downloads/genome-datasets) 
    page. The GFF3 files contain coordinates, and you can parse the
    files for the feature type you need. For example, to find all
    non-coding RNAs, search for "ncRNA\_gene"; for coding sequences,
    use "CDS", etc.  There are also separate files available for CDS
    and UTR data.

2.  If you only need genes, you can use the [advanced search](/query)
    to find all genes of a given type. (Note that non-gene features
    such as repeats cannot be retrieved by this method.) Select the
    "Product type" query, then choose a type from the pulldown
    menu. The "Download" options include coordinates and sequences in
    FASTA format. If you need more than one feature type,
    query for each type and then use Query Management to combine the
    individual queries with the "Union" (OR operator) button. See the 
    [advanced search documentation](/documentation/advanced-search)
    for more information. Click on a count in the query history to see
    the results, with a button for "Download" options including
    coordinates and sequence.

%%if db=PomBase
3.  The bioinformatically inclined can also use the Ensembl Genomes REST
    API to retrieve transcript feature coordinates, as described in the
    [FAQ on ${species} transcriptome sequences](/faq/s.-pombe-transcriptome-available-fasta-format).
    Select the desired feature type(s) from the output file of stable
    IDs (bear in mind that Ensembl idiosyncratically uses "biotype" to
    mean feature type). Note, however, that EG is updated much less
    frequently than ${database_name}, so EG data will rarely be as up-to-date
    as the ${database_name} web site. Documentation is available:
%%end db=PomBase

Query: <app-query-link [goToResults]="true" [linkText]="'snoRNA genes'" [predefinedQueryId]="'snorna_genes'">
</app-query-link>
