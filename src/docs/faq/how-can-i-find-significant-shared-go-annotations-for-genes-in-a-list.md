# How can I find significant shared GO annotations for genes in a list?
<!-- pombase_categories: Finding data,Tools and resources,Using ontologies -->

GO term enrichment identifies GO terms that are significantly
overrepresented (or underrepresented) among a set of genes.

At present ${database_name} does not have its own GO enrichment tool.
We recommend using the
[Generic GO Term Finder at Princeton](http://go.princeton.edu/cgi-bin/GOTermFinder),
because it offers a simple interface and up-to-date ontology and
annotation data, including the current PomBase GO annotation dataset
(you can upload your own background set, GO annotation file, or
both). The results are provided in an tabular format. You can also use
the GO Term Finder to retrieve all annotations for your gene list by
setting the p-value to 1.

Before you perform an enrichment analysis, we recommend that you do a
GO slim analysis of your gene list, for a broad overview of the
annotation set (for more information, see the
[Fission Yeast GO slim documentation](documentation/pombase-go-slim-documentation)
page and
[FAQ](faq/how-can-i-use-go-slims-s.-pombe)).
This will enable you to focus on. the most important terms in your
enrichment.

You can slim your gene lists for any GO aspect (MF, BP or CC) using the PomBase "Advanced search":

1. Upload your list
2. Click on the number of results  in column 1 to access the complete list
3. Use the "slim with" option in the menu to slim your gene set


A few other enrichment tools are described on the GO Consortium's 
[GO Enrichment Analysis](https://geneontology.github.io/docs/go-enrichment-analysis/)
page. If you choose one of these, we recommend that you only use an
enrichment tool that allows you to upload a background set
representing the genes used in your experiment. Even if you regard the
whole genome as the relevant background, it is important to specify
the background gene set explicitly to obtain meaningful results,
especially if you have data only for protein-coding genes. For
example, annotated tRNA genes can obscure enrichment of protein-coding
genes annotated to translation.

For any GO analysis, we strongly recommend that you describe your
approach fully in methods, and include the release details (number
and/or date) for PomBase and the GO terms and annotations you use.
