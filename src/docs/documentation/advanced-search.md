## Advanced search

**Note: This documentation is still a work in progress. Please contact
  the [helpdesk](mailto:${helpdesk_address}) if you have any
  questions.**

The ${database_name} advanced search allows you to construct complex queries
for *${species_abbrev}* genes. At present all advanced search results are lists
of genes that match the query specifications. Hints for specific
searches are available in the [${database_name} FAQ](/faq), and linked
below (scroll down to Search tips).

### Overview

In the Search menu, choose Advanced (or bookmark [${base_url}/query](/query)).

In the Query panel (top), click one of the links in the list on the left to choose a query type (described below). Arrowheads indicate list entries that expand to offer two or more query types, organized in tabs. For each query, the interface guides your input.

![advanced search page with new query](assets/advanced_search_main.png){ .screenshot width="682"}

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

![advanced search Boolean operator buttons](assets/advanced_search_combination.png){ .screenshot width="500"}

Results are added to the history list:

![advanced search query history list](assets/advanced_search_combination_result.png){ .screenshot width="600"}

Queries using the NOT operator default place the more
recently run query first (newer NOT/Subtract older):

![advanced search page NOT operator dialog](assets/advanced_search_not_direction.png){ .screenshot width="300"}

Click "Change direction" to switch the order. Click "Submit" to run
the query.

You can also move any query to the top of the history list by clicking
its "Results" link, and then clicking the "<- Advanced search" button.

Query results can remain available in the history list for several
days. If changes in annotation cause results to change since a query
was last run, an additional "Previous" column will be displayed in the
history list, showing the out-of-date result count:

![advanced search page with out-of-date query](assets/advanced_search_out-of-date_result.png){ .screenshot width="600"}

Click on the "Results" link to re-run the query and retrieve the
up-to-date result.

If the parameters for a query are not all visible in the history, a
"[details]" toggle (1) to show or hide additional details will
appear. You can also edit the name that appears in the history list
(2). The name will be used as part of the description when the query
is used in any combined query (which can, in turn, be given a new
name).

![advanced search query name and details](assets/query_name_details.png){ .screenshot width="600"}



### Query results page

Clicking on any up-to-date count in the "Results" column goes to a
page that shows the count, query details, and a list of matching
genes.

![advanced search results page](assets/advanced_search_results.png){ .screenshot width="400"}

1. Return to the main Advanced search page (you can also use the
browser "back" button)

2. Click on a header to sort by the column

3. Select columns to display. A set of gene expression data sets are
hidden by default; click "Show gene expression columns" to reveal the
additional options.

%%if db=PomBase
4. Select from the pulldown to send the gene list to
[QuiLT](documentation/quick-little-tool) for visualisation, or, for
lists of up to 150 genes, see the genes highlighted in [violin
plots](https://en.wikipedia.org/wiki/Violin_plot) of quantitative
expression datasets. (At present data from [Marguerat S *et
al.* (2012)](https://www.pombase.org/reference/PMID:23101633) and
[Carpy A *et al.* (2014)](https://www.pombase.org/reference/PMID:24763107) 
are included.)
%%end db=PomBase

%%if db=JaponicusDB
4. Click to send the gene list to
[QuiLT](documentation/quick-little-tool) for visualisation.
%%end db=JaponicusDB

5. Show [GO slim](documentation/pombase-go-slim-documentation)
annotations for genes in the list. Click "Slim with" to reveal a
dropdown, and choose a slim. Note: when you return to the main
Advanced search page, the query history will include an entry showing
the query as a gene list. This is harmless.

6. Narrow the list: click the button to reveal checkboxes. Available
for lists of up to 1000 genes.

7. Download selected data for genes in the list. The popup offers
three sets of options:
    - The default "Tab delimited" view offers a set of details that
      can be included in a downloaded text file. Click "Show gene
      expression columns" to reveal additional options.
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

Note: Only terms that are used in annotations (direct or inferred by
transitivity) will appear as autocomplete suggestions. This is to
avoid having irrelevant terms, such as "chloroplast" or "echolocation"
appearing. Any term without annotations can be found by searching by
its ID, and will appear in the query history with "0" results.

#### Commonly used queries

This item offers convenient links to perform frequently used queries
easily. Click on the query description to add the results to the query
history.

Please contact the [helpdesk](mailto:${helpdesk_address}) if you
would like any queries added to the selection.

#### Gene names and IDs

Type or paste a list of gene names or systematic IDs (or a mixture),
or click the "Browse" button to select a file to upload. Click
"Lookup" to add the gene list to the history (useful for combining the
list with other queries).

#### UniProt accessions

Links to the [Identifier Mapper](/identifier-mapper).

#### GO

The Gene Ontology (GO) query retrieves gene products annotated to a GO
term and to any of its child terms, following the *is_a*, *part_of*,
*regulates*, *positively_regulates*,and *negatively_regulates*
relationships in the ontology. You may also find it helpful to search
or browse in [QuickGO](http://www.ebi.ac.uk/QuickGO/) or
[AmiGO](http://amigo.geneontology.org/) to find GO terms of
interest. If one search does not seem to retrieve as many results as
you expect, try again using a less specific term.
%%if db=PomBase
Note: prior to the November 2014 PomBase release, the *regulates*
relations were not followed, and PomBase GO search results therefore
did not match those in AmiGO.
%%end db=PomBase


#### Phenotype

The phenotype (Fission Yeast Phenotype Ontology) query retrieves genes
annotated to a FYPO term and to any of its child terms, following the
*is_a*, *part_of*, *output_of*, *has_output*, and *has_part*
relationships in the ontology. This query also offers additional
context-dependent options. By default, the phenotype search retrieves
genes from single-allele haploid and diploid genotypes annotated to
the searched FYPO term:

![phenotype default search options](assets/fypo_default_search_options.png){ .screenshot width="651"}

You can alter the selected options to add genes from multi-allele
genotypes, and/or to search specifically for haploids or diploids.
See the [gene page phenotype
documentation](documentation/gene-page-phenotypes) and the [genotype
page documentation](documentation/genotype-page) for more information.

If you select single-locus haploids, expression level options are also
available:

![phenotype search options for single-locus haploids](assets/fypo_haploid_search_options.png){ .screenshot width="651"}

Different alleles of one gene may have different phenotypes, and one
allele may give rise to different phenotypes under different
experimental conditions. At present, you can retrieve annotations for
all alleles of a gene, or use the "Expression level" options restrict
the query to null alleles (covers deletions and any other sequence
changes, such as most disruptions, that completely abolish expression
of the gene) or overexpression of the wild type allele.

##### Constraining by conditions

![phenotype condition search option](assets/fypo_condition_query.png){ .screenshot width="588"}

The "Constrain condition" option restricts the results to include only
genes that have phenotype annotations including the specified
condition. The search uses the same condition descriptors as Canto and
the ${database_name} web pages. Start typing, then choose from the
autocomplete options.

Note that the results will include any gene with phenotype annotations
for the phenotype of interest, including the specified condition, *for any
allele*. Queries that include conditions can be combined using the
AND, NOT, or OR operators like any other, but the result of any
combination of phenotype queries will likely include annotations for
different alleles. There may not be any individual annotation in which
both/all of multiple conditions co-occur.

Use case: Query FYPO phenotype (FYPO:0000001) (i.e. any phenotype) and condition + phloxine B" \
to retrieve all genes with a phenotype assay using phloxine B as a condition.

Use case: Query FYPO inviable vegetative cell population(FYPO:0002061) + high temperature (FYECO:0000004) \
to retrieve all genes inviable at high temperature (the subtract all
"viable vegetative cell population/FYPO:0002060 standard temperature
(FYECO:0000005). If you want to restrict this output to likely
temperature-sensitive alleles you could make a new query for all
"viable vegetative cell population" (FYPO:0002060) standard
temperature (FYECO:0000005), and subtract this query from the previous
query.

Note that for many sensitivity phenotypes, you do not need to constrain
on condition, because the terms are precomposed i.e. `FYPO:0000089`
"sensitive to methyl methanesulfonate".  In these cases the condition
may not always be explicitly curated.

##### Excluded conditions

![phenotype exclude_condition option](assets/fypo_exclude_constraint.png){ .screenshot width="588"}

The “Exclude condition” option excludes from the results any
annotations to the phenotype term of interest that include the
specified condition (note: annotations to the same gene with a
different condition, or no condition specified, will retained in the
gene result list).  This means, for example, if
you exclude "high temperature" for a specific phenotype, the gene will
remain in your output list if it has another annotation to the same
term without a recorded condition, or "standard temperature".  To find
a condition, start typing, then choose from the autocomplete options.

Warning: Condition constraint and exclusion should be used with
caution, and will be more successful for non-standard conditions like
"high temperature" and "low temperature" "low glucose" because
standard conditions and media are not always explicitly recorded.

%%if db=PomBase
#### Disease

Search the Monarch Disease Ontology to find *S. pombe* genes whose human
orthologs have been implicated in disease. Start typing 'disease' or
the name of a specific disease, and choose from the autocomplete
options. To retrieve all disease-associated genes, type or paste
"MONDO:0000001".
%%end db=PomBase

#### Product type

Choose a gene product type (e.g. protein coding, tRNA, etc.) from the
pulldown menu.

#### Protein modification

Search for terms or IDs in the [PSI-MOD](http://obofoundry.org/ontology/mod.html)
ontology.

#### Domain, features and motifs

Queries for proteins that have a specified domain, sequence feature,
or structural feature

##### Domain ID

Search for a protein domain using an ID from Pfam, PRINTs, PROFILE,
ProSite, or InterPro. Type or paste an accession and click "Submit".

##### Protein motifs

This query searches for terms or IDs in the
[Sequence Ontology](http://sequenceontology.org/)
and retrieves protein-coding genes where the protein has the feature
represented by the SO term (e.g. [KEN box SO:0001807](/term/SO:0001807)).

##### TM domains

Find protein-coding genes with products that have a specified number
of transmembrane domains. Use the appropriate button for any TM
domains or none, or enter the desired minimum and maximum number and
click "Search".

##### Coiled-coil regions

Find protein-coding genes with products that have a specified number
of coiled-coil regions. Use the appropriate button for any coiled-coil
regions or none, or enter the desired minimum and maximum number and
click "Search".

##### Disordered regions

Find protein-coding genes with products that have a specified number
of disordered regions. Use the appropriate button for any disordered
regions or none, or enter the desired minimum and maximum number and
click "Search".

##### Low-complexity regions

Find protein-coding genes with products that have a specified number
of low-complexity regions. Use the appropriate button for any
low-complexity regions or none, or enter the desired minimum and
maximum number and click "Search".

#### Protein properties

Physical properties of protein gene products:

##### Protein length

Find protein-coding genes with products in a specified length
range. Enter the desired minimum and maximum length and click
"Search".

##### Protein mol. weight

Find protein-coding genes with products in a specified mass
range. Enter the desired minimum and maximum mass in kiloDaltons (kDa)
and click "Search".

#### Genome location

Find genes in a specified region of a chromosome. Select a chromosome
from the pulldown, and click "Search" to retrieve all genes on the
chromosome. Or click the radio button to switch to "Genes overlapping
range", and enter start and end coordinates in the boxes to retrieve
only genes in the specified region. Note that genes that partly
overlap the entered coordinates will be included.

#### Number of exons

Find genes with a specified number of coding exons in the primary
transcript (note: at present this query does not consider any
annotated alternative transcripts). Enter the desired minimum and
maximum number and click "Search".

#### Number of transcripts

Find genes with a specified number of annotated transcript isoforms;
Enter the desired minimum and maximum number and click “Search”.
(Note: alternative transcripts are only explicitly annotated if
functional differences between isoforms are identified- see the
browser datasets for the full extent of known transcript variation)

%%if db=JaponicusDB
#### Protein with orthologs
Choose a species from the pulldown menu to retrieve all *S. japonicus*
genes with a curated ortholog in the selected species.
%%end db=JaponicusDB

%%if db=PomBase
#### Orthologs and conservation

##### Taxonomic conservation

Choose one of the descriptions from the pulldown menu. See the [gene
page documentation](documentation/taxonomic-conservation) for more
information.

##### Protein with orthologs

Choose a species from the pulldown menu to retrieve all *S. pombe*
genes with a curated ortholog in the selected species.

#### Characterisation status

Choose one of the descriptions from the pulldown menu. See the [gene
characterisation page](status/protein-status-tracker) for more
information.
%%end db=PomBase

### Search tips
[FAQ](/faq) entries relevant to using the advanced search are
organised here by topic. Several of the topics also correspond to gene
page sections.

#### Phenotype searches

%%if db=PomBase
 -  [Can I get a list of essential ${species} genes?](/faq/can-i-get-list-essential-pombe-genes)
%%end db=PomBase
 -  [How can I find all of the genes that have a given mutant phenotype?](/faq/how-can-i-find-all-genes-have-given-mutant-phenotype)
 -  [Why are some genes annotated to both viable and inviable phenotypes?](/faq/why-are-some-genes-annotated-both-viable-and-inviable-phenotypes)
 -  [How can I browse the phenotype ontology (FYPO)?](/faq/how-can-i-browse-phenotype-ontology-fypo)

#### Gene Ontology searches

 -  [How can I search or browse GO annotations?](/faq/how-can-i-search-or-browse-go-annotations)
 -  [How can I find genes with a specific activity?](/faq/how-can-i-find-genes-specific-activity)
 -  [How can I find protein localization data?](/faq/how-can-i-find-protein-localization-data)
 -  [How can I identify all of the genes that affect a process?](/faq/how-can-i-identify-all-genes-affect-process) (also relevant to phenotype searches)
 -  [Can I retrieve functional annotations for genes in a list?](/faq/can-i-retrieve-functional-annotations-genes-list)
%%if db=PomBase
 -  [How can I find transcription factors and their targets in ${database_name}?](/faq/how-can-i-find-transcription-factors-and-their-targets-pombase)
%%end db=PomBase

#### Protein searches

 -  [How can I find modifications for my protein of interest?](/faq/how-can-i-find-modifications-my-protein-interest)
%%if db=PomBase
 -  [How can I find all S. ${species} proteins in a particular protein family?](/faq/how-can-i-find-all-s.-pombe-proteins-particular-protein-family-or-have-particular-domain)
%%end db=PomBase
 -  [How can I find proteins that have transmembrane domains?](/faq/how-can-i-find-proteins-have-transmembrane-domains)

%%if db=PomBase
#### Taxonomic conservation

 -  [How can I find S. ${species} genes associated with human disease?](/faq/how-can-i-find-s.-pombe-genes-associated-human-disease)
 -  [How can I find all S. ${species} genes that are conserved in human?](/faq/how-can-i-find-all-s.-pombe-genes-are-conserved-human)
 -  [Can I search for genes based on conservation in different taxa?](/faq/can-i-search-genes-based-on-conservation-different-taxa)
 -  [Can I find all of the unconserved (orphan) genes in fission yeast?](/faq/can-i-find-all-unconserved-orphan-genes-fission-yeast)
%%end db=PomBase

#### Gene and genome searches

 -  [How can I retrieve all S. ${species} genes?](/faq/how-can-i-retrieve-all-s.-${species}-genes)
 -  [How can I retrieve all S. ${species} protein-coding genes?](/faq/how-can-i-retrieve-all-s.-${species}-protein-coding-genes)
 -  [Can I provide a list of genes to search on?](/faq/can-i-provide-list-genes-search-on)
 -  [Can I search for a gene list and retrieve results in the same order as in the input list?](/faq/can-i-search-gene-list-and-retrieve-results-same-order-as-input-list) (answer: no)
 -  [How can I find snoRNA genes?](/faq/how-can-i-find-snorna-genes)
 -  [How can I find transposons in the S. ${species} genome?](/faq/how-can-i-find-transposons-genome)
 -  [How can I find genes in a region using chromosome coordinates?](/faq/how-can-i-find-genes-region-using-chromosome-coordinates)
 -  [How can I retrieve intron coordinates or sequences?](/faq/how-can-i-retrieve-intron-coordinates-or-sequences)
 -  [How can I find all sequence features in a region using chromosome coordinates?](/faq/how-can-i-find-all-sequence-features-region-using-chromosome-coordinates)
 -  [How can I find genes in a region using chromosome coordinates?](/faq/how-can-i-find-genes-region-using-chromosome-coordinates)
