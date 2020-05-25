# How can I find transposons in the *S. pombe* genome?
<!-- pombase_categories: Finding data,Tools and resources -->

In the [advanced search](/query), click "Characterisation status",
then select "transposon" from the pulldown.

At present, there are 11 full-length transposons annotated, and two
frameshifted copies.

Query link: <app-query-link [goToResults]="true" [linkText]="'Transposons'" [predefinedQueryId]="'transposons'"></app-query-link>

Lone LTRs are also annotated as sequence features. They cannot yet be
retrieved by the simple or advanced searches, but they are included in
the forward and reverse strand sequence feature tracks in the genome
browser.

Finally, if you wish to install Artemis (available from
[The Sanger Institute Artemis page](http://www.sanger.ac.uk/science/tools/artemis);
for *S. pombe* we recommend using [Artemis Version 16](ftp://ftp.sanger.ac.uk/pub/resources/software/artemis/v16/)), you can use it to view
LTRs in more detail. Read in the EMBL format files of sequence and
annotation (available from the [Genome sequences](/downloads/genome-datasets) page). To see LTRs,

1.  In the Select menu, choose "By Key".
2.  In the pulldown that pops up, choose "LTR".

See the [Artemis FAQ](/faq/there-equivalent-artemis-java-applet-pombase) and the 
[Artemis manual](ftp://ftp.sanger.ac.uk/pub/resources/software/artemis/artemis.pdf) (pdf;
Sanger site) for additional information.

