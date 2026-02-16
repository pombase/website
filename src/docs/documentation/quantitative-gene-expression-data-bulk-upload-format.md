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
2 | Gene symbol | cdc2 | No | No
3 | Type [1] | protein | Yes | No
4 | Extension [2] | during(GO:0051329) | No | No
5 | Copies per cell [3] | 1234 | Yes | No
6 | Range [3] | 1100-1350 | No | No
7 | Evidence [4] | ECO:0000006 | Yes | No
8 | Scale [5] | single_cell | Yes | No
9 | Condition [6] | minimal medium, high temperature | Yes | Yes
10 | Reference | PMID:23101633 | Yes | No
11 | Taxon [7] | ${ncbi_taxon_id} | Yes | No
12 | Date | 2014-05-01 | Yes | No

[1] - Type: what was measured; use "RNA" or "protein"

[2] - The Extension column documents circumstances under which the RNA
    or protein level is observed (or changes). Follow one of these
    patterns: 

- "during (GO_term_id)" - if the level is observed during a specific biological
  process, such as a response to a stimulus or a specific cell cycle phase.

- "in_presence_of(CHEBI_id)" - if the level is observed when a
  specific chemical substance is present.

- "in_absence_of(CHEBI_id)" - if the level is observed when a
  specific chemical substance is absent.

- "occurs_in(GO_term_id)" - if the level is observed in a
  specific part of the cell.
  
[3] - The number of copies of the molecule per cell, can be expressed
    as an average (in the "Copies per cell" column) and/or as a range 
    (in the "Range" column)
    
[4] - For the Evidence column, we use a small selection from the
    [Evidence Ontology](http://www.evidenceontology.org/) (ECO). You
    are welcome to enquire with us in advance to find out which ECO
    terms/IDs fit your experiments, but we can accept files with brief
    descriptions, which curators will convert to ECO IDs.
    
[5] - Scale: whether levels are determined in a single cell or a cell
    population-wide experiment; use "single_cell" or "population"
    
[6] - Conditions use a small ontology maintained in-house by PomBase
    curators, and we can either advise you about which terms/IDs to
    use, or convert from text to IDs when we receive your file.

[7] - The taxon will usually be ${ncbi_taxon_id} (the NCBI taxon ID for
    *Schizosaccharomyces pombe*), although if you have an NCBI taxon ID
    for a specific *${species_abbrev}* strain you are welcome to use it
