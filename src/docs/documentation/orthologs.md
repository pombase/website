
## Ortholog curation

The "Orthologs" section of a gene page includes two subsections. 

The first lists any orthologous genes in budding yeast (*Saccharomyces
cerevisiae*) or human (*Homo sapiens*) that have been assessed and
recorded manually, as described below, by curators. Budding yeast
entries link to the [*Saccharomyces* Genome Database](http://www.yeastgenome.org/)
(SGD), and human genes link to [HGNC](http://www.genenames.org/); the
text descriptions come from these databases. For more information,
including how to search the curated orthologs, see the FAQs on
[budding yeast](faq/how-can-i-search-s.-cerevisiae-ortholog-s-homolog-s-s.-${species}-gene)
and [human](/faq/how-can-i-find-s.-${species}-ortholog-s-human-gene)
orthologs.

The second subsection provides links to several resources that predict
orthologs in all fungi or all species (PomBase does not manually curate
orthologs in species other than budding yeast and human). For further
information, see the [FAQ on orthologs in additional
species](/faq/how-can-i-find-s.-pombe-orthologs-species-other-than-human-and-s.-cerevisiae).
(Note: these links also appear in the External references section.)

Manual ortholog prediction methods: The human and budding yeast
orthologs are manually predicted based on a variety of sources. In
some cases the consensus ortholog from the major ortholog predictors
([Compara](http://www.ensembl.org/info/docs/compara/index.html),
[Inparanoid](http://inparanoid.sbc.su.se/),
[OrthoMCL](http://www.orthomcl.org/)) is used. Many distant orthologs
have also been identified by [PSI-BLAST](https://www.ncbi.nlm.nih.gov/books/NBK2590/) matches; these alignments have been
submitted to the [Pfam](http://pfam.xfam.org/) protein family
database. Other ortholog predictions come from experimental data
demonstrating functional correspondence or involving membership of
corresponding complexes. These predictions are also aligned and
submitted to Pfam before inclusion. ${database_name}'s approach ensures that
the breadth of coverage is greater than any individual prediction
method, and includes many ortholog calls which are not detected by any
automated method.  Gradually, we will add and display supporting
references for all orthology calls.

## Paralogs

Paralogs are based on the common ancestor of fission yeast and budding
yeast (this approximates to the fungal common ancestor). Paralog
assignments are automated based on the manually curated orthoog
assignments, so that where *S. pombe* gene A is orthologous to
*S. cerevisiae* gene Y, and *S. pombe* gene B is orthologous to
*S. cerevisiae* gene Y, then gene A and gene B are paralogs. The
automated paralogs are supplemented by manually curated paralogs for
*S. pombe* specific gene family duplications or larger expansions.
