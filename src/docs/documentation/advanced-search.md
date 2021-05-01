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

![advanced search page with new query](assets/advanced_search_main.png){width="682"}

In the History panel (bottom), queries are listed in reverse
chronological order (most recently run first). Results are linked in
the Count column; the link goes to a page that displays the gene name,
systematic ID, and product description for matching genes. The
Download button offers additional options, including nucleotide and
(where applicable) protein sequence. To return to the search page, use
the blue "<- Advanced search" button just above the result list, **not**
your browser's "Back" button.

You can select queries in the list to combine or delete them. To
combine queries, you must select two or more from the list, and then
click one of the operator buttons:

![advanced search page with new query](assets/advanced_search_combination.png){width="400"}

Results are added to the history list:

![advanced search page with new query](assets/advanced_search_combination_result.png){width="400"}

At present, there is only an awkward kludge to specify the order for a
query using the Subtract/NOT operator. It always places the more
recently run query first (newer NOT/Subtract older), but you can move
any query to the top of the history list by clicking its "Results" link.

Query results can remain available in the history list for several
days. If changes in annotation cause results to change since a query
was last run, the entry in the history list will be labeled "out of
date":

![advanced search page with out-of-date query](assets/advanced_search_out-of-date_result.png){width="400"}

Click on the "Results" link to re-run the query and retrieve the
up-to-date result.

If the parameters for a query are not all visible in the history, a
"[details]" toggle (1) to show or hide additional details will
appear. You can also edit the name that appears in the history list
(2). The name will be used as part of the description when the query
is used in any combined query (which can, in turn, be given a new
name).

![advanced search query name and details](assets/query_name_details.png){width="400"}



### Query results page

Clicking on any up-to-date count in the "Results" column goes to a
page that shows the count, query details, and a list of matching
genes.

![advanced search results page](assets/advanced_search_results.png){width="400"}

1. Return to the main Advanced search page (you can also use the
browser "back" button)

2. Click on a header to sort by the column

3. Select columns to display

4. Select from the pulldown to send the gene list to
[QuiLT](documentation/quick-little-tool) for visualisation, or, for
lists of up to 150 genes, see the genes highlighted in [violin
plots](https://en.wikipedia.org/wiki/Violin_plot) of quantitative
expression datasets.

5. Show [GO slim](documentation/pombase-go-slim-documentation)
annotations for genes in the list. Click "Slim with" to reveal a
dropdown, and choose a slim. Note: when you return to the main
Advanced search page, the query history will include an entry showing
the query as a gene list. This is harmless.

6. Narrow the list: click the button to reveal checkboxes

7. Download selected data for genes in the list. The popup offers
three sets of options:
    - The default "Tab delimited" view offers a set of details that can
      be included in a downloaded text file.
    - Use the "Sequence" tab to retrieve amino acid or nucleotide
      sequences in FASTA format. Use the checkboxes to select which
      items are included in the headers. When "Nucleotide" is
      selected, flanking sequence options similar to those on the
      [gene page](documentation/gene-page-sequence) are available.
    - In the "GO Annotation" tab, you can choose which ontologies to
      include. Downloaded annotations are in [GAF 2.1
      format](http://geneontology.org/docs/go-annotation-file-gaf-format-2.1/). Note
      that only "direct", not inferred, annotations are included, as
      described in [this
      FAQ](/faq/why-are-go-terms-missing-downloadable-annotation-file).

#### Sharing search results

Each results page has a stable, unique URL that you can bookmark,
copy/paste, and share. Anyone who follows a shared link will see the
same results page, and the query will be added to their query history.

The "Visualise" and "Slim" options also generate stable, unique,
sharable URLs.

### Query types

Ontology queries (GO, phenotype, protein modification, and protein
sequence feature) retrieve genes that are annotated to the selected
term(s), and to their descendants via specified relations (see the GO
documentation on 
[Ontology Structure and Ontology Relations](http://geneontology.org/docs/ontology-relations/)
for more information on relationships between terms in ontologies, and
see the descriptions below of specific ontology filters for lists of
which relations are followed to retrieve annotations). Ontologies can
be searched by ID or term name. Type or paste a complete ontology ID,
including the prefix (e.g. GO:0005634, FYPO:0002059), or simply start
typing to search for a term name. Choose a term from the list of
options offered by the autocomplete, and click "Submit".

#### Commonly used queries

This item offers convenient links to perform frequently used queries
easily. Click on the query description to add the results to the query
history.

Please contact the [helpdesk](mailto:helpdesk@pombase.org) if you
would like any queries added to the selection.

#### Gene names and IDs

Type or paste a list of gene names or systematic IDs (or a mixture),
or click the "Browse" button to select a file to upload. Click
"Lookup" to add the gene list to the history (useful for combining the
list with other queries).

#### GO

The Gene Ontology (GO) query retrieves gene products annotated to a GO
term and to any of its child terms, following the *is_a*, *part_of*,
*regulates*, *positively_regulates*,and *negatively_regulates*
relationships in the ontology. You may also find it helpful to search
or browse in [QuickGO](http://www.ebi.ac.uk/QuickGO/) or
[AmiGO](http://amigo.geneontology.org/) to find GO terms of
interest. If one search does not seem to retrieve as many results as
you expect, try again using a less specific term. Note: prior to the
November 2014 PomBase release, the *regulates* relations were not
followed, and PomBase GO search results therefore did not match those
in AmiGO.

#### Phenotype

The phenotype (Fission Yeast Phenotype Ontology) query retrieves genes
annotated to a FYPO term and to any of its child terms, following the
*is_a*, *part_of*, *output_of*, *has_output*, and *has_part*
relationships in the ontology. This query also offers three additional
sets of options:

![phenotype search options](assets/fypo_search_options.png){width="651"}

**Alleles:** By default, the phenotype search retrieves genes from
single-allele genotypes annotated to the searched FYPO term. You can
alter the selected options to add genes from multi-allele
genotypes. See the [gene page phenotype
documentation](documentation/gene-page-phenotypes) and the [genotype
page documentation](documentation/genotype-page) for more information.

**Expression:** Different alleles of one gene may have different
phenotypes, and one allele may give rise to different phenotypes under
different experimental conditions. At present, you can retrieve
annotations for all alleles of a gene, or use the "Expression level"
options restrict the query to null alleles (covers deletions and any
other sequence changes, such as most disruptions, that completely
abolish expression of the gene) or overexpression of the wild type
allele.

**Conditions:** The "Constrain condition" option restricts the results
to include only genes that have phenotype annotations including the
specified condition. The search uses the same condition descriptors as
Canto and the PomBase web pages. Start typing, then choose from the
autocomplete options.

Note that the results will include any gene that has phenotype
annotations including the specified condition *for any
allele*. Queries that include conditions can be combined using the
AND, NOT, or OR operators like any other, but the result of any
combination of phenotype queries will likely include annotations for
different alleles. There may not be any individual annotation in which
both/all of multiple conditions co-occur.

The search does not yet support querying for multiple conditions on
the same annotation, nor for queries that *exclude* a given condition;
both are planned for future development.

#### Product type

Choose a gene product type (e.g. protein coding, tRNA, etc.) from the
pulldown menu.

#### Protein modification

Search for terms or IDs in the [PSI-MOD](http://obofoundry.org/ontology/mod.html)
ontology.

#### Protein domain

Search for an ID from Pfam, PRINTs, PROFILE, ProSite, or
InterPro. Type or paste an accession and click "Submit".

#### Protein feature

This query searches for terms or IDs in the
[Sequence Ontology](http://sequenceontology.org/)
and retrieves protein-coding genes where the protein has the feature
represented by the SO term (e.g. [KEN box SO:0001807](/term/SO:0001807) ).

#### Protein length

Find protein-coding genes with products in a specified length
range. Enter the desired minimum and maximum length and click
"Search".

#### Protein mol. weight

Find protein-coding genes with products in a specified mass
range. Enter the desired minimum and maximum mass in kiloDaltons (kDa)
and click "Search".

#### Disease

Search the Monarch Disease Ontology to find *S. pombe* genes whose human
orthologs have been implicated in disease. Start typing 'disease' or
the name of a specific disease, and choose from the autocomplete
options. To retrieve all disease-associated genes, type or paste
"MONDO:0000001".

#### Number of TM domains

Find protein-coding genes with products that have a specified number
of transmembrane domains. Enter the desired minimum and maximum number
and click "Search".

#### Genome location

Find genes in a specified region of a chromosome. Select a chromosome
from the pulldown, and click "Search" to retrieve all genes on the
chromosome. Optional: enter start and end coordinates in the boxes to
retrieve only genes in the indicated region.

#### Number of exons

Find genes with a specified number of coding exons in the primary
transcript (note: at present this query does not consider any
annotated alternative transcripts). Enter the desired minimum and
maximum number and click "Search".

#### Number of transcripts

Find genes with a specified number of annotated transcripts; genes
with two or more have one or more alternative transcripts in addition
to the primary transcript. Enter the desired minimum and maximum
number and click "Search".

#### Taxonomic conservation

Choose one of the descriptions from the pulldown menu. See the [gene page documentation](documentation/taxonomic-conservation) for more information.

#### Characterisation status

Choose one of the descriptions from the pulldown menu. See the [gene characterisation page](status/gene-characterisation) for more information.

### Search tips
[FAQ](/faq) entries relevant to using the advanced search are
organised here by topic. Several of the topics also correspond to gene
page sections.

#### Phenotype searches

 -  [Can I get a list of essential pombe genes?](/faq/can-i-get-list-essential-pombe-genes)
 -  [How can I find all of the genes that have a given mutant phenotype?](/faq/how-can-i-find-all-genes-have-given-mutant-phenotype)
 -  [Why are some genes annotated to both viable and inviable phenotypes?](/faq/why-are-some-genes-annotated-both-viable-and-inviable-phenotypes)
 -  [How can I browse the phenotype ontology (FYPO)?](/faq/how-can-i-browse-phenotype-ontology-fypo)

#### Gene Ontology searches

 -  [How can I search or browse GO annotations?](/faq/how-can-i-search-or-browse-go-annotations)
 -  [How can I find genes with a specific activity?](/faq/how-can-i-find-genes-specific-activity)
 -  [How can I find protein localization data?](/faq/how-can-i-find-protein-localization-data)
 -  [How can I identify all of the genes that affect a process?](/faq/how-can-i-identify-all-genes-affect-process) (also relevant to phenotype searches)
 -  [Can I retrieve functional annotations for genes in a list?](/faq/can-i-retrieve-functional-annotations-genes-list)
 -  [How can I find transcription factors and their targets in PomBase?](/faq/how-can-i-find-transcription-factors-and-their-targets-pombase)

#### Protein searches

 -  [How can I find modifications for my protein of interest?](/faq/how-can-i-find-modifications-my-protein-interest)
 -  [How can I find all S. pombe proteins in a particular protein family?](/faq/how-can-i-find-all-s.-pombe-proteins-particular-protein-family)
 -  [How can I find proteins that have transmembrane domains?](/faq/how-can-i-find-proteins-have-transmembrane-domains)

#### Taxonomic conservation

 -  [How can I find S. pombe genes associated with human disease?](/faq/how-can-i-find-s.-pombe-genes-associated-human-disease)
 -  [How can I find all S. pombe genes that are conserved in human?](/faq/how-can-i-find-all-s.-pombe-genes-are-conserved-human)
 -  [Can I search for genes based on conservation in different taxa?](/faq/can-i-search-genes-based-on-conservation-different-taxa)
 -  [Can I find all of the unconserved (orphan) genes in fission yeast?](/faq/can-i-find-all-unconserved-orphan-genes-fission-yeast)

#### Gene and genome searches

 -  [How can I retrieve all S. pombe genes?](/faq/how-can-i-retrieve-all-s.-pombe-genes)
 -  [How can I retrieve all S. pombe protein-coding genes?](/faq/how-can-i-retrieve-all-s.-pombe-protein-coding-genes)
 -  [Can I provide a list of genes to search on?](/faq/can-i-provide-list-genes-search-on)
 -  [Can I search for a gene list and retrieve results in the same order as in the input list?](/faq/can-i-search-gene-list-and-retrieve-results-same-order-as-input-list) (answer: no)
 -  [How can I find snoRNA genes?](/faq/how-can-i-find-snorna-genes)
 -  [How can I find transposons in the S. pombe genome?](/faq/how-can-i-find-transposons-s.-pombe-genome)
 -  [How can I find genes in a region using chromosome coordinates?](/faq/how-can-i-find-genes-region-using-chromosome-coordinates)
 -  [How can I retrieve intron coordinates or sequences?](/faq/how-can-i-retrieve-intron-coordinates-or-sequences)
 -  [How can I find all sequence features in a region using chromosome coordinates?](/faq/how-can-i-find-all-sequence-features-region-using-chromosome-coordinates)
 -  [How can I find genes in a region using chromosome coordinates?](/faq/how-can-i-find-genes-region-using-chromosome-coordinates)
