## PomBase GO-CAM pathways

GO-CAMs (Gene Ontology Causal Activity Models) are a framework
developed by the Gene Ontology (GO) project to represent complex
biological pathways in a structured, computable format.
They model how molecular activities, enabled by gene products or
complexes, are causally linked to form larger biological
processes.

<div class="docs-image-flex">
![GO-CAM model](assets/gocam-docs-example-model.png){ .screenshot .docs-left-float loading="lazy" }

<div>
Creating a comprehensive GO-CAM representation of a eukaryotic cell is
an ambitious and ongoing project.  We therefore welcome community
input to help improve, expand, or correct the current models. If you
have subject area knowledge on a specific pathway also please consider
contacting us to provide feedback on accuracy and completeness.

Example model: [fatty acid biosynthetic process (GO:0006633)](/gocam/pombase-view/docs/678073a900002931)

Visit the [GO-CAM model list](/gocam/model-list) or the
[main PomBase GO-CAM page](/gocam).

</div>
</div>

-------

### What Do GO-CAM Models Represent?

Each GO-CAM model provides a structured view of curated biological
knowledge, where: Activities (GO Molecular Functions) performed by
enablers (gene products or protein complexes) are connected causally
through
[defined relationships](https://wiki.geneontology.org/Annotation_Relations#GO-CAM:_Causal_Relations).

Activities also have curated connections to:
 - The GO biological process or pathway they are "part of".
 - The GO  cellular component where the activity "occurs in".
 - Chemical inputs and outputs (with associated locations), or target genes and complexes.

All models are manually curated, and due to the extensive GO curation
coverage at PomBase, most models use pre-existing GO annotations and
their associated evidence.

For more information on the GO-CAM concept, visit the
[Gene Ontology Consortium's GO-CAM overview](https://geneontology.org/docs/gocam-overview/).

-------

### Overview of Available GO-CAM Models and Project Scope: Intended and Completed Work

GO-CAMs, or Gene Ontology Causal Activity Models, are a framework
developed within the Gene Ontology (GO) project to represent complex
biological pathways in a structured, computable format.

-------

### Summary Map

<div class="docs-image-flex">
![Summary Map](assets/gocam-docs-summary-map.png){ .screenshot .docs-left-float loading="lazy" }

<div>
The summary map visually shows how individual GO-CAM models are
causally connected, without showing the internal structure of
particular models.

Clicking on a model's name will take you to its GO-CAM model
view. Clicking on the arrow between two models will take you to a
joined view of the models

#### The "Connected Summary Map" { .clear-float }
Displays curated causal connections between GO-CAM models (inter-model
connections)

[View the Connected Summary Map](/gocam/summary/connected)

#### The "All Models Summary Map"
Displays a connected Summary Map, but also includes the set of models
that are not yet causally linked to any other model

[View the Summary Map](/gocam/summary/all)
</div>
</div>

-------

### Mega Model

<div class="docs-image-flex">
![Mega Model](assets/gocam-docs-mega-model.png){ .screenshot .docs-left-float loading="lazy" }

<div>
Note: To reduce visual complexity, chemical inputs/outputs and target
genes are not shown initially.  They can be toggled on/off in both
Mega Models.

#### The "All Models Mega Model"
Displays all curated GO-CAM models in full detail:
 - Each model is enclosed by a boundary (by default)
 - All intra- and inter-model connections are shown
 - Unconnected models are also included

[View the All Models Mega-model](/gocam/mega-model/all).

#### The "Connected Models Mega Model" { .clear-float }
Displays only those GO-CAM models that have inter-model connections,
omitting unlinked models.

[View the Connected Models Mega-model](/gocam/mega-model/connected).

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

### Model joining activities
A curated list of models that share overlapping activities. This list
includes:
 - The specific activities used to link models
 - The joined pathways
 - Links to views of the joined pathways

[View model joining activities](/gocam/connections)
