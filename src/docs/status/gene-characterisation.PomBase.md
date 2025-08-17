### Protein-coding gene characterisation status

Unknown proteins have become an area of increased
concern, following observations that gene characterization rates have
stagnated and a large proportion of proteins remain unstudied or
understudied even in model organisms.  PomBase maintains an unknown
protein inventory, first described in [Wood *et al.* 2019](https://doi.org/10.1098/rsob.180241).
We periodically review unknown proteins for available functional data
from other species.
There are multiple ways to classify whether a gene is functionally
characterized, and the concept of “characterization” is clearly a
continuum. However, as an initial step in defining “unknowns” we
devised a simple binary classification, based on biological processes
at the level of the [fission yeast GO slim set](/browse-curation/fission-yeast-bp-go-slim-terms)
representing the broad cellular role (biological process) in which it participates.
The rationale for this process-focussed approach is described in more detail in
[Rutherford *et al.* 2024](https://doi.org/10.1093/genetics/iyae007)

#### Related gene lists

<table>
<thead>
  <tr>
    <th>List</th>
    <th title="Number of genes in list">Count</th>
    <th>Description</th>
  </tr>
</thead>
<tr>
  <td style="white-space: nowrap;"><a (click)="gotoPredefinedResults('canned_query:protein_coding_genes_unknown_process')">Unknown genes</a></td>
  <td style="white-space: nowrap;"><a (click)="gotoPredefinedResults('canned_query:protein_coding_genes_unknown_process')">
  {{getPredefinedQueryCount('canned_query:protein_coding_genes_unknown_process') | async}}
  </a>
  </td>
  <td>Protein coding genes, unknown process</td>
</tr>
<tr>
  <td>[Conserved unknown](/gene_subset/characterisation_status_conserved_unknown)</td>
  <td style="white-space: nowrap;">
  <a routerLink="/gene_subset/characterisation_status_conserved_unknown">
    {{getPredefinedQueryCount('priority-unstudied-genes:conserved_unknown') | async}}
  </a>
  </td>
  <td>
    Genes of unknown process, conserved outside the Schizosaccharomyces clade
  </td>
</tr>
<tr>
  <td style="white-space: nowrap;">[Priority unstudied genes](/status/priority-unstudied-genes)</td>
  <td style="white-space: nowrap;">
  <a routerLink="/status/priority-unstudied-genes">
  {{getPredefinedQueryCount('priority-unstudied-genes:conserved_unknown_AND_conserved_in_vertebrates') | async}}
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
  <td style="white-space: nowrap;">[Missing activities](/gocam/missing-activities)</td>
  <td style="white-space: nowrap;"><a routerLink="/gocam/missing-activities">{{getMissingActivityCount() | async}}</a></td>
  <td>
    A list of activities known or suspected to occur in fission
    yeast but not yet associated with a gene product. These “pathway
    holes” have been identified through GO-CAM causal model curation.
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
