### Genetic Interaction annotation model updated
<!-- pombase_flags: frontpage -->
<!-- newsfeed_thumbnail: pombase-logo-32x32px.png -->

Previously, our Genetic Interaction annotations mentioned the interacting genes and the type of genetic interaction. For example, if a strain with genotype `asp1-H397A` has the phenotype `decreased acid phosphatase activity affecting activity of pho1`, but this phenotype is suppressed if `rhn1` is deleted in that strain, we would annotate that the genes `asp1` and `rhn1` are part of a `Phenotypic Suppression` interaction.

![During filter](assets/newsfeed/gi-update-1.png)

We have recently implemented a new way to annotate genetic interactions and they are now linked to phenotype annotations, so that you can **see the phenotypes and alleles involved in an interaction**. By default interactions are shown as before (only genes and interaction type), but if you expand them, you can see the associated genotypes and phenotypes.

![During filter](assets/newsfeed/gi-update-2.png)

In the new Canto interface, you can annotate a genetic interaction from the double mutant phenotype annotation by clicking on the `add..` link shown below.

![During filter](assets/newsfeed/gi-update-3.png)

Of course, genetic interactions predating this update are not linked to phenotypes or genotypes, but we are hoping to auto-annotate several of those.

Finally, a **big shoutout to Ana Sanchez** from the Shuman lab, who has done loads of curation recently, including new type genetic interactions. The examples provided are from her paper [Sanchez et al. 2019](https://www.pombase.org/reference/PMID:31276588). Go read it and see the annotations in PomBase.

Best,
The PomBase team