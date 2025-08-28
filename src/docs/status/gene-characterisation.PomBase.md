### Protein-coding gene characterisation status

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
{{getPredefinedQueryCount('canned_query:coding_genes_with_mf_annotation') | async}}
of the
{{getPredefinedQueryCount('canned_query:coding_genes_with_bp_annotation') | async}}
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

#### Related gene lists

<table>
<thead>
  <tr>
    <th>List</th>
    <th>Description</th>
  </tr>
</thead>
<tr>
  <td style="white-space: nowrap;"><a (click)="gotoPredefinedResults('canned_query:protein_coding_genes_unknown_process')">
Unknown genes ({{getPredefinedQueryCount('canned_query:protein_coding_genes_unknown_process') | async}})
  </a>
  </td>
  <td>Protein coding genes, unknown process</td>
</tr>
<tr>
  <td style="white-space: nowrap;"><a (click)="gotoPredefinedResults('priority-unstudied-genes:conserved_unknown')">
Conserved unknown ({{getPredefinedQueryCount('priority-unstudied-genes:conserved_unknown') | async}})
  </a>
  </td>
  <td>
    Genes of unknown process, conserved outside the Schizosaccharomyces clade
  </td>
</tr>
<tr>
  <td style="white-space: nowrap;"><a (click)="gotoPredefinedResults('priority-unstudied-genes:conserved_unknown_AND_conserved_in_vertebrates')">
Priority unstudied genes ({{getPredefinedQueryCount('priority-unstudied-genes:conserved_unknown_AND_conserved_in_vertebrates') | async}})
  </a>
  </td>
  <td>
    Priority unknowns are the subset conserved to vertebrates (all
    present in human), considered over at least ~1 billion years of
    evolution. Some of these are universally conserved in bacteria and
    archaea
  </td>
</tr>
<tr>
  <td style="white-space: nowrap;">[Missing activities ({{getMissingActivityCount() | async}})](/gocam/missing-activities)</td>
  <td>
    A list of activities known or suspected to occur in fission
    yeast but not yet associated with a gene product. These "pathway
    holes" have been identified through GO-CAM causal model curation.
  </td>
</tr>
</table>

#### Changes over time

[![Gene characterisation status](assets/gene_characterisation_status_figure.svg){.screenshot width=40em;}](assets/gene_characterisation_status_figure.svg)

#### Current status

<app-characterisation-status-table></app-characterisation-status-table>


#### Protein-coding gene characterisation status descriptions

**Biological role published:** Completely or partially characterised
in a small scale experiment, with some published information about the
biological role (corresponding to any of the [fission yeast GO
biological process slim](browse-curation/fission-yeast-bp-go-slim-terms) terms)

**Biological role inferred:** A biological role (as above, a [fission
yeast GO Process slim](browse-curation/fission-yeast-bp-go-slim-terms) term) is
inferred from homology to an experimentally characterised gene product

**Conserved protein (unknown biological role):** Conserved outside the <i>Schizosaccharomyces</i>,
but nothing known about the biological role in any organism

**<i>Schizosaccharomyces</i> specific protein, uncharacterized:**
Unpublished and found only in fission yeast (<i>S. pombe</i>, <i>S. octosporus</i>,
<i>S. japonicus</i>, <i>S. cryophilus</i>); nothing known about biological role.
May be single copy or a member of a multi-member family.

**<i>S. pombe</i> specific protein, uncharacterized:** Unpublished and
found only in <i>S. pombe</i> (not detected in other <i>Schizosaccharomyces</i>
species); nothing known about biological role

**Dubious:** Unlikely to be protein coding

**Transposon:** A predicted or experimentally verified transposable element.

Note: You can retrieve current lists of genes with each
characterisation status using the [advanced search](/query). Select
the Characterisation status query, then choose a status from the
pulldown menu, and submit.
