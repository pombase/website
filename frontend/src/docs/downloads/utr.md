## Available UTR datasets

-   [5' UTR](ftp://ftp.ebi.ac.uk/pub/databases/pombase/pombe/UTR/5UTR.fa.gz)
-   [3' UTR](ftp://ftp.ebi.ac.uk/pub/databases/pombase/pombe/UTR/3UTR.fa.gz)
-   [Parent directory link](ftp://ftp.ebi.ac.uk/pub/databases/pombase/pombe/UTR/)

These datasets contain the default UTR features, determined by
PomBase curators as described in [this
FAQ](/faqs/how-do-you-determine-genes-full-length-transcript-utr-coordinates-transcription-start-and-end-s).

The headers are set out like so:

``` {style="margin-left: 40px;"}
>SPCC338.13|1351474|1354474|-1|cog4|III|protein_coding|Golgi transport complex subunit Cog4 (predicted)
 ^          ^       ^       ^  ^    ^   ^              ^
 |          |       |       |  |    |   |              \_ Description
 |          |       |       |  |    |   |
 |          |       |       |  |    |   \_ Feature type
 |          |       |       |  |    |
 |          |       |       |  |    \_ Chromosome
 |          |       |       |  |
 |          |       |       |  \_ Gene Name  
 |          |       |       |
 |          |       |       \_ Strand
 |          |       |
 |          |       \_ Gene End
 |          |     
 |          \_ Gene Start
 |
 \_ Systematic_ID
```

The UTR files are updated with each PomBase data update. Old versions
are
[archived](ftp://ftp.ebi.ac.uk/pub/databases/pombase/pombe/Archived_directories/UTRs/).
