# ${database_name} Web Site Help & Documentation


```{=html}
<div *ngIf="!deployConfigService.productionMode()"  class="doc-search">
<div class="doc-search-title">
Search documentation, news archive and FAQ:
</div>
<app-faceted-search [scope]="'doc'"></app-faceted-search>
</div>
```

### Gene Pages ###

-   [Basic information](documentation/gene-page-basic-information)
-   [Gene Ontology](documentation/gene-page-gene-ontology)
-   [Phenotypes](documentation/gene-page-phenotypes)
-   [Target of](documentation/gene-page-target)
-   [Transcript](documentation/gene-page-transcript)
-   [Protein features](documentation/gene-page-protein-features)
-   [Modifications](documentation/gene-page-modifications)
-   [Gene expression](documentation/gene-page-gene-expression)
-   [Interactions](documentation/genetic-and-physical-interactions)
-   [Orthologs](documentation/orthologs) and paralogs
-   [Sequence](documentation/gene-page-sequence)
%%if db=PomBase
-   [Taxonomic conservation](documentation/taxonomic-conservation)
-   [Disease association](documentation/disease-association)
%%end db=PomBase
-   [Controlled curation](documentation/controlled-curation)
-   [External references](documentation/gene-page-external-references)
-   [Literature](documentation/gene-page-literature)

### Searching ###

-   [Simple search](documentation/simple-search-documentation)
-   [Advanced search](documentation/advanced-search)
-   [Identifier mapper](documentation/id-mapper)
-   [Peptide motif search](documentation/motif-search)

### JBrowse Genome Browser

-   [Getting started with ${database_name} JBrowse](documentation/JBrowse_quick_start) - 
    an introductory guide to browser navigation, track loading,
    metadata, etc. (by Antonia Lock)
-   Also see the General entry in the JBrowse Help menu
-   See "File Formats" below to submit data

### QuiLT

-   [Documentation](documentation/quick-little-tool) for the Quick Little Tool for gene list visualisation

### Non-gene sequence features

-   [Centromere clone information](status/centromeres)
-   [Miscellaneous sequence feature table](documentation/misc-sequence-features)

### Other ${database_name} Pages ###

-   GO Slim
    [Documentation](documentation/pombase-go-slim-documentation)
    and [Usage tips](browse-curation/fission-yeast-go-slimming-tips)
-   [Ontology term pages](documentation/ontology-term-page)
-   [Publication pages](documentation/publication-page)
-   [Genotype pages](documentation/genotype-page)
-   [Fission Yeast Phenotype Ontology (FYPO) page](browse-curation/fission-yeast-phenotype-ontology)
%%if db=PomBase
-   [High Confidence Physical Interaction Network (HCPIN)](documentation/high-confidence-physical-interaction-network)
%%end db=PomBase
-   [Data versions](about/version-history)

### How to Cite ${database_name} ###

-   See the [Citing ${database_name}](about/citing-pombase) page

### File Formats for Data Submission ###

${database_name} accepts batch submissions of certain types of data that appear
on ${database_name} gene pages. For these data types, we use dedicated
${database_name}-specific formats:

-   [Phenotypes](documentation/phenotype-data-bulk-upload-format)
-   [Modifications](documentation/modification-data-bulk-upload-format)
-   [Qualitative gene expression](documentation/qualitative-gene-expression-data-bulk-upload-format)
-   [Quantitative gene expression](documentation/quantitative-gene-expression-data-bulk-upload-format)
-   [HTP data for JBrowse tracks](documentation/data-submission-form-for-HTP-sequence-linked-data)

For data that can be connected with sequence features or coordinates,
and displayed as tracks in the genome browser, see the [data format
FAQ](faq/what-file-formats-can-i-use-submit-high-throughput-data)
and further details linked there.

### Linking to and from ${database_name} ###

-   Linking to ${database_name}: To link to any ${database_name} gene page, use the
    systematic ID for the gene in a URL with the syntax
    "${base_url}/gene/\[systematic ID\]". For example,
%%if db=PomBase
    [${base_url}/gene/SPBC11B10.09](/gene/SPBC11B10.09)
    links to the gene page for [cdc2](/gene/SPBC11B10.09).
%%end db=PomBase
%%if db=JaponicusDB
    [${base_url}/gene/SJAG_03048](/gene/SJAG_03048)
    links to the gene page for [cdc2](/gene/SJAG_03048)
%%end db=JaponicusDB

-   Linking from ${database_name} to external resources: We can provide links
    from ${database_name} gene pages to gene- or gene product-specific *${species_abbrev}*
    data for any resource that uses URLs with ${database_name} systematic IDs.
    Please contact the ${database_name} Curators for more information.


### Comparative Genomics ###

We plan to add specific documentation about comparative genomics using
*${species_abbrev}* here. In the meantime, you can look at the documentation for
[Ensembl Compara](http://www.ensembl.org/info/genome/compara/index.html).

### More information ... ###

For help with anything in ${database_name} not covered here, you can
[contact the curators](mailto:${helpdesk_address}).
