# Why are some genes annotated to both viable and inviable phenotypes?
<!-- pombase_categories: Gene Page,Using Ontologies -->

One gene can be correctly annotated to both a "viable" term and an
"inviable" term from FYPO, under certain circumstances:

-   Different alleles may have different phenotypes; e.g., a deletion
    may be inviable, but a point mutation may be fully viable or
    conditionally lethal.
-   One allele may cause death under some, but not all, conditions.
-   An allele may cause only some cells in a population to die (this
    would be annotated using an "inviable cell" term, with an extension
    to indicate incomplete penetrance ("low" or "medium"), plus an
    annotation to a "viable cell population" term).
-   Cells that can divide for a few generations but then die are
    annotated as inviable, but can acquire suppressor mutations at a
    high enough frequency for populations to appear viable.

At present, alleles cannot be queried directly in the PomBase advanced
search, but the FYPO phenotype filters do allow you to retrieve
annotations for all alleles, or to restrict to null expression
(deletions etc.) or overexpression of the wild-type allele. Comparing
results with and without the allele restrictions may help resolve
apparent discrepancies.

Note that it not yet possible to search for specific conditions, or for
penetrance, but we plan to add these features to the Advanced Search.

If, however, the allele and condition details are identical, annotation
to both viable and inviable terms is probably an error (either one of
the terms is wrong, or there are missing or incorrect details for the
alleles and/or conditions). Please let us know via the
[helpdesk](mailto:helpdesk@pombase.org)if you notice any potential
errors.\
\


