# Is there a list of protein complexes in *${species_abbrev}*, and their subunits?
<!-- pombase_categories: Finding data,Genome statistics and lists,Using ontologies -->

Yes, there is a file that lists GO macromolecular complex assignments
for fission yeast gene products in the GO annotations directory:

${base_url}/data/annotations/Gene_ontology/GO_complexes/

%%if db=PomBase
Note that the complex inventory includes the RNA subunits of
ribonucleoprotein complexes. 
%%end db=PomBase
There is some redundancy in the list, because some gene products are
annotated to both complexes and subcomplexes. For example, three *mcm*
genes are annotated to 'MCM core complex'
([GO:0097373](/term/GO:0097373)) as well as 'MCM complex'
([GO:0042555](/term/GO:0042555)). Additional notes are available in a
README file:
https://www.pombase.org/data/annotations/Gene_ontology/GO_complexes/README

Also see the [FAQ on localization](/faq/how-can-i-find-protein-localization-data).
