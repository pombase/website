# AI Training Datasets

These datasets represent high-quality, manually reviewed datasets that
are useful for training and benchmarking AI-based models and
workflows.

[Latest release of training datasets](https://www.pombase.org/latest_release/training_data_for_ML_and_AI)

## Datasets for named entity recognition grounding and normalisation

| File | Description |
| :---- | :---- |
| [gene_IDs_names_products.tsv](https://www.pombase.org/latest_release/gene_names_and_identifiers/gene_IDs_names_products.tsv)     | All PomBase systematic IDs, gene symbols, and synonyms for fission yeast,  linked to UniProt identifiers |
| [alleles.tsv](https://www.pombase.org/latest_release/training_data_for_ML_and_AI/alleles.tsv) | All PomBase curated alleles, including names, types and standardised descriptions |

## Publication Datasets

| File | Description |
| :---- | :---- |
| [curated_publications.tsv](https://curation.pombase.org/dumps/latest_build/misc/curated_publications.tsv) | Publications that have been manually curated by PomBase. Some of these publications do not contain gene-specific data (for example browser datasets, or sequence features)
| [canto_pub_classification.tsv](https://www.pombase.org/latest_release/training_data_for_ML_and_AI/canto_pub_classification.tsv) | Literature triage classifier labels |

## Datasets for Function Extraction

These datasets provide **text excerpts (text spans) and/or figure
references** used by the curator to make an association between a gene
or allele and an ontology term:

 * The data only includes **manually curated associations** from
   small-scale, hypothesis-driven publications, and it **excludes data
   from high-throughput datasets**.

 * We have included all annotations from any publication in these files. We have not captured 'Text Span' or figure number for every single annotation. 

 * **GO Annotation:**  Although we curate redundant annotations to
   demonstrate reproducibility, we do not typically re-curate
   well-known facts that are **already well-represented in the
   dataset**. For example, we wouldn't repeatedly curate that *cdc2*
   is part of the G2/M transition from every publication that confirms
   it. While an AI prediction might not be wrong for adding such a fact,
   our manual curation prioritises non-redundancy after reproducibility
   is sufficiently captured for GO.


| File | Description |
| :---- | :---- |
| [canto_go_annotations_with_comments.tsv](https://curation.pombase.org/dumps/latest_build/misc/canto_fypo_annotations_with_comments.tsv) | Manual GO annotations with comments, [PHAF TSV format](/downloads/phenotype-annotations) with a "comments" column |
| [canto_fypo_annotations_with_comments.tsv](https://curation.pombase.org/dumps/latest_build/misc/canto_go_annotations_with_comments.tsv) | Manual phenotype annotations with comments, [GAF 2.2 TSV format](/downloads/go-annotations) with a "comments" column |
