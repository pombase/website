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

Below is a decision making tree to determine the type of genetic interaction from the phenotypes of the single and double mutant. "Interacting allele" refers to the allele that is not present in the single mutant:

![Decision making for genetic interactions](assets/gi_constrains_website.svg){width="75%"}
