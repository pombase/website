# How can I find S. pombe orthologs for species other than human and S. cerevisiae?
<!-- pombase_categories: Orthology,Querying/Searching,Tools and Resources -->

For orthologs that are not manually curated by PomBase, we suggest two
approaches:

**Compara**

You can search for orthologs/paralogs in Fungi, or in a pan-taxonomic
comparison (eukaryotes), using Compara in the Ensembl browser.

1.  On any gene page, go to the Orthologs section (scroll or use the
    Quick Links box).
2.  Follow the relevant link to Compara - for fungal alignments, choose
    "View orthologs in other fungal species with Compara", or for all
    eukaryotic species choose "View orthologs across taxonomic space
    using pan-species Compara".
3.  You should see a "collapsed" gene tree highlighting your fission
    yeast gene of interest. From here you can click on any node to see a
    menu of options:
    a.  Expand or collapes specific sub-nodes of the tree, or expand the
        tree fully
    b.  View the alignment in FASTA format
    c.  Launch the jalview multiple alignment viewer to see the full
        alignment and colour by residue conservation, hydrophobicity,
        etc.

To configure the protein entries visible in the alignment, select the
most "inclusive" node you require. You can reduce the number of entries
by collapsing individual sub-trees (step 4) before you generate your
alignment.

Information about how the Compara trees are generated, homology types,
and species is available from the [Ensembl comparative genomics
documentation](http://ensemblgenomes.org/info/data/comparative_genomics).

**\
**

**YOGY**

From any gene page, follow the link to YOGY under External References.

YOGY is a web-based resource for retrieving orthologous proteins from
ten eukaryotic organisms and one prokaryote: *Homo sapiens, Mus
musculus, Rattus norvegicus, Arabidopsis thaliana, Dictyostelium
discoideum, Drosophila melanogaster, Caenorhabditis elegans, Plasmodium
falciparum, Escherichia coli, Schizosaccharomyces pombe*, and
*Saccharomyces cerevisiae*. Using a gene or protein identifier from any
of these organisms as a query, this database provides comprehensive,
combined information on orthologs in other species using data from five
independent resources: KOGs, Inparanoid, Homologene, OrthoMCL

