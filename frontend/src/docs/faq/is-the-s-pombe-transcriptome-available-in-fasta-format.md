# Is the *S. pombe* transcriptome available in FASTA format?
<!-- pombase_categories: Finding data,Tools and resources -->

There is no single transcriptome sequence file available from PomBase at
present. Several transcriptomic data sets are available as
[tracks](/faq/how-can-i-show-or-hide-tracks-genome-browser) in the
PomBase [genome browser](http://fungi.ensembl.org/Schizosaccharomyces_pombe/Info/Index).
The GFF3 genome feature files available from the [Genome Datasets](/downloads/genome-datasets) page include the coordinates of the
[annotated full-length transcript features](/faq/how-do-you-determine-gene-s-full-length-transcript-utr-coordinates-transcription-start-and-end-sites).

The bioinformatically inclined can also use the Ensembl Genomes REST API
to retrieve transcript feature coordinates. The [FAQ on programmatic access to PomBase](/faq/there-any-programmatic-access-pombase-data) provides an
introduction to using the API, some pombe-specific examples, and links
to additional documentation.

-   For transcript coordinates, first retrieve all stable IDs using this
    URL:
    -   <http://rest.ensemblgenomes.org/lookup/genome/schizosaccharomyces\_pombe?content-type=application/json>
-   For each ID in the list, retrieve details via URLs in this format:
    -   <http://rest.ensemblgenomes.org/lookup/id/SPBC11B10.09?content-type=application/json;expand=1>;
-   Use your preferred scripting method to iterate through the ID list
    and parse the desired coordinates from the data obtained via the
    second URL.

The Broad Institute has [archived genomic data files](http://www.broadinstitute.org/ftp/pub/annotation/fungi/schizosaccharomyces/) for
the *Schizosaccharomyces* species, including transcript files.

