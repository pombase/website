# How can I find *${species_abbrev}* orthologs for species other than human and *S. cerevisiae*?
<!-- pombase_categories: Orthology,Finding data,Tools and resources -->

For orthologs that are not manually curated by ${database_name}, we suggest a few
approaches:

**DIOPT**

From any gene page, follow the link to DIOPT (in the Orthologs section
and under External References).

The [Drosophila RNAi Screening Center Integrative Ortholog Prediction Tool](http://www.flyrnai.org/diopt) 
(DIOPT) is a web-based tool that integrates several orthology
prediction tools to identify orthologous proteins for nine species
(*Caenorhabditis elegans, Danio rerio, Drosophila melanogaster, Homo
sapiens, Mus musculus, Rattus norvegicus, Saccharomyces cerevisiae,
Schizosaccharomyces pombe, and Xenopus tropicalis*).

**PANTHER**

The PANTHER (Protein ANalysis THrough Evolutionary Relationships)
Classification System classifies proteins (and their genes) according
to family and subfamily, molecular function, biological process, and
pathway.

From any gene page, follow the link to PANTHER (in the Orthologs
section and under External References). The linked page includes a
list of orthologs, and links to phylogenetic tree views that can also
display alignments. [Help](http://www.pantherdb.org/help/PANTHERhelp.jsp)
is available.


**Compara**

You can search for orthologs/paralogs in Fungi, or in a pan-taxonomic
comparison (eukaryotes), using Compara in the Ensembl browser.

1.  On any gene page, follow the link to the Ensembl genome browser
    under Orthologs or External References.

2.  Click the "Gene:" tab to show Compara links in the left-hand
    margin - for fungal alignments, choose "Fungal Compara", or for
    all eukaryotic species choose "Pan-taxonomic Compara".
3.  You should see a "collapsed" gene tree highlighting your fission
    yeast gene of interest. From here you can click on any node to see
    a menu of options:
    1.  Expand or collapes specific sub-nodes of the tree, or expand the tree fully
    2.  View the alignment in FASTA format
    3.  Launch the jalview multiple alignment viewer to see the full
        alignment and colour by residue conservation, hydrophobicity, etc.

4.  To configure the protein entries visible in the alignment, select
    the most "inclusive" node you require. You can reduce the number
    of entries by collapsing individual sub-trees before you generate
    your alignment.

Information about how the Compara trees are generated, homology types,
and species is available from the
[Ensembl comparative genomics documentation](http://ensemblgenomes.org/info/data/comparative_genomics).


**PSI-BLAST**

To search for putative orthologs not fund in DIOPT or Compara, we
recomment PSI-BLAST (Position-Specific Iterated BLAST) at
[NCBI](https://blast.ncbi.nlm.nih.gov/Blast.cgi?CMD=Web&PAGE=Proteins&PROGRAM=blastp&RUN_PSIBLAST=on)
or [EBI](https://www.ebi.ac.uk/Tools/sss/psiblast/). As described in
the [NCBI tutorial](https://www.ncbi.nlm.nih.gov/books/NBK2590/),
PSI-BLAST derives a position-specific scoring matrix (PSSM) or profile
from the multiple sequence alignment of sequences detected above a
given score threshold using protein–protein BLAST.
