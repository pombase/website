## Genotype pages

Genotype pages are analogous to gene pages, but describe the alleles 
that make up a genotype, and show phenotypes associated with the 
genotype.

![genotype page](assets/genotype_page.png){ .screenshot width="800"}

1.  The genotype name. A short and/or memorable name can be assigned,
    but otherwise the default name is constructed by concatenating the
    names of the alleles that make up the genotype.
2.  Each genotype in composed of one or more alleles. The table lists
    details for each allele of interest in the genotype. Any curated
    background details will be shown above the table of alleles.

    a.  Gene symbol, linked to its gene page
    b.  Allele symbol and description. For point mutations and partial
        deletions, the description specifies the positions, and
        indicates altered residues for point mutations.
    c.  The allele type specifies what kind of change the allele
        description represents, e.g. amino acid mutation, deletion,
        other.
    d.  The expression level indicates the amount of gene product
        present in the assayed cells, or "Not assayed or wild type" if
        the level was not directly measured.

3.  Phenotypes annotated to the genotype are displayed as described in
    the [gene page documentation](documentation/gene-page-phenotypes).
4.  For diploid genotypes, the table of details includes both alleles
    of each locus:

![diploid genotype details](assets/diploid_genotype_table.png){ .screenshot width="600"}

The Locus column contains the gene symbols, linked to its gene page, and
spans two rows, one for each allele at the locus. Allele details are
as described for haploid genotypes.
