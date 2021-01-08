## Annotation extension relation display

Annotation extensions are used to provide additional specificity for
annotations to GO, FYPO, and protein modification annotations. Each
extension consists of a relation and another "entity", which may be a
gene in PomBase or another database, or another ontology term. (The
[GO Consortium wiki page on annotation extensions](http://wiki.geneontology.org/index.php/Annotation_Extension)
contains useful information on relations.) Because some relations have
unwieldy names, the PomBase gene page display substitutes more
readable text.

This table shows the underlying relation name and corresponding
display text for the affected relations, and the reciprocal relation
displayed in "Target of" annotations (derived from extension data):

Relation name | Display name | Reciprocal
--------------|--------------|-----------
activated_by | activated by | N/A
coincident_with | at | N/A
during | during | N/A
exists_during | during | N/A
happens_during | during | N/A
has_regulation_target | regulates | regulated by
in_absence_of | in absence of | N/A
in_presence_of | in presence of | N/A
inhibited_by | inhibited by | N/A
not_exists_during | except during | N/A
not_happens_during | except during | N/A
occurs_at | at | N/A
occurs_in | in | N/A
required_for | required for | N/A

For some relations, the best display string depends on term and its
ancestry, as indicated in these tables:

The display for FYPO extensions indicating genes used in assays
depends on whether the phenotype is normal or abnormal:

Relation name |If descendant of | Display name | Reciprocal
--------------|-----------------|--------------|-----------
assayed_using | FYPO:0001985 abnormal phenotype | affecting | affected by mutation in
assayed_enzyme | FYPO:0001985 abnormal phenotype | affecting activity of | activity affected by mutation in
assayed_substrate | FYPO:0001985 abnormal phenotype | affecting substrate | affected by mutation in
assayed_using | FYPO:0000257 normal phenotype | affecting | N/A (normal means no effect to report in "Target of" section)
assayed_enzyme | FYPO:0000257 normal phenotype | affecting activity of | N/A (normal means no effect to report in "Target of" section)
assayed_substrate | FYPO:0000257 normal phenotype | affecting substrate | N/A (normal means no effect to report in "Target of" section)

GO annotation extensions display for part_of:

If descendant of | Display name | Reciprocal
-----------------|--------------|-----------
GO:0003674 molecular_function | involved in | N/A
GO:0008150 biological process | part of | N/A

The display for the "input" relations (has_input or has_direct_input)
follows this pattern:

If descendant of | Display name | Reciprocal
-----------------|--------------|-----------
GO:0003824 catalytic activity | has substrate | substrate of
GO:0006810 transport | transports | transported by
GO:0005215 transporter activity | transports | transported by
GO:0000976 transcription regulatory region sequence-specific DNA binding | regulates transcription of | transcription regulated by
GO:0001216 DNA-binding transcription activator activity | activates transcription of | transcription activated by
GO:0001217 DNA-binding transcription repressor activity | represses transcription of | transcription repressed by
GO:0003713 transcription coactivator activity | activates transcription of | transcription activated by
GO:0003714 transcription corepressor activity | represses transcription of | transcription repressed by
GO:0030234 enzyme regulator activity | regulates | regulated by
GO:0008047 enzyme activator activity | positively regulates | positively regulated by
GO:0004857 enzyme inhibitor activity | negatively regulates | negatively regulated by
GO:0051179 localization | localizes | localized by
GO:0005488 binding | binds | binds
(anything not listed above) | has input | input for

PomBase displays also use human-friendly names for [Protein
Ontology](https://proconsortium.org/pro.shtml) (PRO) terms used in
extensions (inculding "active form"). The display names include
modification positions denoted with these abbreviations:

Abbreviation | Meaning
-------------|--------
Ac | acetylated
Clv | cleaved (residue specification optional)
DiUbiq | diubiquitinated
GDP+ | GDP-bound
GTP+ | GTP-bound
HyperOx | hyperoxidized
InitMet- | initiator methionine removed
Ip | prenylated
Me | methylated
MonoUbiq | monoubiquitinated
Ox+ | oxidized form
Phos | phosphorylated (specified residue)
PhosRes+ | phosphorylated (unspecified residue)
PhosRes- | unphosphorylated (unspecified residue)
PolyUbiq | polyubiquitinated
Red+ | reduced form
Sumo | sumoylated
Ubiq | ubiquitinated
UnMod | unmodified (residue specification optional)
UnPhos | unmodified (residue specification optional)
UnUbiq | unubiquitinated
