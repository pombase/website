## Quick Little Tool

${database_name}'s Quick Little Tool (QuiLT) allows you to view multiple types
of annotation for genes in a list in a single graphical display.

[![Quick Little Tool display](assets/quilt_display.png){ .screenshot width="800"}](assets/quilt_display.png)

### Finding QuiLT

On any gene list page, including Advanced Search results and the gene
lists linked to ontology term pages, click the "Visualise" button to
reach QuiLT. To return to the previous page, use the "Finish
visualisation" button.

### Adding and sorting annotations

In the QuiLT display, each row represents a single gene, and each
column is an annotation type.

Use the checkboxes to toggle an annotation type on and off. When
annotations are shown, a `[sort]` button appears to allow reordering
the image using that annotation type.
You may want to try different combinations of which types are
shown, and which used to sort the list, until you get a display you
like. You can download the graph (with key) in SVG format at any time
using the "Download image ..." button on the left. The key
shows only terms used to annotate genes in the list,
so for small gene lists not all terms may appear.

Click on a row to select a single gene, or click on a box in any
column to select all genes in it. In the displayed gene list on the
right, you
can clear the selection or use the "Filter" button to create a
new gene list from the selection (which you can then visualise in
QuiLT).

### Adding a new column

If you would like to see which genes in the display are annotated with
a particular GO or MONDO disease term, use the "Add column ..." button
on the left.  You will be prompted for a term name from the Gene
Ontology (eg. "developmental process" or "catalytic complex") or from
the MONDO disease (eg. "mitochondrial disease" or "cancer").

The diagram can be sorted based on the data in the new column with the
`[sort]` buttons and can be removed with the `[x]`.

### Sharing results

Each QuiLT visualisation page has a stable, unique URL that you can
bookmark, copy/paste, and share. Anyone who follows a shared link will
see QuiLT displaying the same gene list. Clicking the "Advanced
Search" button adds a query that would produce the gene list to the
query history.

### Available annotation types

At present, QuiLT includes:

%%if db=PomBase
- Deletion viability
%%end db=PomBase
%%if db=JaponicusDB
- Presence or absence of *S. pombe* orthologs
%%end db=JaponicusDB
- Presence or absence of budding yeast orthologs
- Presence or absence of human orthologs
- Presence or absence of transmembrane domains
- GO biological process
- GO cellular component
- GO molecular function
%%if db=PomBase
- [Characterization status](/status/protein-status-tracker) for protein-coding genes
- [Taxonomic distribution](/documentation/taxonomic-conservation)
%%end db=PomBase
- Protein length

#### GO annotation precedence

In each branch of GO, only one term per gene can be included for
display. If a gene is annotated to more than one GO term, one is
selected for the QuiLT display according to a set order of precedence:

 * GO biological process
     - signaling (GO:0023052)
     - gene expression (GO:0010467)
     - chromatin organization (GO:0006325)
     - protein folding (GO:0006457)
     - cellular component biogenesis (GO:0044085)
     - DNA metabolic process (GO:0006259)
     - cell cycle (GO:0007049)
     - cytoskeleton organization (GO:0007010)
     - membrane organization (GO:0061024)
     - organelle localization (GO:0051640)
     - lipid metabolic process (GO:0006629)
     - small molecule metabolic process (GO:0044281)
     - generation of precursor metabolites and energy (GO:0006091)
     - transport (GO:0006810)
     - cellular catabolic process (GO:0044248)
     - detoxification (GO:0098754)
     - other (i.e none of the above)
     - unknown

 * GO cellular component
     - nucleus (GO:0005634)
     - endoplasmic reticulum (ER; GO:0005783)
     - mitochondrion (GO:0005739)
     - cytoplasm (GO:0005737)
     - other (i.e none of the above)
     - unknown

 * GO molecular function
     - oxidoreductase activity (GO:0016491)
     - hydrolase activity (GO:0016787)
     - transferase activity (GO:0016740)
     - ligase activity (GO:0016874)
     - cyclase activity (GO:0009975)
     - lyase activity (GO:0016829)
     - other catalytic activity (any other descendant of GO:0003824)
     - molecular adaptor activity (GO:0060090)
     - enzyme regulator activity (GO:0030234)
     - DNA binding (GO:0003677)
     - transcription regulator activity (GO:0140110)
     - transporter activity (GO:0005215)
     - cytoskeletal protein binding (GO:0008092)
     - unfolded protein binding (GO:0051082)
     - RNA binding (GO:0003723)
     - metal ion binding (GO:0046872)
     - lipid binding (GO:0008289)
     - cell adhesion mediator activity (GO:0098631)
     - structural molecule activity (GO:0005198)
     - other (i.e none of the above)
     - unknown

