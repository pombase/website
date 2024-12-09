---
name: Browser data hosting
about: Data to collect for browser dataset hosting
title: ''
labels: genome browser
assignees: PCarme

---

| Column   | Contents (Example)                                                                          |           |
|----------|---------------------------------------------------------------------------------------------|-----------|
| 1 (A)    | Data type (*Mandatory*: Transcripts, Chromatin binding, Nucleosome positioning, Poly(A) sites, Replication origins) |           |
| 2 (B)    | Track label (*Mandatory*: See below for format and examples***)                             |           |
| 3 (C)    | Assayed gene product (Fkh2)                                                                 |           |
| 4 (D)    | Strain background (*Mandatory*: h- cdc25-22, leu1-1; Multiple entries allowed)              |           |
| 5 (E)    | WT or mutant (*Mandatory*: WT; strains with only background mutations are considered WT)    |           |
| 6 (F)    | Mutant alleles (clr4delta, dfp1-3A; Multiple entries allowed)                               |           |
| 7 (G)    | Conditions (YES, high temperature; glucose MM, standard temperature + HU)                   |           |
| 8 (H)    | Comment (Free-text field for additional information; Multiple entries allowed)              |           |
| 9 (I)    | Growth phase or response (*Mandatory*: Vegetative growth, meiosis, quiescence, glucose starvation, oxidative stress, heat shock; Multiple entries allowed if the track combines data) |           |
| 10 (J)   | Strand (Forward, reverse)                                                                   |           |
| 11 (K)   | Assay type (*Mandatory*: Tiling microarray, RNA-seq, HT sequencing)                         |           |
| 12 (L)   | First author (surname) (*Mandatory*: Soriano)                                               |           |
| 13 (M)   | Publication year (*Mandatory*: 2020)                                                        |           |
| 14 (N)   | PubMed ID (*Mandatory*: 31077324)                                                           |           |
| 15 (O)   | Database (GEO, ArrayExpress)                                                                |           |
| 16 (P)   | Study ID (GSE110976, PRJEB7403)                                                             |           |
| 17 (Q)   | Sample ID (GSM3019628, ERS555567; Multiple entries allowed)                                 |           |
| 18 (R)   | Data file type (*Mandatory*: bigwig, bed)                                                   |           |
| 19 (S)   | File name (*Mandatory*: Name given to submitted data file relevant to the track)            |           |

* Format for track label “Assayed gene product” “Data type” “in mutant” “during Growth phase or response” “additional experimental detail of importance (Conditions, Strain background)” “; repeat” “(strand)” “- First author (Publication year)”


 *  URL for dataset

*  Other info
