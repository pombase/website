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
at the level of the [fission yeast GO slim set](/browse-curation/fission-yeast-bp-go-slim-terms).
The rationale for this process-focussed is described in more detail in
[Rutherford *et al.* 2024](https://doi.org/10.1093/genetics/iyae007)

A list of ["Priority unstudied genes" (vertebrate orthologs, unknown process, protein coding)](/status/priority-unstudied-genes)
is updated daily.


#### Changes over time

[![Gene characterisation status](assets/gene_characterisation_status_figure.svg){.screenshot width=40em;}](assets/gene_characterisation_status_figure.svg)

#### Current status

<app-characterisation-status-table></app-characterisation-status-table>


#### Protein-coding gene characterisation status descriptions

**Published:** Completely or partially characterised
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
