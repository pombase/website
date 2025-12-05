### Protein-coding gene characterisation status (known/unknown)

Unknown proteins have become an increasing concern, as rates of gene
characterisation have plateaued and a substantial proportion of
proteins remain unstudied or understudied, even in the most
intensively investigated model organisms. To monitor this issue,
PomBase maintains an inventory of unknown proteins, originally
described in [Wood *et al.* 2019](https://doi.org/10.1098/rsob.180241).

```{=html}
There are several ways to determine whether a gene is functionally
characterised, and characterisation is best considered as a
continuum. As a pragmatic first step, however, we applied a simple
binary classification of "known" versus "unknown", based on whether
the gene has a biological process annotation from the fission yeast GO
slim set (i.e., whether its broad cellular role has been defined). A
detailed justification for this process-focused approach is provided
in <a href="https://doi.org/10.1093/genetics/iyae007">Rutherford <i>et al.</i> 2024</a>.
It should be noted that
<a (click)="gotoPredefinedResults('canned_query:coding_genes_with_mf_annotation')">
{{getPredefinedQueryCount('canned_query:coding_genes_with_mf_annotation') | async}}
</a>
of the
<a (click)="gotoPredefinedResults('canned_query:coding_genes_with_bp_annotation')">
{{getPredefinedQueryCount('canned_query:coding_genes_with_bp_annotation') | async}}
</a>
proteins with a GO-slim biological process also have an assigned GO
molecular function.
<p>
```

We regularly review genes in the "unknown" category to determine
whether new functional data are available from other species. A gene
is classified as unknown when no broad biological role can be inferred
from experimental data in S. pombe or from an experimentally
characterised ortholog in any other organism. Importantly, we require
robust supporting evidence to assign a GO biological process
annotation. Finally, because every S. pombe gene has been reviewed for
GO biological process, these genes are "known unknowns" rather than
"unannotated".

#### Characterisation status history tables

[Protein-coding gene characterisation statistics history](/status/gene-characterisation-statistics-history)

#### Known/unknown protein status tracker

<app-characterisation-status-table></app-characterisation-status-table>


#### Unknown protein-related lists

<table>
<thead>
  <tr>
    <th>List</th>
    <th>Description</th>
  </tr>
</thead>
<tr>
  <td style="white-space: nowrap;"><a (click)="gotoPredefinedResults('canned_query:protein_coding_genes_unknown_process')">
Unknown role (GO-slim process) ({{getPredefinedQueryCount('canned_query:protein_coding_genes_unknown_process') | async}})
  </a>
  </td>
  <td>Equivalent to the "conserved unknown" plus "fission yeast unknown" in the tracker above</td>
</tr>
<tr>
  <td style="white-space: nowrap;"><a (click)="gotoPredefinedResults('priority-unstudied-genes:conserved_unknown')">
Unknown role, conserved ({{getPredefinedQueryCount('priority-unstudied-genes:conserved_unknown') | async}})
  </a>
  </td>
  <td>
    Proteins of unknown GO-slim Biological Process, conserved outside the <i>Schizosaccharomyces</i> clade
  </td>
</tr>
<tr>
  <td style="white-space: nowrap;"><a (click)="gotoPredefinedResults('priority-unstudied-genes:conserved_unknown_AND_conserved_in_vertebrates')">
Priority unknown role ({{getPredefinedQueryCount('priority-unstudied-genes:conserved_unknown_AND_conserved_in_vertebrates') | async}})
  </a>
  </td>
  <td>
The subset of proteins of unknown biological role
conserved to vertebrates (all present in human), conserved over at
least ~1 billion years of evolution. Some are universally conserved in
bacteria and archaea.
  </td>
</tr>
<tr>
  <td style="white-space: nowrap;"><a (click)="gotoPredefinedResults('canned_query:proteins_of_unknown_molecular_function')">
Unknown molecular function ({{getPredefinedQueryCount('canned_query:proteins_of_unknown_molecular_function') | async}})
  </a>
  </td>
  <td>
    Proteins of unknown GO Molecular Function
  </td>
</tr>
<tr>
  <td style="white-space: nowrap;"><a (click)="gotoPredefinedResults('canned_query:unknown_process_known_function')">
Unknown process, known function ({{getPredefinedQueryCount('canned_query:unknown_process_known_function') | async}})
  </a>
  </td>
  <td>
    Genes which have a known molecular function, but an unknown physiological role
  </td>
</tr>
<tr>
  <td style="white-space: nowrap;">[Missing activities ({{getMissingActivityCount() | async}})](/gocam/missing-activities)</td>
  <td>
A list of activities known or suspected to occur in fission yeast but
not yet associated with a gene product. These "pathway holes" have
been identified through GO-CAM causal model curation.
  </td>
</tr>
</table>

Note: You can also retrieve current lists of genes with each
characterisation status using the [advanced search](/query). Select
the Characterisation status query, then choose a status from the
pulldown menu, and submit.
