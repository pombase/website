# Can I generate a comprehensive restriction enzyme map of the genome in ${database_name}?
<!-- pombase_categories: Tools and resources -->

No, but this can be done within Artemis.

Install Artemis (available from
<http://www.sanger.ac.uk/science/tools/artemis>; for *${species_abbrev}* we recommend using [Artemis Version 16](ftp://ftp.sanger.ac.uk/pub/resources/software/artemis/v16/).

You can then read in the EMBL format chromosome contig files of
sequence and annotation (available from the 
[Genome datasets](/downloads/genome-datasets) page). To
generate a restriction map:

1.  Create a new entry using the "Create" menu item "New Entry"
2.  Toggle off the main annotation by un-checking the chromsome contig
    file (this will make your new file "no name" the active entry).
3.  Save your new file with your preferred name.
4.  Use the Create menu option "Mark From Pattern" to create features
    for any restriction patterns of interest and save them into your
    file.
5.  You can add "color" labels to distinguish the different restriction
    sites. See the
%%if db=PomBase
    [Artemis FAQ](/faq/there-equivalent-artemis-java-applet-pombase)
%%end db=PomBase
%%if db=JaponicusDB
    [Artemis FAQ](/faq/how-can-i-use-artemis-browse-genome)
%%end db=JaponicusDB
    and the
    [Artemis manual](ftp://ftp.sanger.ac.uk/pub/resources/software/artemis/artemis.pdf) (pdf;
    Sanger site) for additional information.


