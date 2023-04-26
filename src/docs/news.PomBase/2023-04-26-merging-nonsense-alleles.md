#### Curation update - "nonsense mutation" merged into "partial amino acid deletion"

<!-- pombase_flags: frontpage -->

We have decided to merge the allele type "nonsense mutation" into "partial amino acid deletion". This has mainly been driven by the fact that allele types that combine different variants require new types, such as "amino_acid_deletion_and_mutation", "amino_acid_insertion_and_deletion", etc. Otherwise, we would have ended up with many more types, and at the gene product level (which is what we describe in PomBase in phenotype interactions), both truncations are equivalent. In the next update, this allele type will not be available in Canto.

In any case, even if two alleles produce the same truncation, such as ase1-D13* or ase1Δ(13-731), they would still have separate entries in PomBase, and they may have different phenotypes. We are only assigning them the same allele type.

If for your analysis you need to make a distinction between the two using our allele dataset [allele dataset](/downloads/phenotype-annotations), you can always check the "Allele description" field for the presence of the "*" character to tell whether an allele includes a nonsense mutation.
