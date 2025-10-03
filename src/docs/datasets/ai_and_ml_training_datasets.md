# AI TRAINING DATASETS LANDING PAGE

These datasets represent high-quality, manually reviewed datasets that
are useful for training and benchmarking AI-based models and
workflows.

[Latest release of training datasets](https://www.pombase.org/latest_release/training_data_for_ML_and_AI)

## Comprehensive datasets for named entity datasets for grounding and normalisation

| File | Description |
| :---- | :---- |
| [gene_IDs_names_products.tsv](https://www.pombase.org/latest_release/gene_names_and_identifiers/gene_IDs_names_products.tsv)     | All PomBase systematic IDs, gene names, and synonyms for fission yeast,  linked to UniProt identifiers |
| [alleles.tsv](https://www.pombase.org/latest_release/training_data_for_ML_and_AI/alleles.tsv) | All PomBase curated alleles, including names, types and standardised descriptions |

## Datasets for Literature Classification

| File | Description |
| :---- | :---- |
| Curatable publications  | Publications likely to contain gene-specific data for curation |
| Curated publications | Publications with gene-specific curation  |
| [canto_pub_classification.tsv](https://www.pombase.org/latest_release/training_data_for_ML_and_AI/canto_pub_classification.tsv) | Literature triage classifier labels |

## Datasets for Function Extraction

These datasets provide **text excerpts (text spans) and/or figure
references** used by the curator to make an association between a gene
or allele and an ontology term:

 * The data only includes **manually curated associations** from
   small-scale, hypothesis-driven publications, and it **excludes data
   from high-throughput datasets**.   

 * For publications with comments, not every annotation has a “text
   span” comment. In the future, we plan to use an **AI-supported
   system** to backfill these comments by analysing reasoning
   traces. We have included all annotations from any publication with
   any comments in these files.
  
  
 * **GO Annotation:**  Although we curate redundant annotations to
   demonstrate reproducibility, we do not typically re-curate
   well-known facts that are **already well-represented in the
   dataset**. For example, we wouldn't repeatedly curate that *cdc2*
   is part of the G2/M transition from every publication that confirms
   it. While an AI prediction might not be wrong for adding such a fact,
   our manual curation prioritises non-redundancy after reproducibility
   is sufficiently captured for GO (We would, however, usually curate
   the associated phenotypes  redundantly using the same or different
   alleles, unless it is clearly stated to be confirmation of a commonly
   reproduced experiment).



| File | Description |
| :---- | :---- |
| [canto_go_annotations_with_comments.tsv](https://curation.pombase.org/dumps/latest_build/misc/canto_fypo_annotations_with_comments.tsv) | Manual GO annotations with comments, TSV format |
| [canto_fypo_annotations_with_comments.tsv](https://curation.pombase.org/dumps/latest_build/misc/canto_go_annotations_with_comments.tsv) | Manual phenotype annotations with comments, TSV format |
