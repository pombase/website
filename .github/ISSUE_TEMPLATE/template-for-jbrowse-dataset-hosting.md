---
name: Template for JBrowse dataset hosting
about: Pre-filled table for Genome Browser dataset configuration in JBrowse
title: JBrowse dataset [First author, Year of publication, Type of data, PMID]
labels: genome browser
assignees: ''

---

| Column content | Type of Data (**Mandatory**) | Track label (**Mandatory**) | Assayed gene product (optional, only required for chromatin binding data)| Strain background (**Mandatory**) | WT or mutant (**Mandatory**) | Mutant allele (optional, 'not applicable' if WT) | Conditions (optional) | Comment (optional) | Growth phase (**Mandatory**) | Strand (Optional) | Assay type (**Mandatory**) | Surname of first author (**Mandatory**) | Publication year (**Mandatory**) | PubMed ID (**Mandatory**) | Database (optional, if dataset publicly available) | Database ID of the study (optional, required if Database has a value) | Database Sample ID (optional) | File type (**Mandatory**) | File name (**Mandatory**) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Examples | Transcripts, Nucleosome binding, Poly(A) sites... | Transcripts in atf1delta (forward strand) - Soriano et al. (2013) | Fkh2 | h- cdc25-22, leu1-1 | WT / mutant | clr4delta, dfp1-3A | YES, high temperature; glucose MM, standard temperature + HU... | free-text field for additional information | vegetative growth, meiosis, quiescence... | forward / reverse | 	tiling microarray, RNA-seq, HT sequencing... | Soriano | 2013 | 31077324 | GEO, ArrayExpress | GSE110976, PRJEB7403 | GSM3019628, ERS555567 | bigwig, bed, rnaseq... | name given to submitted data file relevant to the track |
| Values |     |     |     |     |     |     |     |      |     |     |     |     |     |     |     |     |     |     |     |
