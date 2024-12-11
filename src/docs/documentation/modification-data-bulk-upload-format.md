## Modification data bulk upload format

${database_name} welcomes submissions of published large-scale modification
data sets. We have devised a tab-delimited text file format for bulk
modification data.  To create a file in this format from Excel, use
*Save As* from the menu, then change *Save as type*: to "Text (Tab delimited) (*.txt)"

Include a header line that labels the columns -- use the entry in the
Contents column below as the column header text.

Column | Contents | Example | Value mandatory? | Multiple entries allowed?
-------|----------|---------|------------|--------------------------
%%if db=PomBase
1 | Gene systematic ID | SPBC11B10.09 | Yes | No
%%end db=PomBase
%%if db=JaponicusDB
1 | Gene systematic ID | SJAG_03048 | Yes | No
%%end db=JaponicusDB
2 | Gene name | cdc2 | No | No
3 | Ontology ID | MOD:0000001 | Yes | No
4 | Evidence | ECO:0000006 | Yes | No
5 | Residue | S72 | No | Yes
%%if db=PomBase
6 | Extension | added_by(PomBase:SPBC11B10.09) | No | Yes
%%end db=PomBase
%%if db=JaponicusDB
6 | Extension | added_by(PomBase:SJAG_03048) | No | Yes
%%end db=JaponicusDB
7 | Reference | PMID:24763107 | Yes | No
8 | Taxon | ${ncbi_taxon_id} | Yes | No
9 | Date | 2014-05-01 | Yes | No

**Notes:**

At present we accept protein modification data, using PSI-MOD IDs in
the Ontology ID column. We plan to accept RNA modification data in the
future. More information is available in the 
[gene page modifications documentation](documentation/gene-page-modifications).

Use one line per modified position.  Multiple values are allowed only
in the Residue and Extension columns (separated by commas).

For the Gene names, Residues and Extensions, the column is required
but the values are optional.

File columns:

1.  Include the systematic ID for each gene
2.  Gene names are optional
3.  For help finding suitable ontology (PSI-MOD) terms to describe
    your phenotypes, see the
    [Canto protein modification documentation](https://curation.pombase.org/pombe/docs/modification_annotation).
    If you can't find a term you need, email the
    [helpdesk](mailto:${helpdesk_address}) for assistance; we can
    advise you, and request new terms as needed.
4.  For the Evidence column, we use a small selection from the
    [Evidence Ontology](http://www.evidenceontology.org/) (ECO). You
    are welcome to enquire with us in advance to find out which ECO
    terms/IDs fit your experiments, but we can accept files with brief
    descriptions, which curators will convert to ECO IDs.
5.  The Residue column indicates the position modified. For protein
    modifications, use one-letter amino acid code. Multiple entries
    are allowed, but only for cases where two or more of the same
    modification are known to be present at the same time. Separate
    entries with commas (e.g. S72,T85). Position numbering should
    reflect the current sequence data in ${database_name}.
%%end db=PomBase
    Please refer to the
    [Gene Coordinate Changes](status/gene-coordinate-changes-protein-coding)
    page to ensure that your residue position entries are up to date.
%%if db=PomBase
    Histones
    should be represented using the unprocessed protein sequence
    coordinates, not the processed coordinates conventionally used to
    describe histones. Histone modifications will be represented on
    the gene pages as K4(K5) processed(preprocessed), but our checking
    pipeline will expect unmodified forms.
6.  See the table below for allowed annotation extensions. Multiple
    extensions can be included for a modification if they combine to
    form a "compound" extension (all parts apply together) Separate
    extensions with a comma (,)
7.  Use PubMed IDs (e.g. "PMID:1234567") in the Reference column
8.  The taxon will usually be ${ncbi_taxon_id} (the NCBI taxon ID for
    *Schizosaccharomyces pombe*), although if you have an NCBI taxon ID
    for a specific *${species_abbrev}* strain you are welcome to use it
9.  The date is the date on which the annotations are created; you may
    use the paper publication date or the date on which you prepare
    your data file. Format: YYYY-MM-DD


**Allowed annotation extensions:**

Annotation extensions can be used to provide additional information,
such as a gene whose product adds or removes a modification, a process
or cell cycle phase during which a modification is present, or
modification site occupancy (see the [gene page modifications documentation](documentation/gene-page-modifications) for more
information). Each annotation extension consists of a relation and
either an identifier or a number.

Extension relation | Meaning | Example
-------------------|---------|--------
%%if db=PomBase
added_by | identifies a gene product that adds the modification | added_by(PomBase:SPBC11B10.09)
affected_by | identifies a gene product that has some influence on the modification, but has not been conclusively shown to add or remove it | affected_by(PomBase:SPBC11B10.09)
removed_by | identifies a gene product that removes the modification | added_by(PomBase:SPAC24H6.05)
%%end db=PomBase
%%if db=JaponicusDB
added_by | identifies a gene product that adds the modification | added_by(JaponicusDB:SJAG_03048)
affected_by | identifies a gene product that has some influence on the modification, but has not been conclusively shown to add or remove it | affected_by(JaponicusDB:SJAG_03048)
removed_by | identifies a gene product that removes the modification | added_by(JaponicusDB:SJAG_04332)
%%end db=JaponicusDB
added_during | identifies a biological process or cell cycle phase during which the modification is actively added | added_by(GO:0000085)
removed_during | identifies a biological process or cell cycle phase during which the modification is removed | removed_by(GO:0000087)
present_during | identifies a biological process or cell cycle phase during which the modification is observed (note that the modification may have been added during this process -- if this is known use the added_during relation -- or during a preceding process) | present_during(GO:0000085)
absent_during | identifies a biological process or cell cycle phase during which the modification is not observed (note that the modification may have been removed during this process -- if this is known use the removed_during relation -- or during a preceding process) | absent_during(GO:0000087)
decreased_in_presence_of | use when the modification is observed at a lower level in the presence than in the absence of an extraneous substance | decreased_in_presence_of(CHEBI:84327)
increased_in_presence_of | use when the modification is observed at a higher level in the presence than in the absence of an extraneous substance | increased_in_presence_of(CHEBI:84327)
required_for | indicates that a modification is required for a GO function or process | required_for(GO:0000086)
occupancy | percent representing what proportion of copies of the protein have the modification | occupancy(51.5%)
level_fluctuates_during | identifies a biological process (e.g. the cell cycle or one or more of its phases) during which the modification site occupancy is observed to vary | level_fluctuates_during(GO:0000278)
multiplicity | number of modified sites detected within the same peptide fragment (relevant to mass spec. methods) | multiplicity(2)
in_absence_of | This relation is used to indicate attenuation of the activity of a specific gene product (either by deletion or inactivation). This extension must be used with an additional extension describing the modification | in_absence_of(PomBase:SPBC11B10.09)
decreased_during | identifies a biological process or cell cycle phase during which the modification is actively increased | decreased_during(GO:0034605)
increased_during | identifies a biological process or cell cycle phase during which the modification is actively deceased | increased_during(GO:0034605)

----------------------------

Please [contact the ${database_name} curators](mailto:${helpdesk_address}) if
you have any questions about what to use for modification IDs,
Evidence, annotation extensions, or anything else you need to
represent your data in this format.
