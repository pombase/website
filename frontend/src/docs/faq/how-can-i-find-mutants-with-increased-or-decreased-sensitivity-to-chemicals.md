# How can I find mutants with increased or decreased sensitivity to chemicals
<!-- pombase_categories: Finding data,Using ontologies -->

In FYPO, terms for increased chemical sensitivity are grouped under
[increased sensitivity to chemical (FYPO:0002683)](https://www.pombase.org/term/FYPO:0002683).
Similarly, decreased chemical sensitivity (increased resistance) terms
are grouped under [increased resistance to chemical (FYPO:0002682)](https://www.pombase.org/term/FYPO:0002682).

The ontology term pages for each term shows more specific terms, most
of which identify specific chemicals (e.g. [sensitive to hydroxyurea (FYPO:000088)](https://www.pombase.org/term/FYPO:0000088),
and the genotypes annotated to them.

In any phenotype annotation display (on gene pages, ontology term
pages, or publication pages), phenotype annotations can be
[filtered](/documentation/gene-page-phenotypes) to show only
"sensitive to chemical" annotations.

You can also use the advanced search Phenotype query to search for
<app-query-link [goToResults]="true" [linkText]="'FYPO:0002682'" [predefinedQueryName]="'single_allele_chemical_resistance'"></app-query-link>, <app-query-link [goToResults]="true" [linkText]="'FYPO:0002683'" [predefinedQueryName]="'single_allele_chemical_sensitivity'"></app-query-link>
or any of the more specific terms. (Links go to results lists of
single-allele genotypes annotated to each term.)
