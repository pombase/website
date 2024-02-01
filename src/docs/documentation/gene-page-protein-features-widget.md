## Gene page: Protein feature widget

This widget shows a visual summary of protein features for the current
gene.  Hover over an allele, partial deletion, modification or Pfam
domain to see more details.  Hover over the track name for a brief
description of the track.

![pap1 gene page protein features widget](assets/gene-pap1-protein-feature-viewer-widget-colour.png){ .screenshot width=96%}

### Available tracks

  - **Sequence** the amino acid sequence - zoom in to see individual residues
  - **AA substitution positions** positions where there are one or more amino acid substitutions
  - **AA substitution alleles** curated amino acid substitution alleles (available only in the full view) 
  - **Partial deletions** curated alleles with partial amino acid deletions (full view only)
  - **Modifications** curated modified residues coloured by modification type:
    - <div style="background-color: #86a8f4;" class="docs-colour-block">&nbsp;</div> - N6-acylated L-lysine
    - <div style="background-color: #d2d27e;" class="docs-colour-block">&nbsp;</div> - lipoconjugated residue
    - <div style="background-color: #f88;" class="docs-colour-block">&nbsp;</div> - N-acetylated residue
    - <div style="background-color: #2b8;" class="docs-colour-block">&nbsp;</div> - phosphorylated residue
    - <div style="background-color: #c6f;" class="docs-colour-block">&nbsp;</div> - methylated residue
    - <div style="background-color: #d6009e;" class="docs-colour-block">&nbsp;</div> - glycoconjugated residue
    - <div style="background-color: #ff9943;" class="docs-colour-block">&nbsp;</div> - modified L-cysteine residue
    - <div style="background-color: #666;" class="docs-colour-block">&nbsp;</div> - default
  - **Pfam families** Pfam protein familes from [InterPro](https://www.ebi.ac.uk/interpro/)
  - **TM domains** Trans-membrane domains calculated with TMHMM (Krogh et al. 2001)
  - **Disordered regions** Disordered regions from Pfam version 34.0 (El-Gebali et al. 2019)
  - **Low complexity** Low complexity regions from Pfam
  - **Coiled coils** Coiled coil regions from Pfam

### Mutant display

Single residue alleles are shown as vertical lines (or rectangles if
zoomed in).  Alleles with multiple mutated residues
(eg. "cdc15-E30K,E152K") are connected with dashed lines.

### Partial deletions

The solid blue rectangles display the retained amino acids, dashed
display the deleted regions.

### Full/detailed protein feature view

Follow the "View all protein features ..." link for a detailed view on
the dedicated protein features page that includes the details of the
individual amino acid substitution allele changes and "Partial
deletions" tracks:

![pap1 protein features page](assets/gene-pap1-protein-feature-viewer-page-colour.png){ .screenshot width=96%}
![hht1 protein features page](assets/gene-hht1-protein-feature-viewer-page.png){ .screenshot width=96%}

Thanks to the team at [RCSB PDB](https://www.rcsb.org/) for providing
the [Open Source software](https://github.com/rcsb/rcsb-saguaro) used
to implement this feature.
