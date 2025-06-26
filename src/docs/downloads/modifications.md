### Protein modifications

All annotated *S. pombe* protein modifications are available to
download in [TSV](https://en.wikipedia.org/wiki/Tab-separated_values)
format:

 - [protein_modifications.tsv](/latest_release/protein_features/protein_modifications.tsv)

#### Columns

 1. `gene_systematic_id` - The PomBase systematic ID, example: "SPAC1002.02"
 2. `gene_name` - Gene name, if any,  example: pom34
 3. `modification_term_id` - An ontology term from the
    [PSI-MOD protein modification ontology](https://www.psidev.info/protein-modifications), example: MOD:01148
 4. `evidence` - Evidence code (see below), example: mass spectrometry evidence
 5. `modification` - Modified amino acid with position, example: K186
 6. `extension` - Extra annotation details (see below), example: "added\_by(PomBase:SPCC24B10.07),added\_during(GO:0006995),occupancy(10),removed\_by(PomBase:SPAC227.07c)"
 7. `reference` - Source of the annotation, example: PMID:37970674
 8. `taxon_id` - [NCBI taxonomy database ID](https://www.ncbi.nlm.nih.gov/Taxonomy), example: [4896 (*S. pombe*)](https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?mode=Info&id=4896)
 9. `date` - Annotation date, example: 2023-11-16
 10. `assigned_by` - Database that created this annotation, example: PomBase

#### Current protein modification evidence codes:

 - author statement without traceable support used in manual assertion
 - combinatorial computational and experimental evidence used in manual assertion
 - curator inference used in manual assertion
 - differential hybridization evidence
 - experimental evidence
 - experimental evidence used in manual assertion
 - high throughput evidence used in manual assertion
 - Inferred from Direct Assay
 - Inferred from Mutant Phenotype
 - Inferred from Sequence Model
 - Inferred from Sequence or Structural Similarity
 - mass spectrometry evidence
 - match to sequence model evidence used in manual assertion
 - neural network method evidence used in manual assertion
 - sequence similarity evidence used in manual assertion
 - Traceable Author Statement
 - tryptic phosphopeptide mapping assay evidence used in automatic assertion

#### Annotation extensions for modifications

The extension is used to record extra annotation details that are not
captured in the other columns.  The extensions details are also
available in the [modifications section]() of the gene pages.

For example, [taf12](https://www.pombase.org/gene/SPAC15A10.02):

![taf12 modification extensions](assets/modification-extension-example-taf12.png){ .screenshot width="600"}

This extension system is also used for [GO and FYPO annotations](/faq/what-annotation-extension).

More details on the extension types are avaiable on the
[modification upload format documentation page](/documentation/modification-data-bulk-upload-format).
