# Can I do GO term enrichment for other Schizosaccharomyces species (e.g. S. japonicus)?
<!-- pombase_categories: Finding data,Tools and resources,Using ontologies -->

There are two possible approaches:

1. Retrieve a set of GO annotations in GAF format for *S. japonicus*,
*S. octosporus* or *S. cryophilus*, as described in the 
[relevant FAQ](/faq/how-can-i-find-go-annotations-for-other-schizosaccharomyces-species-e-g-s-japonicus).
Use the GO annotation dataset and your gene list for enrichment.

OR

2. In your gene list of interest, substitute the *Schizosaccharomyces*
species gene IDs with the IDs of orthologous *S. pombe* genes. For
ortholog IDs, see the
[FAQ on *Schizosaccharomyces* orthologs](/faq/how-can-i-find-orthologs-between-s-pombe-and-other-schizosaccharomyces-species),
and use the indicated table from Rhind *et al.* Comparative functional
genomics of the fission yeasts
([PMID:21511999](http://www.ncbi.nlm.nih.gov/pubmed?term=21511999)).

In either case, you can then proceed as described in the 
[FAQ on *S. pombe* GO enrichment](/faq/how-can-i-find-significant-shared-go-annotations-genes-list).
For the first option, use the Princeton GO Term Finder or another
enrichment tool that allows you to use your own GAF, and include the GO
Slim analysis using GO Term Mapper as recommended in the 
[FAQ on enrichment in *S. pombe*](/faq/how-can-i-find-significant-shared-go-annotations-genes-list).


