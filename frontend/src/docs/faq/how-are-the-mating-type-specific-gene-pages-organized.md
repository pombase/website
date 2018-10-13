# How are the mating type specific gene pages organized?
<!-- pombase_categories: Gene page, Finding data -->

As described in detail in this [online tutorial](https://www1.bio.ku.dk/english/research/fg/cellecyklus_genomintegritet/mating/) (external link) provided by the Nielsen lab, *S. pombe* switch between the two mating types M and P.

Genetic information encoded by the mat1 locus determines the mating type: if this locus contains the Pc and Pi genes, the cell is mating type P, and if it contains the Mc and Mi genes the cell is mating type M. Additionally, *S. pombe* contains two silent loci: mat2 and mat3. These loci are not expressed but host the information needed for each mating type configuration. Mat2 contains the two genes Pc and Pi, and Mat3 contains the two genes Mc and Mi. Recombinational DNA repair during mitotic cell division ensures production of one daughter cell of parental mating type and one daughter of the opposite mating type.

A wild type S. pombe cell thus contains 6 mating type specific genes:
 1. mat1-P/Mc - expressed
 2. mat1-P/Mi - expressed
 3. mat2-Pc - silent
 4. mat2-Pi - silent
 5. mat3-Mc - silent
 6. mat3-Mi - silent

The sequenced *S. pombe* reference strain (972 h-) is in the M mating type configuration (encodes the Mc and Mi genes at the mat1 locus). The mat2 genes are deleted in this strain for technical reasons, whereas the mat3 genes are intact. 

The DNA seqence of the WT [silent mating type region](https://www.pombase.org/status/mating-type-region) containing the mat2 and mat3 genes was reconstructed yielding an extra [mating type region contig](ftp://ftp.pombase.org/pombe/genome_sequence_and_features/genome_sequence/), the genes contained within this contig are represented in PomBase. This has the consequence that there are two copies of the silent M genes. The systematic IDs and contig source of the mating type specific genes are:
 1. mat1-Mc - SPBC23G7.09 (from the chromosome 2 contig)
 2. mat1-Mi - SPBC23G7.17c (from the chromosome 2 contig)
 3. mat2-Pc - SPMTR.01 (from the mating type contig)
 4. mat2-Pi - SPMTR.02 (from the mating type contig)
 5. mat3-Mc - SPBC1711.02 (from the chromosome 2 contig)
 6. mat3-Mi - SPBC1711.01c (from the chromosome 2 contig)
 7. mat3-Mc - SPMTR.04 (extra copy from the mating type contig)
 8. mat3-Mi - SPMTR.03 (extra copy from the mating type contig)

For the M specific genes, functional annotation (GO, phenotypes...) is attached to the mat1-Mc and mat1-Mi genes.
For the P specific genes, functional annotation is attached to mat2-Pc and mat2-Pi out of necessity (mat1-Pc and mat1-Pi does not exist in the database). 



