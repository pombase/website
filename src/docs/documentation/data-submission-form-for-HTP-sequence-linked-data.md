## HTP sequence-linked data submission instructions

${database_name} welcomes submissions of published HTP sequence-linked data,
suitable for viewing in a genome browser. We require JBrowse compliant
data files and associated metadata descriptions. Please see the [FAQ
on file formats](/faq/what-file-formats-can-i-use-submit-high-throughput-data)
for links to the file format descriptions, and other entries in the
[data submission FAQ category](${base_url}/faq/data-submission-and-formats) 
for more information.

### Data files

All features in data files need to use these chromosome IDs:

-    I
-    II
-    III
-    chr_II_telomeric_gap
-    mitochondrial
-    mating_type_region

### Metadata
    
We have devised a file format for the metadata we need, with
downloadable spreadsheet templates available in
[Excel](${base_url}/data/documents/HTP_submission_template.xlt)
and [Open Document
Format](${base_url}/data/documents/HTP_submission_template.ots)
(links may download files, depending on your browser). Letters in the
table below refer to spreadsheet columns.

If you prefer, you can prepare a file without using the
template. Create a tab-delimited text file, and include a header line
that labels the columns, using the entry in the Contents column below
as the column header text.

#### File columns

Column | Contents | Example | Mandatory? | Multiple entries allowed?
-------|----------|---------|------------|--------------------------
1 (A) | Data type | Transcripts, Chromatin binding, Nucleosome positioning, Poly(A) sites, Replication origins | Yes | No
2 (B) | Track label | see below for format and examples***  | Yes | No
3 (C) | Assayed gene product | Fkh2 | Only required for chromatin binding data, to specify the protein binding to chromatin | No
4 (D) | Strain background | h- cdc25-22, leu1-1 | Yes | Yes
5 (E) | WT or mutant (strains with only background mutations are considered WT) | WT | Yes | No
6 (F) | Mutant alleles | clr4delta, dfp1-3A | No | Yes
7 (G) | Conditions | YES, high temperature; glucose MM, standard temperature + HU | No | No 
8 (H) | Comment | free-text field for additional information | No | Yes
9 (I) | Growth phase or response | vegetative growth, meiosis,  quiescence, glucose starvation, oxidative stress, heat shock | Yes | Yes if the track combines data
10 (J) | Strand | forward, reverse | No | No
11 (K) | Assay type | tiling microarray, RNA-seq, HT sequencing  | Yes | No
12 (L) | First author (surname) | Soriano | Yes | No
13 (M) | Publication year | 2020 | Yes | No
14 (N) | PubMed ID | 31077324 | Yes | No
15 (O) | Database | GEO, ArrayExpress | Required for data available in public repository databases | No
16 (P) | Study ID | GSE110976, PRJEB7403| Required if the Database column has an entry | No
17 (Q) | Sample ID | GSM3019628, ERS555567 | No | Yes
18 (R) | Data file type | bigwig, bed | Yes | No
19 (S) | File name | name given to submitted data file relevant to the track | Yes | No 


#### Track label format

The track label must uniquely describe each track. For consistency in track label descriptions, please follow the recommended format as closely as possible: 

"Assayed gene product" "Data type" "in mutant" "during Growth phase or response" "additional experimental detail of importance (Conditions, Strain background)" "; repeat " "(strand)" "- First author (Publication year)"

Examples:

 * Nucleosome positioning during vegetative growth; repeat 1 - Gonzalez et al. (2016)
 * Poly(A) sites during meiosis (forward strand) - Schlackow et al. (2013)
 * Transcripts in atf1delta (forward strand) - Soriano et al. (2013)
 * Replication origins in cells synchronized by cdc25-ts block/release and hydroxyurea arrest - Xu et al. (2012)
 * Replication origins in cells synchronized by elutriation and hydroxyurea arrest - Xu et al. (2012)
 * Replication origins in dfp1-3A synchronized by elutriation and hydroxyurea arrest - Xu et al. (2012)
 * Transcription start sites during oxidative stress (reverse strand) - Thodberg et al. (2018)

### Submit

To submit the files, or if you have any questions, please [contact the ${database_name} curators](mailto:${helpdesk_address}).
