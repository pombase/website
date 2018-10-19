## Quick Little Tool

PomBase's Quick Little Tool (QuiLT) allows you to view multiple types
of annotation for genes in a list in a single graphical display.

![Quick Little Tool display](assets/quilt_display.png){width="600"}

### Finding QuiLT

On any gene list page, including Advanced Search results and the gene
lists linked to ontology term pages, click the "Visualise" button to
reach QuiLT. To return to the previous page, use the "Finish
visualisation" button.

### Adding and sorting annotations

In the QuiLT display, each row represents a single gene, and each
column is an annotation type.

Use the checkboxes (1) to toggle an annotation type on and off. When
annotations are shown, a link appears to sort on that annotation
type. You may want to try different combinations of which types are
shown, and which used to sort the list, until you get a display you
like. You can download the graph (with key) in SVG format at any time
(2). The key (4) shows only terms used to annotate genes in the list,
so for small gene lists not all terms may appear.

Click on a row to select a single gene, or click on a box in any
column (3) to select all genes in it. In the displayed gene list, you
can clear the selection (5) or use the "Filter" button (6) to create a
new gene list from the selection (which you can then visualise in
QuiLT).


### Available annotation types

At present, QuiLT includes:

- deletion viability
- presence or absence of budding yeast orthologs
- presence or absence of human orthologs
- GO biological process
- GO cellular component
- GO molecular function

#### GO annotation precedence

In each branch of GO, only one term can be included for display. If a
gene is annotated to more than one GO term, one is selected for the
QuiLT display according to a set order of precedence:

- GO biological process
   -  signaling (GO:0023052)
   -  gene expression (GO:0010467)
   -  chromatin remodeling (GO:0006338)> protein folding (GO:0006457)
   -  cellular component biogenesis (GO:0044085)
   -  DNA metabolic process (GO:0006259)> cell cycle (GO:0007049)
   -  cytoskeleton organization (GO:0007010)
   -  membrane organization (GO:0061024)
   -  organelle localization (GO:0051640)
   -  lipid metabolic process (GO:0006629)
   -  small molecule metabolic process (GO:0044281)
   -  generation of precursor metabolites and energy (GO:0006091)
   -  transport (GO:0006810)
   -  cellular catabolic process (GO:0044248)
   -  detoxification (GO:0098754)
   -  other (i.e none of the above)
   -  unknown

- GO cellular component
   -  nucleus (GO:0005634)
   -  endoplasmic reticulum (ER; GO:0005783)
   -  mitochondrion (GO:0005739)
   -  cytoplasm (GO:0005737)
   -  other (i.e none of the above)
   -  unknown

- GO molecular function
   -  oxidoreductase activity (GO:0016491)
   -  hydrolase activity (GO:0016787)
   -  transferase activity (GO:0016740)
   -  ligase activity (GO:0016874)
   -  cyclase activity (GO:0009975)
   -  lyase activity (GO:0016829)
   -  unknown catalytic activity (GO:0003824)
   -  enzyme regulator activity (GO:0030234)
   -  transcription regulator activity (GO:0140110)
   -  transporter activity (GO:0005215)
   -  cytoskeletal protein binding (GO:0008092)
   -  unfolded protein binding (GO:0051082)
   -  DNA binding (GO:0003677)
   -  RNA binding (GO:0003723)
   -  metal ion binding (GO:0046872)
   -  lipid binding (GO:0008289)
   -  cell adhesion mediator activity (GO:0098631)
   -  structural molecule activity (GO:0005198)
   -  other (i.e none of the above)
   -  unknown

