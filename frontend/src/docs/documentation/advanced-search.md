## Advanced search

**Note: This documentation is still a work in progress. Please contact
  the [helpdesk](mailto:helpdesk@pombase.org) if you have any
  questions.**

The PomBase advanced search allows you to construct complex queries
for *S. pombe* genes. At present all advanced search results are lists
of genes that match the query specifications. Hints for specific
searches are available in the [PomBase FAQ](/faq), and linked
[below](#search-tips).

### Overview

In the Search menu, choose Advanced (or bookmark http://www.pombase.org/query).

In the Query panel (top), click one of the links in the list on the left to choose a [query type](query-types).  For each query, the interface guides your input.

![advanced search page with new query](assets/advanced_search_main.png){width="600"}

In the History panel (bottom), results are linked in the Count column,
and you can select queries in the list to combine or delete them. To
combine queries, you must select two or more from the list, anh then
click one of the operator buttons. Results are added to the history
list.

### Query types

Ontology queries (GO, phenotype, protein modification, and protein
sequence feature) retrieve genes that are annotated to the selected
term(s), and to their descendants via specified relations (see the GO
documentation on 
[Ontology Structure and Ontology Relations](http://geneontology.org/page/ontology-relations)
for more information on relationships between terms in ontologies, and
see the descriptions below of specific ontology filters for lists of
which relations are followed to retrieve annotations). Ontologies can
be searched by ID or term name. Type or paste a complete ontology ID,
including the prefix (e.g. GO:0005634, FYPO:0002059), or simply start
typing to search for a term name. Choose a term from the list of
options offered by the autocomplete, and click "Submit".

#### GO

The Gene Ontology (GO) query retrieves gene products annotated to a GO
term and to any of its child terms, following the *is_a*, *part_of*,
*regulates*, *positively_regulates*,and *negatively_regulates*
relationships in the ontology. You may also find it helpful to search
or browse in [QuickGO](http://www.ebi.ac.uk/QuickGO/) or
[AmiGO])http://amigo.geneontology.org/) to find GO terms of
interest. If one search does not seem to retrieve as many results as
you expect, try again using a less specific term. Note: prior to the
November 2014 PomBase release, the regulates relations were not
followed, and PomBase GO search results therefore did not match those
in AmiGO.

#### Phenotype

The phenotype (Fission Yeast Phenotype Ontology) query retrieves genes
annotated to a FYPO term and to any of its child terms, following the
*is_a*, *part_of*, *output_of*, *has_output*, and *has_part*
relationships in the ontology. This query also offers two additional
sets of options:

![phenotype search options](assets/fypo_search_options.png){width="400"}

By default, the phenotype search retrieves genes from single-allele
genotypes annotated to the searched FYPO term. You can alter the
selected options to add genes from multi-allele genotypes. See the
[gene page phenotype documentation](documentation/gene-page-phenotypes)
and the [genotype page documentation[(documentation/genotype-page)
for more information.

Different alleles of one gene may have different phenotypes, and one
allele may give rise to different phenotypes under different
experimental conditions. At present, you can retrieve annotations for
all alleles of a gene, or use the "Expression level" options restrict
the query to null alleles (covers deletions and any other sequence
changes, such as most disruptions, that completely abolish expression
of the gene) or overexpression of the wild type allele.

It is not yet possible to use condition details in the search.

#### Protein modification

Search for terms or IDs in the [PSI-MOD](http://www.psidev.info/MOD)
ontology.

#### Protein domain

Search for an ID from Pfam, PRINTs, PROFILE, ProSite, or
InterPro. Type or paste an accession and click "Submit".

#### Protein feature

This query searches for terms or IDs in the 
[Sequence Ontology](http://sequenceontology.org/) 
and retrieves protein-coding genes where the protein has the feature
represented by the SO term (e.g. KEN box SO:0001807).

#### Disease

Search the internal PBO vocabulary to find *S. pombe* genes whose
human orthologs have been implicated in disease. Start typing 'disease
associated' or the name of a specific disease, and choose from the
autocomplete options.

#### Product type

Choose a gene product type (e.g. protein coding, tRNA, etc.) from the
pulldown menu.

#### Taxonomic conservation

Choose one of the descriptions from the pulldown menu. See the [gene page documentation](documentation/taxonomic-conservation) for more information.

#### Characterisation status

Choose one of the descriptions from the pulldown menu. See the [gene characterisation page](status/gene-characterisation) for more information.

#### Canned queries

This item offers convenient links to perform frequently used queries
easily. Click on the query description to add the results to the query
history.

Please contact the [helpdesk](mailto:helpdesk@pombase.org) if you
would like any queries added to the selection.

#### Protein mol. weight

Find protein-coding genes with products in a specified mass
range. Enter the desired minimum and maximum mass in kiloDaltons (kDa)
and click "Search".

#### Protein length

Find protein-coding genes with products in a specified length
range. Enter the desired minimum and maximum length and click
"Search".

#### Number of TM domains

Find protein-coding genes with products that have a specified number
of transmembrane domains. Enter the desired minimum and maximum number
and click "Search".

#### Coding exons

Find protein-coding genes with a specified number of coding
exons. Enter the desired minimum and maximum number and click
"Search".

#### Gene IDs

Type or paste a list of systematic IDs, or click the "Browse" button
to select a file to upload. Click "Lookup" to add the gene list to the
history (useful for combining the list with other queries).



### Search tips
[FAQ](/faq) entries relevant to using the advanced search are
organised here by topic. Several of the topics also correspond to gene
page sections.


