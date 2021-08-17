## Getting started with ${database_name} JBrowse

The ${database_name} genome browser can be accessed in multiple ways:

- On any ${database_name} page, click the "Search" tab in the header menu, and
  select "Genome browser"
- From a gene page, click the "View region in JBrowse ..." link just
  above the map image
- On the publication page for any paper with associated datasets,
  select tracks from the list and click the "Load in JBrowse" button
- Go directly to [https://www.pombase.org/jbrowse/](https://www.pombase.org/jbrowse/)

### DNA sequence, forward features and reverse features

Tracks for annotated sequence features &mdash; genes, repeats,
etc. &mdash; on the forward and reverse strands are displayed by
default.

To show the track containing the reference DNA sequence, use the
"Genome sequence and features" filter and enable the "DNA sequence"
track as described below.

See [this FAQ](/faq/how-can-i-display-sequence-region-using-sequence-coordinates-genome-browser)
to display a sequence region using coordinates.

To download sequence, see the "Exporting data" section below (it works
the same way as for any other track).

### Enabling data tracks
To show data tracks:

1. Click on the "Select tracks" button in the top left corner.

    ![JBrowse top, with "select tracks" button highlighted](assets/jbrowse_main_top_track_button.png){width="700"}

2. Locate the track(s) of interest (see below), and then click the
tickbox for any individual track to toggle it on/off, or use the
tickbox in the header to enable/disable all of the listed tracks at
once.

3. Click the "Back to browser" button at the top.

4. The tracks should now be displayed. For example, the sequence
feature and DNA sequence tracks look like this:

    ![JBrowse display of pombe sequence and features](assets/jbrowse_seq_feature_tracks.png){width="700"}

To hide a track, click the (X) button to the left of the track label,
or go to the "Select tracks" page and clear its tickbox.

Drag and drop tracks to change the order in which they appear.

#### Changing the track scale
By default, the scale fits the range of the data being displayed in the current viewing window. The scale can be manually defined.

Click the downarrow to the right of the track label, and click on edit config:

![Jbrowse edit config](assets/jbrowse_track_label_config.png){width="700"}

Change the scale by defining a max_score and/or a min score:

![JBrowse_max_score defined](assets/jbrowse_max_score.png){width="400"}

The scale can be made consistent across tracks: 

![rescaled tracks](assets/jbrowse_rescaled.png){width="700"}
jbrowse_rescaled.png

More wiggle track configuration option in the official
[JBrowse documentation](http://gmod.org/wiki/JBrowse_Configuration_Guide#Wiggle_track_configuration_options)


#### Locating data
Each entry in the left-hand column can be used to filter the track
list. Filter criteria fall into several categories, corresponding to
some of the track metadata (see below):

![JBrowse track selection interface](assets/jbrowse_track_selector.png){width="450"}

As you select filters, the screen will update to show only relevant
criteria on the left, and matching tracks on the right.

You can also search for names, keywords, etc. using the "Contains
text" box.

Any applied filters, including text, can be cleared by clicking the
red X button that appears next to a selected filter (in the search box
or the left-hand column), or by using the "Clear All Filters" button.

For a list of recently enabled tracks, click "Recently Used".

#### Track metadata
Information about each track is captured as part of the curation
process. Metadata includes:

- Data type: what the experiment measured
- Track label (name): Brief description that appears with the track in
  the browser display
- Alleles: data from wild type or mutant cells
- Growth phase or response: data from cells assayed a specific stress
  response or growth phase (e.g. nitrogen starvation, oxidative
  stress, vegetative growth)
- Localized gene product: the protein assayed in a chromatin binding
  experiment
- Strain background mutations: any background mutations present in the
  strain for experimental purposes only and not considered as
  influencing the results in themselves, such as auxotrophic markers
  (e.g. *leu1-1*) or alleles utilized for block and release experiments
  (e.g. *cdc25-22*)
- Mating type and ploidy
- Conditions: experimental conditions, e.g. whether cells were grown
  in YES or EMM, or if H<sub>2</sub>O<sub>2</sub> or t-BOOH was used
  to induce oxidative stress
- Study ID: accession for the study encompassing the data in external
  databases (e.g. GEO, ArrayExpress)
- Sample ID: accession for the sample used to generate the data in
  external databases (e.g. GEO, ArrayExpress)
- First author name
- PubMed ID: paper in which the data were published
- Publication year

The metadata can be viewed in two ways:

1. In the track selector, tracks are listed with associated metadata
on the right hand side:

    ![JBrowse track selector with metadata headers highlighted](assets/jbrowse_track_selection_top.png){width="750"}

2. In the browser, hover over a track label to display a down
arrow:

    ![JBrowse track label](assets/jbrowse_track_label_hover.png){width="300"}

    Click the arrow, then click "About this track" in the dropdown menu:

    ![JBrowse track dropdown menu](assets/jbrowse_track_menu_about.png){width="400"}

    The metadata and stats are displayed:

    ![JBrowse track metadata popup](assets/jbrowse_metadata_popup.png){width="400"}

    To dismiss the popup, click the 'X' in the upper right corner or
    the 'OK' button at the bottom.

### Navigating the browser
#### Moving around
There are several ways to navigate the genome.

- Use the box at the top that displays the chromosomal coordinates to
  navigate to a specified location:
![JBrowse top of main display](assets/jbrowse_main_top_coords.png){width="600"}

    In the coordinates box,
     - Type a gene name, or
     - Select a chromosome in the pulldown, then type or paste a range
       of coordinates (two numbers separated by two dots,
       e.g. 2323258..2336458).
         - If you select one of the pulldown options but omit
          coordinates, the browser goes to a default location spanning
          most of the selected chromosome.
         - You can also type both a chromosome ID and coordinates
          directly in the location box, e.g II:2323258..2336458. Use
          Roman numerals (I, II, III) for the three nuclear
          chromosomes.
     - Click the "Go" button or hit return to go to the gene or
       region.
     - Coordinates for some regions of interest: 
         - Centromeres
             - I:3753687..3789421
             - II:1602264..1644747
             - III:1070904..1137003
         - Mating type region
             - II:2129208..2137121
         - rDNA (link to one complete repeat)
            - III:5542..13722
     - For more information on the chromosome selection options, see
       ${database_name} documentation on [genome sequencing status](status/sequencing-status),
       the [mating type region](status/mating-type-region), and
       [rDNA](faq/there-any-rdna-repeat-sequences-pombase).

- In the uppermost bar, a red box indicates the size and position of
  the currently displayed region, in the context of the whole
  chromosome. Click in the bar or drag the red box to change position.

    ![JBrowse position bar](assets/jbrowse_position_bar.png){width="500"}

- Use the arrows next to the bar with the box for chromosomal
  coordinates to move right or left in increments.
- Drag or swipe (depending on device) in the main browser window to
  scroll.


#### Zooming
To zoom:

- Use the + and - buttons, or
- In the main browser window, double-click to zoom in, and
  shift-double-click to zoom out, or
- Use the narrow bar below the chromosomal coordinates:

    ![JBrowse region selection bar](assets/jbrowse_region_selection_bar.png){width="300"}

     Click and drag to highlight a region, then click within the
     highlighted region to zoom so the region fills the browser window:

    ![JBrowse zoom in on selected region](assets/jbrowse_region_zoom.png){width="500"}

To see the DNA sequence, zoom in until it appears, first as
color-coded blocks, and then labeled with letters.

More *S. pombe*-specific information can be found in the [Genome
browser FAQ list](https://www.pombase.org/faq/genome-browser).

### Exporting data
To export the data for any track, hover over the track label to
display a down arrow:

![JBrowse track label](assets/jbrowse_track_label_hover.png){width="300"}

Click the arrow, then click "Save track data" in the dropdown menu:

![JBrowse track dropdown menu save data](assets/jbrowse_track_menu_save.png){width="400"}

In the popup, choose a data format. DNA sequence is provided in FASTA
format. GFF3 is available for most tracks; other options depend on the
data type. You can also edit the name of the file where the data will
be saved.


![JBrowse track metadata popup](assets/jbrowse_metadata_popup.png){width="400"}

Click 'View' to see how the data will appear in the saved file. To
download the data file click 'Save' (available in the original
popup or the 'View' panel). To dismiss the popup withous saving,
click the 'X' in the upper right corner or the 'Close' button at
the bottom.
