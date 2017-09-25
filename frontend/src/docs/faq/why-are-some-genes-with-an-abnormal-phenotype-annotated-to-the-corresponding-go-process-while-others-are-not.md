# Why are some genes with an abnormal phenotype annotated to the corresponding GO process while others are not?
<!-- pombase_categories: Using ontologies -->

PomBase curators use GO Biological Process annotations to indicate that
a gene product is directly involved in a process or its regulation. FYPO
annotations indicate when a mutation in a gene causes a change in a
process, but do not say whether the effect is direct or indirect.

Many mutant phenotypes reflect downstream effects of compromising an
upstream process. In these cases, we annotate the phenotypes using FYPO
terms, but do not annotate to the GO corresponding biological process
term. We use "regulation of biological process" GO terms in cases where
there is evidence for a gene playing a regulatory role in wild-type
cells, but not where defects in an upstream process affect a downstream
process (even though the latter is sometimes described as "regulating"
or "modulating" the downstream process).

For example, a defect in cellular respiration may arise from mutations
in genes directly involved in respiration, but also as a downstream
effect of mutations in genes involved in mitochondrial translation,
respiratory chain complex assembly, or ubiquinone biosynthesis.
Similarly, DNA replication defects often also lead to defects in
chromosome segregation; for the genes involved we annotate both
replication and segregation phenotypes, but only replication in GO
biological process.

The cell cycle offers an even more dramatic example of why we restrict
usage of GO annotations. Over 750 genes can be mutated to give an
elongated vegetative cell phenotype, which is traditionally interpreted
as indicating that cell cycle progression is blocked in interphase. Most
of these genes, however, are involved in transcription, translation,
transport or splicing, and cell cycle delays seen in mutants are due to
activation of cell cycle checkpoints by the abnormal processes. To
annotate all 750 genes to "regulation of mitotic cell cycle" would
obscure the genes that actually are part of the cell cycle regulatory
network, greatly reducing the usefulness and precision of GO
annotations.

Also see the [FAQ on finding genes that affect a process](/faq/how-can-i-identify-all-of-the-genes-that-affect-a-process).

