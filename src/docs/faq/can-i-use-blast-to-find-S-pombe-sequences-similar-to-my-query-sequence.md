# Can I use BLAST to find *${species_abbrev}* sequences similar to my query sequence?
<!-- pombase_categories: Tools and resources -->

${database_name} does not maintain a BLAST server, but the BLAST tools
available at [NCBI](https://blast.ncbi.nlm.nih.gov/Blast.cgi) and
[Ensembl](https://fungi.ensembl.org/Multi/Tools/Blast) allow a target
species genome to be selected.

Note, however, that we recommend alternate approaches for some search
purposes, especially for proteins:

 - If you have a short peptide sequence, our
   [peptide motif search](/motif_search)
   finds matches in *${species_abbrev}* proteins quickly.
 - If you are specifically looking for *${species_abbrev}* orthologs of a
   protein-coding gene, simple BLAST results can be
   misleading. Instead, you can look up manually curated orthologs in
   ${database_name} for [human](/faq/how-can-i-find-s.-${species}-ortholog-s-human-gene) and
   [budding yeast](/faq/how-can-i-search-s.-cerevisiae-ortholog-s-homolog-s-s.-${species}-gene),
   or use the methods described in the FAQ on
   [finding orthologs in other species](/faq/how-can-i-find-s.-${species}-orthologs-species-other-than-human-and-s.-cerevisiae).

Also see other FAQs in the [Orthology](/faq/orthology) category and
the [Ortholog curation](/documentation/orthologs) documentation.
