## PomBase GO-CAM pathways

GO-CAMs (Gene Ontology Causal Activity Models) are a framework
developed by the Gene Ontology (GO) project to represent complex
biological pathways in a structured, computable format.
They model how molecular activities, enabled by gene products or
complexes, are causally linked to form larger biological
processes.

<div class="docs-image-flex">
![GO-CAM pathway](assets/gocam-docs-example-model.png){ .screenshot .docs-left-float loading="lazy" }

<div>
Creating a comprehensive GO-CAM representation of a eukaryotic cell is
an ambitious and ongoing project.  We therefore welcome community
input to help improve, expand, or correct the current pathway models. If you
have subject area knowledge on a specific pathway also please consider
contacting us to provide feedback on accuracy and completeness.

Example pathway: [fatty acid biosynthetic process (GO:0006633)](/gocam/pombase-view/docs/678073a900002931)

Visit the [GO-CAM pathway list](/gocam/model-list) or the
[main PomBase GO-CAM page](/gocam).

</div>
</div>

-------

### What Do GO-CAM Pathways Represent?

Each GO-CAM pathway provides a structured view of curated biological
knowledge, where: Activities (GO Molecular Functions) performed by
enablers (gene products or protein complexes) are connected causally
through
[defined relationships](https://wiki.geneontology.org/Annotation_Relations#GO-CAM:_Causal_Relations).

Activities also have curated connections to:

 - The GO biological process or pathway they are "part of".
 - The GO cellular component where the activity "occurs in".
 - Chemical inputs and outputs (with associated locations), or target genes and complexes.

All pathway models are manually curated, and due to the extensive GO curation
coverage at PomBase, most use pre-existing GO annotations and
their associated evidence.

For more information on the GO-CAM concept, visit the
[Gene Ontology Consortium's GO-CAM overview](https://geneontology.org/docs/gocam-overview/).

-------

### Overview of Available GO-CAM Pathways and Project Scope: Intended and Completed Work

GO-CAMs, or Gene Ontology Causal Activity Models, are a framework
developed within the Gene Ontology (GO) project to represent complex
biological pathways in a structured, computable format.

-------

### Summary Map

<div class="docs-image-flex">
![Summary Map](assets/gocam-docs-summary-map.png){ .screenshot .docs-left-float loading="lazy" }

<div>
The **Summary Map** provides a high-level, visual overview of how
individual GO-CAM pathways are causally connected, without showing the
internal structure of particular pathway.

Clicking on a pathway's name will take you to its GO-CAM pathway
view. Clicking on the arrow between two pathways will take you to a
joined view of the pathways

#### The "All Pathways Summary Map"
Displays a connected Summary Map, but also includes the set of pathway
models that are not yet causally linked to any other pathway.

[View the Summary Map](/gocam/summary/all)

#### The "Connected Summary Map" { .clear-float }
Displays curated causal connections between GO-CAM pathways (inter-pathway
connections)

[View the Connected Summary Map](/gocam/summary/connected)

The maps are fully interactive:

  - Click on a box to open the corresponding GO-CAM
  - Click on a relationship arrow to explore connections between pathways
  - Zoom, drag, and rearrange nodes to explore the layout

</div>
</div>

-------

### Mega Model

<div class="docs-image-flex">
![Mega Model](assets/gocam-docs-mega-model.png){ .screenshot .docs-left-float loading="lazy" }

<div>

The **Mega Model** view displays GO-CAMs in full detail, showing all
intra- and inter-pathway connections.  Initially, chemical
inputs/outputs and target genes are hidden to reduce visual complexity
— but you can toggle them on or off as needed.

#### The "All Pathways Mega Model"
Displays all curated GO-CAM pathway models in full detail:

 - Each pathway is enclosed by a boundary (by default)
 - All intra- and inter-pathway connections are shown
 - Unconnected pathways are also included

[View the All Pathways Mega-model](/gocam/mega-model/all).

#### The "Connected Pathways Mega Model" { .clear-float }
Displays only those GO-CAM pathway models that have inter-pathway connections,
omitting unlinked pathways.

[View the Connected Pathways Mega-model](/gocam/mega-model/connected).

</div>
</div>

-------

### Notes on Model Completeness
Not all chemical intermediates are curated into models. However, for
all catalytic steps, full reaction details can be found via links on
the associated gene page, under the GO Molecular Function section (via
Rhea reaction references).  Currency metabolites (e.g., ATP, H₂O) are
excluded to simplify models.  Some known target genes are not yet
included in models.  Many inter-model connections are still being
identified.

-------

### Missing activities
We maintain a list of activities known or suspected to occur in
fission yeast that are not yet associated with any specific gene
product. These pathway gaps were identified through GO-CAM curation
and highlight areas for further research and annotation.

[Missing *S. pombe* activities](/gocam/missing-activities)

-------

### Pathway joining activities
A curated list of pathway models that share overlapping activities. This list
includes:
 - The specific activities used to link pathways
 - The joined pathways
 - Links to views of the joined pathways

[View pathway joining activities](/gocam/connections)
