# How can I search or browse GO annotations?
<!-- pombase_categories: Finding data,Using ontologies -->

You can search for GO terms by name or ID in the ${database_name} [advanced
search](/query), and retrieve a list of all genes annotated to the
term and its descendants via the relations *is\_a*, *part\_of*,
*regulates*, *positively\_regulates,* and *negatively\_regulates*. For
example, a search for "cytokinesis" will include genes annotated to
"regulation of cytokinesis". (See the GO documentation on [Ontology Structure and
Ontology Relations](http://geneontology.org/docs/ontology-relations/)
for more information.)

*${species_abbrev}* GO annotations are also available in browsers that use the GO
repository, notably [AmiGO](http://amigo.geneontology.org/) and
[QuickGO](http://www.ebi.ac.uk/QuickGO/). Both browsers have extensive
documentation available:

-   [AmiGO Manual](http://wiki.geneontology.org/index.php/AmiGO_2_Manual:_Overview) 
-   [QuickGO Help page](http://www.ebi.ac.uk/QuickGO/help) 

Hint: to find *${species_abbrev}* annotations, use Organism:
Schizosaccharomyces pombe, Taxon: 4896 (*Schizosaccharomyces pombe*)
or Source: ${database_name}. You can download the results in GAF format.

In ${database_name}, GO term names and IDs on gene pages link to ontology term
pages for GO terms, which in turn offer links to AmiGO, QuickGO and
BioPortal.

