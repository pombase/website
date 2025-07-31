# Is there a list of protein complexes in *${species_abbrev}*, and their subunits?
<!-- pombase_categories: Finding data,Genome statistics and lists,Using ontologies -->

Yes, there is a file that lists GO macromolecular complex assignments
for fission yeast gene products in the
%%if db=PomBase
[GO annotation directory](${base_url}/latest_release/macromolecular_complexes/).
%%end db=PomBase
%%if db=JaponicusDB
[GO annotation directory](${base_url}/data/annotations/Gene_ontology/GO_complexes/).
%%end db=JaponicusDB

Note:

%%if db=PomBase
 - the complex file includes both protein and RNA subunits
%%end db=PomBase
 - there is some redundancy in the list, because some gene products are
   annotated to both complexes and subcomplexes

Also see the [FAQ on localization](/faq/how-can-i-find-protein-localization-data).
