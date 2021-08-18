## Identifier mapper

The identifier mapper retrieves *${species_abbrev}* gene systematic IDs and standard names for a selection of different input ID types:

- Find *${species_abbrev}* genes using UniProt accessions
- Retrieve manually curated orthologs for
   - *S. cerevisiae*: Use standard gene names (*CDC28*, *ACT1*, etc.), ORF names (YPR121W, YPL258C, etc.), or SGD IDs (SGD:S000004494, SGD:S000004635, etc.)
   - Human: use standard gene names (*CDK1*, *BRCA2*, etc.) or HGNC identifiers (e.g. HGNC:1722)
%%if db=PomBase
   - *S. japonicus*: use standard gene names (*cdc11*, *pka1*, etc.) or systematic IDs (e.g. SJAG_01188)
%%end db=PomBase
%%if db=JaponicusDB
  - *S. pombe*: use standard gene names (*cdc11*, *pka1*, etc.) or systematic IDs (e.g. SPCC1739.11c)
%%end db=JaponicusDB

Select an input identifier type in the pulldown, and enter IDs by
typing, pasting, or uploading a file:

![identifier mapper input page](assets/id_mapper_input.png){width="500"}

Click "Clear" to empty the input box or "Lookup" to retrieve results.

For all query types, the number of matching *${species_abbrev}* genes is shown
at the top. Any unmatched IDs are shown next.

![identifier mapper results for S. cerevisiae orthologs](assets/id_mapper_results.png){width="500"}

1. "Go back" returns to the start page, with the search settings and
IDs you used filled in.

2. You can use the list of matching *${species_abbrev}* genes in the Advanced
Search "Gene names and IDs" query.

3. For orthology ID searches, matching *${species_abbrev}* genes may fall into
any of into three categories:

- one-to-one
- one-to-many
- many-to-one

4. All result lists show two columns: the entered ID(s) and the
matching *${species_abbrev}* gene(s). Links go to ${database_name} gene pages. If there
is a single result in the one-one or one-many section, it is displayed
by default. Longer lists, and many-to-one matches, are hidden by
default. Use the "Show matches/Hide matches" links to toggle the
display.

For *${species_abbrev}* UniProt accessions, almost all results are one-to-one;
the show/hide toggle works the same as for ortholog results.
