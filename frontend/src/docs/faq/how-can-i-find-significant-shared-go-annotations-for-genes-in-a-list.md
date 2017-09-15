# How can I find significant shared GO annotations for genes in a list?
<!-- pombase_categories: Tools and Resources,Using Ontologies -->

GO term enrichment identifies GO terms that are significantly
overrepresented (or underrepresented) among a set of genes.\
\
At present [PomBase]{data-scayt_word="PomBase" data-scaytid="1"}does not
have its own GO enrichment tool. We recommend using the [Generic GO Term
Finder at Princeton](http://go.princeton.edu/cgi-bin/GOTermFinder),
because it offers a simple interface and up-to-date ontology and
annotation data, including the current
[PomBase]{data-scayt_word="PomBase" data-scaytid="2"}GO annotation
dataset (you can upload your own backgound set, GO annotation file, or
both). You can also use the GO Term Finder to retrieve all annotations
for your gene list by setting the p-value to 1.

Before you perform an enrichment analysis, we recommend that you use the
accompanying "slimming" tool, [GO Term
Mapper](http://go.princeton.edu/cgi-bin/GOTermMapper), which is useful
for a broad overview of the annotation set (for more information, see
the [Fission Yeast GO slim
terms](/browse-curation/fission-yeast-go-slim-terms)page and
[FAQ](/faqs/how-can-i-use-go-slims-s-pombe)). GO Term Mapper is
especially useful if you use your own GAF for the enrichment, because it
will show:

-   IDs in your gene list that are missing from the annotation set (the
    annotations in GO Term Mapper's database or your uploaded GAF)
-   Genes in your list that have annotations but do not map to the slim
-   Genes in your list that have no annotations

A few other enrichment tools are described on the GO Consortium's [GO
Enrichment
Analysis](http://geneontology.org/page/go-enrichment-analysis)page. If
you choose one of these, we recommend that you only use an enrichment
tool that allows you to upload a background set representing the genes
used in your experiment. Even if you regard the whole genome as the
relevant background, it is important to specify the background gene set
explicitly to obtain meaningful results, especially if you have data
only for protein-coding genes. For example, annotated tRNA genes can
obscure enrichment of protein-coding genes annotated to translation.

For any GO analysis, we strongly recommend that you describe your
approach fully in methods, and include the release details (number
and/or date) for PomBase and the GO terms and annotations you use.

