---
name: Browser data hosting
about: Data to collect for browser dataset hosting
title: ''
labels: genome browser
assignees: PCarme

---

| Column   | Contents                                                                                     |           | Example                                                                                 | Mandatory? | Multiple entries allowed? |
|----------|---------------------------------------------------------------------------------------------|-----------|-----------------------------------------------------------------------------------------|------------|---------------------------|
| 1 (A)    | Data type                                                                                   |           | Transcripts, Chromatin binding, Nucleosome positioning, Poly(A) sites, Replication origins | Yes        | No                        |
| 2 (B)    | Track label                                                                                 |           | See below for format and examples***                                                   | Yes        | No                        |
| 3 (C)    | Assayed gene product                                                                        |           | Fkh2                                                                                    | No (only for chromatin binding data) | No |
| 4 (D)    | Strain background                                                                           |           | h- cdc25-22, leu1-1                                                                     | Yes        | Yes                       |
| 5 (E)    | WT or mutant (strains with only background mutations are considered WT)                     |           | WT                                                                                      | Yes        | No                        |
| 6 (F)    | Mutant alleles                                                                              |           | clr4delta, dfp1-3A                                                                      | No         | Yes                       |
| 7 (G)    | Conditions                                                                                  |           | YES, high temperature; glucose MM, standard temperature + HU                            | No         | No                        |
| 8 (H)    | Comment                                                                                     |           | Free-text field for additional information                                              | No         | Yes                       |
| 9 (I)    | Growth phase or response                                                                    |           | Vegetative growth, meiosis, quiescence, glucose starvation, oxidative stress, heat shock | Yes        | Yes (if the track combines data) |
| 10 (J)   | Strand                                                                                      |           | Forward, reverse                                                                        | No         | No                        |
| 11 (K)   | Assay type                                                                                  |           | Tiling microarray, RNA-seq, HT sequencing                                               | Yes        | No                        |
| 12 (L)   | First author (surname)                                                                      |           | Soriano                                                                                | Yes        | No                        |
| 13 (M)   | Publication year                                                                            |           | 2020                                                                                    | Yes        | No                        |
| 14 (N)   | PubMed ID                                                                                   |           | 31077324                                                                                | Yes        | No                        |
| 15 (O)   | Database                                                                                    |           | GEO, ArrayExpress                                                                      | No (required for data in public repositories) | No |
| 16 (P)   | Study ID                                                                                    |           | GSE110976, PRJEB7403                                                                   | No (required if Database has an entry) | No |
| 17 (Q)   | Sample ID                                                                                   |           | GSM3019628, ERS555567                                                                  | No         | Yes                       |
| 18 (R)   | Data file type                                                                              |           | bigwig, bed                                                                            | Yes        | No                        |
| 19 (S)   | File name                                                                                   |           | Name given to submitted data file relevant to the track                                 | Yes        | No                        |
