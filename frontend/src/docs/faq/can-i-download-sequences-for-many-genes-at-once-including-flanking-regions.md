# Can I download sequences for many genes at once, including flanking regions? 
<!-- pombase_categories: Querying/Searching,Sequence Retrieval -->

At present, there isn't a good way to retrieve flanking sequences for
multiple genes in bulk directly from PomBase. (You can download coding
sequences via the Advanced Search, or [flanking sequences for individual
genes](/faq/how-can-i-retrieve-gene-sequence-including-upstream-and-downstream-sequences)via
the gene page Sequence section.) We hope to add a more convenient option
in the near future, but in the meantime, we recommend using the Ensembl
Genomes Biomart query:

1.  Go to <http://fungi.ensembl.org/biomart/martview/>
2.  Select the database “Ensembl Fungi Genes” from the "CHOOSE DATABASE"
    drop-down menu.
3.  Select “Schizosaccharomyces pombe genes” from the "CHOOSE DATASET"
    drop-down menu. Additional options will appear in the left-hand
    sidebar.
4.  In the left-hand menu, click on the header “Filters”.
5.  Expand the section “GENE” by clicking the + sign
6.  In the drop-down menu in the section “ID list limit” select “PomBase
    Gene ID(s)”. (This will automatically tick the "ID list limit box.)
    In the box underneath, type or paste a list of *S. pombe*gene names
    or systematic IDs.
7.  In the left-hand menu, click on the header “Attributes”.
8.  Click the “Sequences” button, and expand the “SEQUENCES” section.
9.  Click a button to select which sequences you want. In the cartoon,
    red or black highlighting indicates what each option retrieves. Key:
    |---, 5' flanking region; leftmost box, 5' UTR; inner boxes, coding
    exons; rightmost box, 3' UTR; ---|, 3' flanking region; \^, introns.
10. To include flanking regions, tick one or both of the "Upstream
    flank" and "Downstream flank" boxes, and enter the length you want.
    (Note: the "flank" options in the button selections retrieve ONLY
    flanking squence, and will only retrieve 3' or 5' in any given
    query, not both.)
11. When you have specified what you want, find the "Results" button in
    the header and click it. You will be able to view or download the
    results, or have them emailed to you.


