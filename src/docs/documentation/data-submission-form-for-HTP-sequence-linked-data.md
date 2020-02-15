## HTP sequence-linked data submission instructions

PomBase welcomes submissions of published HTP sequence-linked data,
suitable for viewing in a genome browser. We require [JBrowse
compliant](https://www.pombase.org/faq/data-submission-and-formats)
data files and associated metadata descriptions. We have devised a
tab-delimited text file format for the metadata we need.

Include a header line that labels the columns -- use the entry in the
Contents column below as the column header text.

Column | Contents | Example | Mandatory? | Multiple entries allowed?
-------|----------|---------|------------|--------------------------
1 | Data type | Transcripts, Chromatin binding, Nucleosome positioning, Poly(A) sites, Replication origins | Yes | No
2 | Track label | see below for format and examples***  | Yes | No
3 | Assayed protein | Fkh2 | Only required for chromatin binding data, to specify the protein binding to chromatin | No
4 | Experimental background alleles | cdc25-22, leu1-1 | Yes | Yes
5 | WT or mutant (strains with only background mutations are considered WT) | WT | Yes | No
6 | Mutant alleles | clr4delta, dfp1-3A | No | Yes
7 | Mating type | h90, h+, h- | No | No
8 | Conditions | YES, high temperature; glucose MM, standard temperature + HU | No | No
9 | Comment | free-text field for additional information | No | Yes
10 | Growth phase or response | vegetative growth, meiosis,  quiescence, glucose starvation, oxidative stress, heat shock | Yes | Yes if the track combines data
11 | Strand | forward, reverse | No | No
12 | Assay type | tiling microarray, RNA-seq, HT sequencing  | Yes | No
13 | First author | Soriano | Yes | No
14 | Publication year | 2020 | Yes | No
15 | Pubmed ID | 31077324 | Yes | No
16 | Study ID | GSE110976, PRJEB7403| Yes | No
17 | Database | GEO, ArrayExpress | Yes | No
18 | Sample ID | GSM3019628, ERS555567 | No | Yes
19 | Data file type | bigwig, bed | Yes | No
20 | File name | name given to submitted data-file relevant to the track | Yes | No

**Track label format**

The track label must uniquely describe each track. For consistency in track label descriptions, please try and follow the following format as closely as possible: 

"Assayed protein" "data type" "in mutant" "during Growth phase or response" "additional experimental detail of importance (Mating type, Conditions, Experimental background alleles)" "; repeat " "(strand)" - "First author (Publication year)"

Nucleosome positioning during vegetative growth; repeat 1 - Gonzalez et al. (2016)
Poly(A) sites during meiosis (forward strand) - Schlackow et al. (2013)
Transcripts in atf1delta (forward strand) - Soriano et al. (2013)
Replication origins in cells synchronized by cdc25-ts block/release and hydroxyurea arrest - Xu et al. (2012)
Replication origins in cells synchronized by elutriation and hydroxyurea arrest - Xu et al. (2012)
Replication origins in dfp1-3A synchronized by elutriation and hydroxyurea arrest - Xu et al. (2012)
Transcription start sites during oxidative stress (reverse strand) - Thodberg et al. (2018)

**Submit**

To submit the files, or if you have any questions, please [contact the PomBase curators](mailto:helpdesk@pombase.org).
