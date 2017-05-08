# Gene page: protein features

Gene pages for protein-coding genes have a section describing protein
features. Also see the
[Modifications](/documentation/gene-page-modifications) documentation.

![gene page protein
features](/sites/pombase.org/files/images/gene_page_protein_features.png "Protein features"){width="595"
height="600"}\
\

1.  The graphical view is a static graphic from the PomBase Genome
    Browser, and shows the positions of domains and other features.
    Below the graphic is a link to the Genome Browser's protein view.
2.  The table of protein families and domains is described in more
    detail [below](/documentation/gene-page-protein-features#families).
3.  This section provides manual curation that ensures that large
    protein families (e.g. the WD family) include all known members.
    These manual annotations are provided because many families in
    protein family databases are rebuilt during the release cycle to
    include new sequences, and as a result gene products are sometimes
    lost or gained from protein families, and false negatives are
    common. This section is also used to capture published subfamily
    members which may be collected into a single family in protein
    family databases.
4.  Any motifs or features annotated using Sequence Ontology (SO) terms.
5.  Table of the protein's physical properties

**[]{#families}Protein Families and Domains**

![gene page protein
domains](/sites/pombase.org/files/images/gene_page_protein_domains.png "Protein families and domains"){width="800"
height="276"}

a.  Feature ID of this family or domain in the originating database.
    Where feasible, the ID links to the source database. Databases
    include Pfam, SMART, Prosite, Gene3D, SUPERFAMILY, TMHMM and
    Panther.
b.  Source database name
c.  ID of the [InterPro](http://www.ebi.ac.uk/interpro/) entry that
    includes the feature. InterPro classifies proteins into families
    using predictive models provided by several different databases that
    make up the InterPro consortium. InterPro is useful for assessing
    the species distribution of a particular family or domains.
d.  The description of the domain from the contributing database
e.  Start and end coordinates, showing the location of the feature
    within the protein
f.  Link to a list of other fission yeast proteins which are members of
    the family or have the domain
g.  Link to the Pfam entry for the protein, which shows domain
    organization
h.  Table of manually curated data indicating membership in a protein
    family or sub-family. Includes an ID and name for an internal
    PomBase ontology term, a reference (where available), and a link to
    other genes annotated to the same family.

Note that some of the listed features (e.g. transmembrane domains from
TMHMM) are predictions. Consult the contributing databases for further
information, or [contact the PomBase curators](/feedback) if you notice
any problems with annotated or predicted features.
