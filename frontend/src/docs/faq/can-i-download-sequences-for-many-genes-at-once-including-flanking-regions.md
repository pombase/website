# Can I download sequences for many genes at once, including flanking regions? 
<!-- pombase_categories: Finding data -->

If you only need coding sequence, introns, and/or curated UTRs, 
use the [advanced search](/query) to find the set of genes you want
(see the [documentation](/documentation/advanced-search) as needed).

Click on a count in the query history to see the results, with a
button for "Download" options including coordinates and sequence. In
the popup, click on the Sequence tab, select Nucleotide, then tick
boxes to add any of: 5' UTR, introns, 3' UTR.

At present, there isn't a good way to retrieve user-specified amounts
of flanking sequence for multiple genes in bulk directly from
PomBase. We hope to add a more convenient option in the near future,
but in the meantime, we recommend using the Ensembl Genomes Biomart
query:

1.  Go to <http://fungi.ensembl.org/biomart/martview/>
2.  Select the database "Ensembl Fungi Genes" from the "CHOOSE DATABASE"
    drop-down menu.
3.  Select "Schizosaccharomyces pombe genes" from the "CHOOSE DATASET"
    drop-down menu. Additional options will appear in the left-hand
    sidebar.
4.  In the left-hand menu, click on the header "Filters".
5.  Expand the section "GENE" by clicking the + sign
6.  In the drop-down menu in the section "Limit to genes (external
    references)" select "PomBase Gene ID(s)". (This will automatically
    tick the "Limit to genes" box.) In the box underneath, type or
    paste a list of *S. pombe* gene names or systematic IDs.
7.  In the left-hand menu, click on the header "Attributes".
8.  Click the "Sequences" button, and expand the "SEQUENCES" section.
9.  Click a button to select which sequences you want. In the cartoon,
    red or black highlighting indicates what each option retrieves. Key:
    |---, 5' flanking region; leftmost box, 5' UTR; inner boxes, coding
    exons; rightmost box, 3' UTR; ---|, 3' flanking region; ^, introns.
10. To include flanking regions, tick one or both of the "Upstream
    flank" and "Downstream flank" boxes, and enter the length you want.
    (Note: the "flank" options in the button selections retrieve ONLY
    flanking squence, and will only retrieve 3' or 5' in any given
    query, not both.)
11. When you have specified what you want, find the "Results" button in
    the header and click it. You will be able to view or download the
    results, or have them emailed to you.
