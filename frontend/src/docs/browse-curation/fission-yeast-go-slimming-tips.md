# PomBase GO Slim Usage Tips

=== General GO Slim hints ===

These points will help you understand GO slims, and highlight some
features of the fission yeast slim terms and annotations.

1.  Note that the counts in the "Genes" column of the GO slim table are
    not additive, because many gene products are annotated to multiple
    terms.
2.  It not possible to create a slim with no overlaps between terms.
    Although the *S. pombe* slim has been defined to include biologically
    informative terms, and minimise overlaps between terms, large
    overlaps cannot be entirely avoided. For example, most of the gene
    products annotated to *signal transduction* are also annotated other
    terms in the slim.
3.  As a consequence of points 1 and 2, GO slim annotation summaries
    should not be presented using pie charts. Although a pie chart could
    show the fraction of total annotations for any slim term, it can too
    easily be mistaken for the fraction of total annotated gene products,
    which is not the same.
4.  It is difficult to define a slim which includes all annotated gene
    products without including terms with very small numbers of
    annotations (for example, the cell aging branch has very few
    annotations), or very high level terms which are not particularly
    biologically informative (e.g. cellular process). Because we have
    opted not to include such terms, some gene products are annotated to
    process terms but do not appear in the slim annotation set.
5.  Bear in mind that both proteins and RNAs can be annotated to GO
    terms. If you are working only with proteins you will need to make
    adjustments for this. For example, many tRNAs and rRNAs are
    annotated to cytoplasmic translation, and are therefore included in
    the slim set.
6.  There is a difference between "unknown" and "unannotated". All
    fission yeast and budding yeast gene products have been assessed and
    are classed as "unknown" for biological process if no biological
    process information is found (experimental or inferred). If you are
    making comparisons with other organisms, remember that it is
    possible that not all gene products have been assessed and that the
    "unknown" set is underestimated.
7.  The default S. pombe slim includes all evidence codes for fission
    yeast. The evidence code **IEA** (inferred from electronic
    annotation) is often considered to be less accurate than other
    evidence codes, but it is very useful for increasing the coverage of
    some of the high level GO terms. Accurate annotation counts for some
    terms currently depends on including this evidence code (for
    example, there are 26 gene products annotated to transmembrane
    transport with IEA evidence, which are not yet covered by a manual
    annotation). For fission yeast, the IEA annotations improve slim
    coverage, but only represent a small number of annotations (654
    biological process annotations as of September 2011), and have a low
    rate of false positives. We therefore recommend that you include
    them.
8.  If you are making comparisons with budding yeast (or other
    organisms), you should consider excluding the evidence code **RCA**.
    This evidence code is used for functional predictions, and has a
    very high rate of false positives (for example, including RCA for
    budding yeast hugely will greatly and artificially inflate the
    number of annotations to translation).

=== Creating a user-defined slim ===

1.  You can create your own slim, or retrieve slim annotations for a
    gene set, using online slimming tools such as the
    [GOTermMapper](http://go.princeton.edu/cgi-bin/GOTermMapper) at
    Princeton.
2.  When creating a slim for the entire genome, you should try to ensure
    that it covers as many annotated genes in your set as possible (see
    \#3 in list above). You should be aware of how many genes are
    annotated but not in your slim, and how many are "unknown" (i.e.,
    annotated only to the root node; see \#5 in list above).
3.  For display purposes you usually want to keep the number of terms as
    small as possible to convey your results. However, you should ensure
    that the terms you include are specific enough to capture
    biologically relevant information. Many terms (e.g. metabolic
    process (2915 annotations), cellular process (4083 annotations)) are
    too general for the purpose of most slim-based analyses.
4.  On a related note, if you are using your slim for data analysis
    (e.g. to summarize an enrichment), you should ensure that the terms
    are specific enough to demonstrate their relevance to the biological
    topic of interest. For example, lumping all genes involved in
    transport my mask overrepresentation of transmembrane transport vs.
    underrepresentation of vesicle-mediated transport in your results
    set, so you need to ensure that the slim has categories to represent
    your results effectively.
5.  Most current implementations of software to create "GO slims"
    include the *regulates* relationship by default, so that (for
    example) genes involved in *regulation of cytokinesis* will be
    included with the set of genes annotated to *cytokinesis*. See the
    [GO Ontology Relations
    documentation](http://www.geneontology.org/GO.ontology.relations.shtml)
    for further information about relationships in GO. The annotation
    totals presented for the [PomBase default S. pombe slim](browse-curation/fission-yeast-go-slim-terms), by contrast,
    are calculated both explicitly including or excluding the genes
    which are involved in a process via regulation only. We expect this
    distinction to be available in future versions of slimming software.
