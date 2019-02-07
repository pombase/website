## Phenotype data bulk upload format

PomBase welcomes submissions of published large-scale phenotype data
sets. We have devised a tab-delimited text file format for bulk
phenotype data. A similar format is used for the downloadable file of
single-allele phenotype data (with one more column at the start of
each line to identify PomBase as the source; note that, because
Database is column 1 in the downloadable file, column numbers differ
by 1 between the download and upload formats).

Include a header line that labels the columns -- use the entry in the
Contents column below as the column header text.

Column | Contents | Example | Mandatory? | Multiple entries allowed?
-------|----------|---------|------------|--------------------------
1 | Gene systematic ID | SPBC11B10.09 | Yes | No
2 | FYPO ID | FYPO:0000001 | Yes | No
3 | Allele description | G146D | Yes | No
4 | Expression | overexpression | Yes | No
5 | Parental strain | 975 h+ | Yes | No
6 | Background strain name | SP286 | No | No
7 | Background genotype description | h+ ura4-D18 leu1-32 ade6-M210 | No | No
8 | Gene name | cdc2 | No | No
9 | Allele name | cdc2-1w | No | No
10 | Allele synonym | wee2-1 | No | Yes
11 | Allele type | amino acid mutation | Yes | No
12 | Evidence | ECO:0000336 | Yes | No
13 | Condition | at high temperature | Yes | Yes
14 | Penetrance | 85% | No | No
15 | Expressivity | medium | No | No
16 | Extension | assayed\_using(PomBase:SPBC582.03) | No | Yes
17 | Reference | PMID:23697806 | Yes | No
18 | taxon | taxon:4896 | Yes | No
19 | Date | 20120101 | Yes | No

**Notes:**

Please include all 19 columns. If you have nothing to put in one of
the non-mandatory columns, include the header and leave the column
blank in the rest of the rows.

1.  Include the systematic ID for each gene. You can look up
    systematic IDs on gene pages, or refer to the file of all gene
    names from the dataset download page.
2.  For help finding suitable ontology (FYPO) terms to describe your
    phenotypes, see the [FYPO summary page](browse-curation/fission-yeast-phenotype-ontology) and the
    [FAQ on browsing FYPO](/faq/how-can-i-browse-phenotype-ontology-fypo). If you can't
    find a term you need, email the
    [helpdesk](mailto:helpdesk@pombase.org) for assistance; we can add
    new FYPO terms as needed.
3.  The allele description specifically describes the change; see
    table below.
4.  In the Expression column, use one of these values:
    'overexpression', 'knockdown', 'endogenous', 'null', 'not
    specified'. Deletions should always have 'null' expression.
5.  The Parental strain column is for the parental strain designation,
    such as 972 h-, 975 h+, etc. This column must be filled in, but
    you can use "unknown" if you don't know the original background.
6.  Use the Strain name (background) column for a lab's in-house
    name/ID/designation for the background strain (i.e. the derivative
    of the parental strain that has selectable marker alleles
    etc.). The description in the Genotype column should match this
    background strain.
7.  The Genotype description column is for alleles in the background,
    such as selectable markers; these details are optional. To avoid
    redundancy, do not repeat the allele of interest (from column 3 or
    9) in the genotype column.
8.  Gene names are optional. If you include them, use standard names
    in column 8 (see gene pages or the file of All Gene Names from the
    dataset download page).
9.  Allele names are optional. If you include them, use column 9 for
    the preferred allele name, and put any alternative names in column
    10.
10. See note 9 above. Separate multiple entries with pipes (|).
11. Allowed allele types, example descriptions, etc. are shown in the
    table below.
12. For the Evidence column, we use a small selection from the
    [Evidence Ontology](http://www.evidenceontology.org/) (ECO). You
    are welcome to enquire with us in advance to find out which ECO
    terms/IDs fit your experiments, but we can accept files with brief
    descriptions (such as those in the Canto phenotype evidence option
    list), which curators will convert to ECO IDs.
13. Similarly, Conditions use a small ontology maintained in-house by
    PomBase curators, and we can either advise you about which
    terms/IDs to use, or convert from text to IDs when we receive your
    file. Use multiple entries in cases where more than one condition
    detail applies at the same time (e.g. high temperature, minimal
    medium). Separate multiple entries with commas (,). Use separate
    lines if a phenotype is observed under more than one set of
    conditions (e.g. high and low temperature).
14. Penetrance describes the proportion of a population that shows a
    cell-level phenotype. Use decimals, percents, or "high" (above
    80%), "medium" (20-80%), or "low" (less than 20%). We will convert
    to suitable IDs for loading. Penetrance data will be displayed as
    annotation extensions on gene pages.
15. Expressivity captures information about phenotype severity. Use
    integer + units, allowing ranges, or small CV ("high" (synonym:
    strong), "medium", or "low" (synonym: weak)). We will convert to
    suitable IDs for loading. Expressivity data will be displayed as
    annotation extensions on gene pages.
16. The Extension column can be used to record when a mutation in one
    gene affects another gene or its product. For example, if a
    mutation in gene A decreases its ability to phosphorylate protein
    B, you can use the phenotype "decreased protein kinase activity"
    and put the ID for gene B in an extension. Multiple extensions can
    be included for a phenotype annotation. Separate extensions with a
    comma (,) if they combine to form a "compound" extension (two or
    more genes assayed together), or with a pipe (|) if they are
    independent. Most phenotype extensions will be independent and
    pipe-separated.
17. The Reference column has the publication's PubMed ID (PMID).
18. The taxon will usually be 4896 (the NCBI taxon ID for
    *Schizosaccharomyces pombe*), although if you have an NCBI taxon ID
    for a specific *S. pombe* strain you are welcome to use it
19. The date is the date on which the annotations are created; you may
    use the paper publication date or the date on which you prepare
    your data file. Format: YYYYMMDD

**Details for allele types and descriptions:**

General note: Nucleotide and amino acid positions should reflect the
current sequence data in PomBase. Please refer to the [Gene Coordinate Changes](status/gene-coordinate-changes) 
page to ensure that your residue position entries are up to date.

For protein-coding genes, number nucleotide residues from 1 starting
with the A of the initiator ATG.

Allele type (col. 11) | Example allele description (col. 3) | Notes
----------------------|-------------------------------------|------
amino acid mutation | S123A | use one-letter code; if more than one change, separate with comma(s)
deletion | deletion | use this description for complete deletions
nonsense mutation | K111->stop |  
nucleotide mutation | C123A | if more than one change, separate with comma(s)
disruption | pab1::ura4+ | expression will usually, but not always, be null
other | RGTPI inserted after I254 | include a brief text description
partial amino acid deletion | 1-100 | indicate deleted residues; use comma-separated ranges for discontinuous deleted segments
partial nucleotide deletion | 500-800 | indicate deleted residues; use comma-separated ranges for discontinuous deleted segments
unknown | unknown | an allele name is required if the type and description are unknown
wild type | wild type | use with altered expression (overexpression or knockdown) for single-allele phenotypes

Please [contact the PomBase curators](mailto:helpdesk@pombase.org) if
you have any questions about what to use for Evidence, Conditions,
etc., or anything else you need to represent your data in this format.

Return to the [Fission Yeast Phenotype Ontology](browse-curation/fission-yeast-phenotype-ontology) page
