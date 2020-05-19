# Can I visualise networks in PomBase?
<!-- pombase_categories: Tools and resources -->

This is an area of active development at PomBase. At present, PomBase
links GO terms to the web-based network tool
[esyN](http://www.esyn.org/) ^1^: on the 
[GO biological process slim page](/browse-curation/fission-yeast-bp-go-slim-terms) and on
ontology term pages for GO biological process slim terms, each GO slim
term links to the [HCPIN physical interaction network](/documentation/high-confidence-physical-interaction-network)
in esyN. For example, the GO process slim page and the ontology term page for
"regulation of mitotic cell cycle phase transition" ([GO:1901990](/term/GO:1901990)) link to
<http://www.esyn.org//builder.php?type=Graph&term=GO:1901990&interactionType=physical&source=pombase&includeInteractors=false>.

We plan to provide gene-centred network displays on gene pages in the near future.

<!--
On gene pages, we have links to gene-specific interaction networks in
esyN in the table headers of the Interactions sections:

-   The Genetic Interactions section links to all interactions centred
    on the gene and curated in BioGRID
-   The Physical interactions section has links to two datasets:
    -   All physical interactions curated in BioGRID for the gene
    -   Interactions for the gene in the PomBase [High Confidence         Physical Interaction Network         (HCPIN)](/documentation/high-confidence-physical-interaction-network) 

For example, the Genetic Interactions header for cdc2 links to
<http://www.esyn.org/builder.php?type=Graph&query=SPBC11B10.09&organism=4896&interactionType=genetic&source=biogrid>

-->

Using the esyN network display:

-   A brief simulation is used to position the nodes initially. This
    layout can often be improved by continuing the simulation: click
    "Layouts" in the left-hand panel, then click "Force-Directed
    (improve)". Repeat until you like the network arrangement.
-   You can extend any network in esyN:
 1.  Click on a node in the display.
 2.  Click "Extend Network" in the right-hand bar.
 3.  In the Advanced Tools box under the network display, first click
     "Get Interactions".
 4.  In the table that appears, click "Add" buttons to add individual
     interactions, or click "Add all".

You can also use EsyN to:

Visualize interactions for a user-defined list of genes. To do this,
visit <http://www.esyn.org/builder.php?type=Graph>, click on the "Network from
list" option in the left-hand panel, and follow the instructions in the
pop-up.

Build your own network -- either an Interactome graph or a Petri net --
from scratch (see the tutorial at <http://www.esyn.org/tutorial.html>).
In both cases you can use the Advanced Tools to retrieve the
interactions for a number of model organisms from several databases (see
<http://www.esyn.org/builder.php?type=Graph#interactions>).

Save and share your networks. By logging in via the "My esyN" link (at
the top of every esyN page), any user can save, share privately with
collaborators, or publish any network.

Browse, view and modify, previously published, models (both graphs and
Petri nets) at <http://www.esyn.org/browse.php>. We describe these
networks are "public" in the sense of the open source movement, so that
they are not only free to be copied, modified and (when possible)
re-published, but we also actively encourage any collaborative effort to
build and improve these biological networks.

^1^esyN reference: Bean DM, Heimbach J, Ficorella L,
Micklem G, Oliver SG, Favrin G. 2014. esyN: network building, sharing
and publishing. *PLoS One*. 2014 Sep 2; **9(9)**:e106035. doi:
[10.1371/journal.pone.0106035](http://dx.doi.org/10.1371/journal.pone.0106035).
eCollection 2014.
[PMID:25181461](http://www.ncbi.nlm.nih.gov/pubmed/?term=25181461) 

