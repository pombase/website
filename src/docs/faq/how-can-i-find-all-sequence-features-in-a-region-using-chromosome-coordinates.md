# How can I find all sequence features in a region using chromosome coordinates?
<!-- pombase_categories: Genome browser,Finding data -->

You can do this in the [genome browser](https://www.pombase.org/jbrowse/) 
(or follow a link from a gene page). First [enter the coordinates](/faq/how-can-i-display-sequence-region-using-sequence-coordinates-genome-browser).

Ensure that the ${database_name} forward and reverse strand feature tracks are
visible (they are enabled by default). For each strand, click the
small triangle at the right-hand end of the track label to reveal the
popup menu. Select "Save track data", then choose from the options in
the popup.

You can also use the [advanced search](https://www.pombase.org/query)
to retrieve genes in a region, but at present other sequence feature
types are not included. Use the "Genome location" query. First, select
a chromosome in the pulldown. You can then either add start and end
coordinates to specify a region, or leave the "Restrict to region"
boxes blank to retrieve all genes on the chromosome.
