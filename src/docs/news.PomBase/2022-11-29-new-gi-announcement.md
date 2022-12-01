### Genetic Interaction annotation model updated
<!-- pombase_flags: frontpage -->
<!-- newsfeed_thumbnail: pombase-logo-32x32px.png -->

We have recently implemented an improved way to **annotate and display genetic interactions so they are linked to phenotype annotations and alleles**.

Previously, our Genetic Interaction annotations only mentioned the interacting genes and the type of genetic interaction. For example, if a strain with genotype `asp1-H397A` has the phenotype `decreased acid phosphatase activity affecting activity of pho1`, but this phenotype is suppressed when `rhn1` is deleted in that strain, we would annotate that the genes `asp1` and `rhn1` are part of a `Phenotypic Suppression` interaction.

![During filter](assets/newsfeed/gi-update-1.png){ width=100% }

We continue to display  interactions in this format by default (showing only genes and interaction type), but if you expand the annotation, you can view the associated genotypes and phenotypes.

![During filter](assets/newsfeed/gi-update-2.png){ width=100% }

In the revised Canto interface, you can only annotate a genetic interaction from the double mutant phenotype annotation (by clicking on `add..`, as shown below).

![During filter](assets/newsfeed/gi-update-3.png){ width=100% }

Of course, genetic interactions predating this update are not linked to phenotypes or genotypes, but we are hoping to auto-annotate several of those. We will also prioritise for update any interactions where community curators have provided these details in an annotation comment.
Finally, **a big shoutout to Ana Sanchez and Angad Garg from the Shuman lab**, for testing the new interface in numerous recently curated publications. The examples provided here are from
 [Sanchez et al. 2019](/reference/PMID:31276588). Go read it and see the annotations in PomBase.

Best,
The PomBase team
