### Phenotype annotations

[Phenotype annotations](https://www.pombase.org/data/annotations/Phenotype_annotations/phenotype_annotations.pombase.phaf.gz)
(link downloads gzipped file from ${database_name}) for alleles of
*${species_abbrev}* genes are manually curated from the literature using
Fission Yeast Phenotype Ontology (FYPO) terms. Note: this file
contains annotations for single allele phenotypes (single mutants)
only.

The file is in a version of the ${database_name} phenotype data bulk annotation
format (PHAF), detailed below. This format in nearly identical to the
one that can be used to submit phenotype annotations to ${database_name} in bulk,
as described on the [Phenotype data bulk upload format](/documentation/phenotype-data-bulk-upload-format) 
page, with the addition of the Database column. Note that, because
Database is column 1 in the downloadable file, column numbers differ
by 1 between the download and upload formats.

Propagating phenotype annotations: Note that the file contains only
direct annotations to FYPO terms. It does not include annotations that
can be inferred by propagating between terms within the ontology. To
make full use of the FYPO annotation data, we strongly recommend also
using the ontology structure and inferred annotations. Please contact
the [${database_name} helpdesk](mailto:${helpdesk_address}) if you need
assistance.

### Viability summary

A [set of "viability summary" data](https://www.pombase.org/data/annotations/Phenotype_annotations/FYPOviability.tsv)
as shown at the top of the FYPO table on each gene page, is available as
a downloadable file. The file has two columns: the gene systematic ID
and one of three values: "viable", "inviable" or "condition-dependent".

To cite the fission yeast phenotype data (complete or viability
summary), please see [Citing ${database_name}](/about/citing-${lc_database_name}).

### PHAF download format

A column marked "mandatory" will always have an entry; non-mandatory
columns may be empty.

Column | Contents | Example | Mandatory? | Multiple entries allowed?
-------|----------|---------|------------|--------------------------
1 | Database | ${database_name} | Yes | No
2 | Gene systematic ID | SPBC11B10.09 | Yes | No
3 | FYPO ID | FYPO:0000001 | Yes | No
4 | Allele description | G146D | Yes | No
5 | Expression | overexpression | Yes | No
6 | Parental strain | 975 h+ | Yes | No
7 | Background strain name | SP286 | No | No
8 | Background genotype description | h+ ura4-D18 leu1-32 ade6-M210 | No | No
9 | Gene name | cdc2 | No | No
10 | Allele name | cdc2-1w | No | No
11 | Allele synonym | wee2-1 | No | Yes
12 | Allele type | amino acid mutation | Yes | No
13 | Evidence | ECO:0000336 | Yes | No
14 | Condition | at high temperature | Yes | Yes
15 | Penetrance | 85% | No | No
16 | Severity | medium | No | No
17 | Extension | assayed\_using(PomBase:SPBC582.03) | No | Yes
18 | Reference | PMID:23697806 | Yes | No
19 | taxon | taxon:${ncbi_taxon_id} | Yes | No
20 | Date | 2012-01-01 | Yes | No
21 | Ploidy | homozygous diploid | No | No

**Notes:**

1.  The database that produced the file -- included to facilitate data
    sharing with other databases. Obviously always ${database_name} for this
    file. (Also note that PHAF files submitted for loading can omit this column.)
2.  The systematic ID for each gene.
3.  To use the FYPO IDs, see the [FYPO summary page](/browse-curation/fission-yeast-phenotype-ontology) 
    and the
    [FAQ on browsing FYPO](/faq/how-can-i-browse-phenotype-ontology-fypo).
4.  The allele description specifically describes the change; see the
    [Phenotype data bulk upload format](/documentation/phenotype-data-bulk-upload-format) 
    for details on allele types and descriptions.
5.  The Expression column contains one of these values:
    'overexpression', 'knockdown', 'endogenous', 'null', 'not
    specified'. Deletions always have 'null' expression.
6.  The Parental strain column is for the parental strain designation,
    such as 972 h-, 975 h+, etc. This column must be filled in, but
    "unknown" is allowed.
7.  The Background strain name column is used for a lab's in-house
    name/ID/designation for the background strain (i.e. the derivative
    of the parental strain that has selectable marker alleles
    etc.). The description in the Genotype column should match this
    background strain.
8.  The Background genotype description column is for alleles in the
    background, such as selectable markers; these details are
    optional. To avoid redundancy, it does not repeat the allele of
    interest (from column 4 or 10) in the genotype column.
9.  Gene names are optional for upload, but are included where available
    in the download.
10. Allele names are optional for upload, but are included where
    available in the download. Column 10 lists the preferred allele
    name, and any alternative names are in column 11.
11. See note 10 above. Multiple entries are separated with pipes (|).
12. Allowed allele types, example descriptions, etc. are shown in the
    table at the bottom of the 
    [Phenotype data bulk upload format](/documentation/phenotype-data-bulk-upload-format) 
    page.
13. For the Evidence column, we use a small selection from the [Evidence
    Ontology](http://www.evidenceontology.org/) (ECO). Please contact
    the [Helpdesk](mailto:${helpdesk_address}) if you need assistance
    using these IDs
14. Similarly, Conditions use a small ontology maintained in-house by
    ${database_name} curators, and we can help you interpret the IDs. Multiple
    entries are shown in cases where more than one condition detail
    applies at the same time (e.g. high temperature, minimal medium),
    and are separated with commas (,).
15. Penetrance describes the proportion of a population that shows a
    cell-level phenotype. Penetrance data are represented as percents or
    entries from the in-house FYPO\_EXT ontology (FYPO\_EXT:0000001 =
    high; FYPO\_EXT:0000002 = medium; FYPO\_EXT:0000003 = low;
    FYPO\_EXT:0000004 = full).
16. Severity (formerly designated "expressivity") uses
    the FYPO\_EXT ontology described in note 15.
17. The Extension column is used to record when a mutation in one gene
    affects another gene or its product. For example, if a mutation in
    gene A decreases its ability to phosphorylate protein B, the A
    allele is annotated to the phenotype "decreased protein kinase
    activity" with the ID for gene B in an extension. In the
    downloadable file, an annotation can have multiple comma-separated
    extensions if they combine to form a "compound" extension (e.g. two
    or more genes assayed together).
18. The Reference column has the publication's PubMed ID (PMID).
19. The taxon will usually be ${ncbi_taxon_id} (the NCBI taxon ID for
    *Schizosaccharomyces pombe*), although an NCBI taxon ID for a
    specific *${species_abbrev}* strain would be allowed.
20. The date is the date on which the annotations are created. Format: YYYY-MM-DD
21. PHAF format is only suitable for haploid and homozygous diploid
    phenotypes so the only possible values for this column are
    "haploid" and "homozygous diploid".
