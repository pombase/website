## Quantitative gene expression bulk upload file format

${database_name} welcomes submissions of published large-scale gene expression
data sets. We have devised a tab-delimited text file format for bulk
data representing representing protein or RNA copy number per cell.

Note: Please use this format only for data that you want to appear in
the "Quantitative gene expression" section of ${database_name} gene pages. If
you have gene expression data that should be included as a data track
in the ${database_name} genome browser (microarray, RNASeq, etc.), please use
the [data submission form for HTP sequence-linked data](documentation/data-submission-form-for-HTP-sequence-linked-data).

Include a header line that labels the columns -- use the entry in the
Contents column below as the column header text.

Column | Contents | Example | Mandatory? | Multiple entries allowed?
-------|----------|---------|------------|--------------------------
%%if db=PomBase
1 | Gene systematic ID | SPBC11B10.09 | Yes | No
%%end db=PomBase
%%if db=JaponicusDB
1 | Gene systematic ID | SJAG_03048 | Yes | No
%%end db=JaponicusDB
2 | Gene name | cdc2 | No | No
3 | Type | protein | Yes | No
4 | Extension | during(GO:0051329) | No | No
5 | Copies per cell | 1234 | Yes | No
6 | Range | 1100-1350 | No | No
7 | Evidence | ECO:0000006 | Yes | No
8 | Scale | single_cell | Yes | No
9 | Condition | minimal medium, high temperature | Yes | Yes
10 | Reference | PMID:23101633 | Yes | No
11 | Taxon | ${ncbi_taxon_id} | Yes | No
12 | Date | 2014-05-01 | Yes | No

1.  Include the systematic ID for each gene. You can look up
    systematic IDs on gene pages, or refer to the file of all gene
    names from the dataset download page.
2.  Gene names are optional. If you include them, use standard names
    in column 2 (see gene pages or the file of all gene names from the
    dataset download page.
3.  Type: what was measured; use "RNA" or "protein"
4.  The Extension column documents circumstances under which the RNA
    or protein level is observed (or changes). Follow one of these
    patterns: "during (GO:0000084)" - when a specific biological
    process, such as a response to a stimulus, is taking place, or
    during a cell cycle phase; "in_presence_of(CHEBI:18420)" - when a
    specific chemical substance is present; "occurs_in(GO:0005634)"
    when the level is observed in part, rather than all, of a cell.
5.  Copies per cell: can be an average
6.  Range: optional; use if the experimental method yields a range of
    copies/cell
7.  For the Evidence column, we use a small selection from the
    [Evidence Ontology](http://www.evidenceontology.org/) (ECO). You
    are welcome to enquire with us in advance to find out which ECO
    terms/IDs fit your experiments, but we can accept files with brief
    descriptions, which curators will convert to ECO IDs.
8.  Scale: whether levels are determined for a single cell or a cell
    population as a whole; use "single_cell" or "population"
9.  Conditions use a small ontology maintained in-house by PomBase
    curators, and we can either advise you about which terms/IDs to
    use, or convert from text to IDs when we receive your file.
10. The Reference column has the publication's PubMed ID (PMID).
11. The taxon will usually be ${ncbi_taxon_id} (the NCBI taxon ID for
    *Schizosaccharomyces pombe*), although if you have an NCBI taxon ID
    for a specific *${species_abbrev}* strain you are welcome to use it
12. The date is the date on which the annotations are created; you may
    use the paper publication date or the date on which you prepare
    your data file. Format: YYYY-MM-DD
