## Genetic and physical interactions

The Interactions section of a gene page displays genetic and physical
interactions for a gene (or its product), in
[BioGRID](http://thebiogrid.org/) format. All interactions are curated
manually by ${database_name} or BioGRID curators.

Each table has five columns:

The first column (with no header) describes the interaction. The text
reflects the type of evidence listed in the Evidence column and, where
applicable, the directionality of the interaction.

**Interacting gene:** The gene that interacts with the gene of
interest, linked to its gene page

**Interacting product:** The description of the interacting gene's
product, from its gene page

**Evidence:** The type of genetic interaction observed, or the type of
experiment performed to detect a physical interaction. The evidence
categories come from BioGRID, and are described on their [Experimental
Evidence Codes](http://wiki.thebiogrid.org/doku.php/experimental_systems)
documentation page.

**Reference:** The paper cited to support the interaction

### Additional fields for Genetic Interactions

Since November 2022, new or updated Genetic Interaction annotations are linked to phenotype annotations and alleles. We continue to display interactions in the old format by default (showing only genes and interaction type), but if you expand the annotation, you can view the associated genotypes and phenotypes.

![During filter](assets/newsfeed/gi-update-2.png){ .screenshot width=95%}

### More on Genetic Interactions

The definitions of all genetic interactions can be found in [the BioGRID wiki](https://wiki.thebiogrid.org/doku.php/experimental_systems#genetic_interactions). **It is worth reading these definitions, as the language often used in publications does not match the naming of genetic interactions**. For example, in publications we can find "double deletion of gene X and Y rescues the defects cellular morphology caused by deletion of gene Y". However, for BioGRID this is a phenotypic suppression not a rescue, since rescue is reserved for lethality or growth defect. The genetic interactions that are used in low throughput curation in PomBase are:

* **Dosage Growth Defect**: Overexpression/increased dosage of one gene causes a growth defect in a strain that is mutated/deleted for another.
* **Dosage Lethality**: Overexpression/increased dosage of one gene causes lethality in a strain that is mutated/deleted for another gene.
* **Dosage Rescue**: Overexpression/increased dosage of one gene rescues the lethality or growth defect of a strain mutated/deleted for another gene.
* **Phenotypic Enhancement**: Mutation/deletion/overexpression of one genes results in enhancement of any phenotype (other than lethality/growth defect) associated with mutation/deletion/overexpression of another gene.
* **Phenotypic Suppression**: Mutation/deletion/overexpression of one gene results in suppression of any phenotype (other than lethality/growth defect) associated with mutation/deletion/overexpression of another gene.
* **Synthetic Growth Defect**:  Mutations/deletions in separate genes, each of which alone causes a minimal phenotype, but when combined in the same cell results in a significant growth defect under a given condition.
* **Synthetic Lethality**: Mutations/deletions in separate genes, each of which alone causes a minimal phenotype, but when combined in the same cell results in lethality under a given condition.
* **Synthetic Rescue**: Mutation/deletion of one gene rescues the lethality or growth defect of a strain mutated/deleted for another gene.

In addition, we curate the following types of genetic interaction not covered by BioGrid.

* **Synthetic Phenotype**: Mutation/deletion/overexpression in separate genes produces a phenotype that is not present in either of the single mutations/deletions/overexpressions under a given condition.

 When exporting the data to BioGrid, "Synthetic Phenotype" genetic interactions are exported as "Phenotypic Enhancement", see [this GitHub issue](https://github.com/pombase/curation/issues/3295) for details.

Below is a decision making tree to determine the type of genetic interaction from the phenotypes of the single and double mutant. "Interacting allele" refers to the allele that is not present in the single mutant:

![Decision making for genetic interactions](assets/gi_constrains_website.svg){ .screenshot width="75%"}

<!-- Mermaid code for this graph. The svg can be generated in the website https://mermaid-js.github.io/mermaid-live-editor/

You have to go to "Config" and change the theme to "light".

```mermaid
flowchart TD;
    A[Is the double<br>mutant lethal?<br>];
    A ==>|Yes| C{{The single allele <br> must be viable}};
    C ==> C2[Is the interacting<br>allele overexpressed?];
    C2 ==>|Yes| C2.1((Dosage<br>Lethality));
    C2 ==>|No| C2.2((Synthetic<br>Lethality));
    A ==>|No| D[Is the single<br>mutant lethal?];
    D ==>|Yes| E{{The double mutant <br> must be viable.}};
    E ==> E2[Is the interacting<br>allele overexpressed?];
    E2 ==>|Yes| E2.1((Dosage<br>Rescue));
    E2 ==>|No| E2.2((Synthetic<br>Rescue));
    D ==>|No| G[Is one of the<br>phenotypes a cell<br> population growth<br>phenotype?];
    G ==>|Yes| H{{The other phenotype<br> should be a population <br> growth phenotype too}};
    H ==>H2[Is the interacting<br>allele overexpressed?];
    H2 ==>|Yes| H2.1[Double mutant is <br>worse than single?];
        H2.1 ==>|Yes| H2.1.1((Dosage<br>Growth<br>Defect));
        H2.1 ==>|No| H2.1.2((Dosage<br>Rescue));
    H2 ==>|No| H2.2[Double mutant is <br>worse than single?];
        H2.2 ==>|Yes| H2.2.1((Synthetic<br>Growth<br>Defect));
        H2.2 ==>|No| H2.2.2((Synthetic<br>Rescue));
    G ==>|No| GG[Do any of the<br> single alleles<br>have the phenotype?]
    GG ==>|Yes| I[Double mutant is <br>worse than single?];
    I ==>|Yes| J((Phenotypic<br>Enhancement));
    I ==>|No| K((Phenotypic<br>Suppression));
    GG ==>|No| L((Synthetic<br>Phenotype))
``` -->
