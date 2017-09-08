# Gene Page: Protein Features

Gene pages for protein-coding genes have a section describing protein
features. Also see the
[Modifications](/documentation/gene-page-modifications) documentation.

![gene page protein features](assets/gene_page_protein_features.png  "Protein features"){width="800"}

1.  The graphical view is a static graphic from the PomBase Genome
    Browser, and shows the positions of domains and other features.
    Below the graphic is a link to the Genome Browser's protein view.
2.  The table of protein families and domains is described in more
    detail below.
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

#### Protein Families and Domains ####

![gene page protein domains](assets/gene_page_protein_domains.png "Protein families and domains"){width="800"}

a.  Feature ID of this family or domain in the originating database.
    Where feasible, the ID links to the source database. Databases
    include Pfam, SMART, Prosite, Gene3D, SUPERFAMILY, TMHMM and
    Panther.
b.  Source database name
c.  Name of the matching feature in the contributing database
d.  ID of the [InterPro](http://www.ebi.ac.uk/interpro/) entry that
    includes the feature. InterPro classifies proteins into families
    using predictive models provided by several different databases that
    make up the InterPro consortium. InterPro is useful for assessing
    the species distribution of a particular family or domains.
e.  The description of the domain in InterPro, from the contributing
    database
f.  Start and end coordinates, showing the location of the feature
    within the protein
g.  Link to a list of other fission yeast proteins which are members of
    the family or have the domain
h.  Link to the InterPro entry for the feature    
i.  Link to the Pfam entry for the protein, which shows domain
    organization
i.  Transmembrane domain coordinates, where applicable

Note that some of the listed features (e.g. transmembrane domains from
TMHMM) are predictions. Consult the contributing databases for further
information, or [contact the PomBase curators](mailto:helpdesk@pombase.org) if you notice
any problems with annotated or predicted features.
