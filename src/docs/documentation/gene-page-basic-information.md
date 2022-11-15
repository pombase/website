## Gene page: Basic information

At the top of each gene page is a set of basic information about the
gene:

![top of gene page](assets/basic_info_gene_page.png  "Gene page basic information"){width="800"}

1.  See the [Gene Name Registry](/submit-data/gene-names) for more
    information about *${species_abbrev}* gene names. Synonyms include all
    names other than the standard name that have been published for a
    gene, and thus are not guaranteed to be unique.
2.  Free text description of the gene product
3.  Chromosome coordinates for the gene. For protein-coding genes, the
    "coding start to stop" numbers give the start, end, and length
    excluding UTRs but including introns (other than introns located
    entirely within UTRs).
%%if db=PomBase
    The second set of numbers indicate the
    gene start, end, and length including the default UTRs chosen by
    PomBase curators (see [this FAQ](/faq/how-do-you-determine-gene-s-full-length-transcript-utr-coordinates-transcription-start-and-end-sites)
    for more information).
%%end db=PomBase
4.  What the three-letter acronym stands for; where available, name
    descriptions are provided for synonyms as well as primary names.
5.  Category describing how well-studied a gene is; see the [Gene
    Characterisation](/status/gene-characterisation) page for
    details. Note: at present this is used in PomBase for *S. pombe*,
    but not in JaponicusDB.
6.  Indicates whether a gene encodes protein, specifies a non-coding
    RNA, or is a pseudogene
7.  The size of the mature gene product. For protein-coding genes, the
    length (number of amino acid residues) and molecular weight are
    shown.
8.  Interactive graphic from ${database_name} JBrowse, centred on the location
    of the gene. Drag to scroll left and right, double-click to zoom
    in, shift-double-click to zoom out, and click a feature to see
    details in a popup. The "Full-screen view" link in the corner
    opens the fully functional JBrowse in a new tab or
    window. Reloading a gene page restores the display to the default
    location and zoom level.
9.  Links to gene pages for nearby genes
