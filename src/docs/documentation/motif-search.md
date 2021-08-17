## Peptide motif search

The peptide motif search finds short peptide sequence matches in the
predicted amino acid sequences of *${species_abbrev}* proteins.

Type or paste a motif using the single-letter amino acid code. As you
type, matches will appear. The results table shows each matching
sequence in the context of a longer stretch of the protein
sequence. The list of genes with one or more matches can be sent to
the advanced search.

The search can also use wildcards, codes for groups of amino acids
(e.g. any charged amino acid), and syntax to specify motifs at the
beginning or end of a protein:

Sequence | will find 
---------|----------
CADR | any protein containing CADR
CA[DE]R | any protein containing CADR or CAER
CA[DE]+LQ | CA(any sequence of D and E)LQ
CA...R | CA(any three amino acids)R
CA.+R | CA(one or more amino acids)R
SPR.|SP.R | SPRX or SPXR
^ME | proteins beginning with ME
LAA$ | proteins terminating LAA
^.{{ \"{1,20}MCA\" }} | proteins with MCA in the first 20 amino acids

Amino acid group codes

AA group | Code | Amino acids
---------|------|------------
acidic | 0 | DE
alcohol | 1 | ST
aliphatic | 2 | AGILV
aromatic | 3 | FHWY
basic | 4 | KRH
charged | 5 | DEHKR
hydrophobic | 6 | AVILMFYW
hydrophilic | 7 | KRHDENQ
polar | 8 | CDEHKNQRST
small | 9 | ACDGNPSTV
tiny | B | AGS
turnlike | Z | ACDEGHKNQRST 

Examples:

- CA6AC will find CALAC and CAFAC
- CA0+LQ will find CA(any sequence of D or E)LQ
