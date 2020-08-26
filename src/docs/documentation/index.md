# PomBase Web Site Help & Documentation


```{=html}
<div *ngIf="!deployConfigService.productionMode()"  class="doc-search">
<div class="doc-search-title">
Search documentation, news archive and FAQ:
</div>
<app-faceted-search [scope]="'doc'"></app-faceted-search>
</div>
```

### Gene Pages ### {#DocsGenePage}

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
-   [Taxonomic conservation](documentation/taxonomic-conservation)
-   [Disease association](documentation/disease-association)
-   [Controlled curation](documentation/controlled-curation)
-   [External references](documentation/gene-page-external-references)
-   [Literature](documentation/gene-page-literature)

### Searching ### {#DocsSearch}

-   [Simple search](documentation/simple-search-documentation)
-   [Advanced search](documentation/advanced-search)
-   [Peptide motif search](documentation/motif-search)

### JBrowse Genome Browser

-   [Getting started with PomBase JBrowse](documentation/JBrowse_quick_start) - 
    an introductory guide to browser navigation, track loading,
    metadata, etc. (by Antonia Lock)
-   Also see the General entry in the JBrowse Help menu
-   See "File Formats" below to submit data

### QuiLT

-   [Documentation](documentation/quick-little-tool) for the Quick Little Tool for gene list visualisation

### Other PomBase Pages ###

-   GO Slim
    [Documentation](documentation/pombase-go-slim-documentation)
    and [Usage tips](browse-curation/fission-yeast-go-slimming-tips)
-   [Ontology term pages](documentation/ontology-term-page)
-   [Publication pages](documentation/publication-page)
-   [Genotype pages](documentation/genotype-page)
-   [Fission Yeast Phenotype Ontology (FYPO) page](browse-curation/fission-yeast-phenotype-ontology)
-   [High Confidence Physical Interaction Network (HCPIN)](documentation/high-confidence-physical-interaction-network)
-   [Data versions](about/version-history)

### How to Cite PomBase ###

-   See the [Citing PomBase](about/citing-pombase) page

### File Formats for Data Submission ###

PomBase accepts batch submissions of certain types of data that appear
on PomBase gene pages. For these data types, we use dedicated
PomBase-specific formats:

-   [Phenotypes](documentation/phenotype-data-bulk-upload-format)
-   [Modifications](documentation/modification-data-bulk-upload-format)
-   [Qualitative gene expression](documentation/qualitative-gene-expression-data-bulk-upload-format)
-   [Quantitative gene expression](documentation/quantitative-gene-expression-data-bulk-upload-format)
-   [HTP data for JBrowse tracks](documentation/data-submission-form-for-HTP-sequence-linked-data)

For data that can be connected with sequence features or coordinates,
and displayed as tracks in the genome browser, see the [data format
FAQ](faq/what-file-formats-can-i-use-submit-high-throughput-data)
and further details linked there.

### Linking to and from PomBase ###

-   Linking to PomBase: To link to any PomBase gene page, use the
    systematic ID for the gene in a URL with the syntax
    http://www.pombase.org/gene/\[systematic ID\]. For example,
    [http://www.pombase.org/gene/SPBC11B10.09](/gene/SPBC11B10.09)
    links to the gene page for [cdc2](spombe/result/SPBC11B10.09).
-   Linking from PomBase to external resources: We can provide links
    from PomBase gene pages to gene- or gene product-specific *S. pombe*
    data for any resource that uses URLs with PomBase systematic IDs .
    Please contact the PomBase Curators for more information.


### Comparative Genomics ###

We plan to add specific documentation about comparative genomics using
*S. pombe* here. In the meantime, you can look at the documentation for
[Ensembl Compara](http://www.ensembl.org/info/genome/compara/index.html).

### More information ... ###

For help with anything in PomBase not covered here, you can
[contact the curators](helpdesk@pombase.org).
