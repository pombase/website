## The ${database_name} user API

This [API](https://en.wikipedia.org/wiki/API) allows retrieval of
${database_name} data from scripts and other programs, and from the
command line.

All data available via this API can also be downloaded. Visit the
[Datasets page](/datasets) for information about the data files
available in each release.

The base URL for the ${database_name} APIs is `${base_url}/api/`

### API functionality

This API provides functions for:

 - gene detail lookup (results in JSON format)
   - by `<a (click)="scrollTo('lookup-gene-by-systematic-id')">systematic ID</a>`{=html}
   - or `<a (click)="scrollTo('lookup-gene-by-uniprot-id')">UniProtKB accession</a>`{=html}
 - `<a (click)="scrollTo('mapping-api-ortholog-lookup')">an ID mapping tool</a>`{=html}: query with `<a (click)="scrollTo('mapping-api-ortholog-lookup')">UniProtKB accessions</a>`{=html} or
%%if db=PomBase
   *S. japonicus*,
%%end db=PomBase
%%if db=JaponicusDB
   *S. pombe*,
%%end db=JaponicusDB
   *S. cerevisiae* or human `<a (click)="scrollTo('mapping-api-ortholog-lookup')">gene ortholog IDs</a>`{=html} to retrieve ${species} IDs in
   TSV, CSV or JSON format
 - `<a (click)="scrollTo('go-annotation-lookup-by-term-id')">querying GO annotation</a>`{=html} in [GAF TSV](https://geneontology.org/docs/go-annotation-file-gaf-format-2.2/)
   or JSON format by term ID or by a list of term IDs
 - `<a (click)="scrollTo('phenotype-annotation-lookup-by-term-id')">querying phenotype/genotype</a>`{=html} ([FYPO](${base_url}/browse-curation/fission-yeast-phenotype-ontology))
   annotation in [PomBase PHAF](${base_url}/downloads/phenotype-annotations)
   or JSON format

#### Accessing the API from the command line or from code


```{=html}
<details>
<summary> Examples of accessing the API with <a href="https://curl.se/">cURL</a> </summary>
```

Gene details in JSON format:
```sh
curl -s ${base_url}/api/gene/by_id/SPAC1F12.05 > SPAC1F12.05.json
```

Extract the `symbol` field with [`jq`](https://jqlang.org/):
```sh
curl -s ${base_url}/api/gene/by_id/SPAC1F12.05 | jq -r '."symbol"'
```

GO annotation in [GAF TSV format](https://geneontology.org/docs/go-annotation-file-gaf-format-2.2/):
```sh
curl -s ${base_url}/api/go_annotation/by_term_id/GO:0033313/tsv > GO_0033313_annotations.tsv
```

Map human IDs to *${species}* IDs:
```sh
curl -s ${base_url}/api/mapper/from_ortholog/taxon:9606/HGNC:1771,HGNC:1772/csv > orths.csv
```

```{=html}
</details>
```

```{=html}
<details>
  <summary> Examples using Python </summary>
```

Using the `requests` library to access the API:

```python
import requests
import json

response = requests.get("${base_url}/api/gene/by_id/SPAC1F12.05")
data = response.json()

# print one field
print(response.json()['symbol'])

# pretty-print all the gene details
pretty_json = json.dumps(data, indent=4)
print(pretty_json)

# pretty-print one field
print(json.dumps(data['gocams'], indent=4))
```

```{=html}
</details>
```

```{=html}
<details>
<summary> Accessing with <a href="https://duckdb.org/">DuckDB</a> </summary>
```

Run `duckdb` or `duckdb ':memory:'`, then:
```sql
SELECT systematic_id,symbol,taxonid,length(transcripts[1]['protein']['sequence']) as protein_length
%%if db=PomBase
FROM read_json('https://www.pombase.org/api/gene/by_id/SPAC1F12.05');
%%end db=PomBase
%%if db=JaponicusDB
FROM read_json('https://www.japonicusdb.org/api/gene/by_id/SJAG_03404');
%%end db=JaponicusDB
```

Results:
```
%%if db=PomBase
┌───────────────┬─────────┬─────────┬────────────────┐
│ systematic_id │ symbol  │ taxonid │ protein_length │
│    varchar    │ varchar │  int64  │     int64      │
├───────────────┼─────────┼─────────┼────────────────┤
│ SPAC1F12.05   │ any2    │    4896 │            378 │
└───────────────┴─────────┴─────────┴────────────────┘
%%end db=PomBase
%%if db=JaponicusDB
┌───────────────┬─────────┬─────────┬────────────────┐
│ systematic_id │ symbol  │ taxonid │ protein_length │
│    varchar    │ varchar │  int64  │     int64      │
├───────────────┼─────────┼─────────┼────────────────┤
│ SJAG_03404    │ any1    │    4897 │            362 │
└───────────────┴─────────┴─────────┴────────────────┘
%%end db=JaponicusDB
```

%%if db=PomBase
Or use the [Parquet format](https://parquet.apache.org/) in the
release to query the full gene dataset.

Example query to retrieve the three longest proteins:

```sql
SELECT systematic_id,symbol,length(transcripts[1]['protein']['sequence']) as protein_length
  FROM 'https://www.pombase.org/latest_release/gene_names_and_identifiers/gene_ids_and_details.parquet'
  ORDER BY protein_length DESC LIMIT 3;
```

Result:
```
┌───────────────┬─────────┬────────────────┐
│ systematic_id │ symbol  │ protein_length │
│    varchar    │ varchar │     int64      │
├───────────────┼─────────┼────────────────┤
│ SPAC23G3.02c  │ sib1    │           4925 │
│ SPCC737.08    │ mdn1    │           4718 │
│ SPAC1093.06c  │ dhc1    │           4197 │
└───────────────┴─────────┴────────────────┘
```

%%end db=PomBase

```{=html}
</details>
```

------------------------

### Lookup a ${database_name} gene by systematic ID {#lookup-gene-by-systematic-id}

`${base_url}/api/gene/by_id/`{.html}**SYSTEMATIC_ID**

where **SYSTEMATIC_ID** can be any ${species} systematic identifier.

The gene details are returned in JSON format.

Example: `${base_url}/api/gene/by_id/SPAC1F12.05`

If a gene with that ID can't be found the `404` status code will be
returned.

<details>
  <summary>
Example output (with some detail omitted)
    <p>
The full output is available [from the API](${base_url}/api/gene/by_id/SPAC1F12.05).
    </p>
  </summary>
  <pre>
{{ '{' }}
  "systematic_id": "SPAC1F12.05",
  "symbol": "any2",
  "taxonid": 4896,
  "product": "arrestin family ubiquitin ligase substrate adaptor Any2",
  "deletion_viability": "viable",
  "uniprot_identifier": "Q10347",
  "feature_type": "protein",
  "feature_so_termid": "SO:0000704",
  "transcript_so_termid": "SO:0000234",
  "characterisation_status": "biological role inferred",
  "taxonomic_distribution": "fungi only",
  "orthologs": [ ... ],
  "transcripts": [ ... ],
  "interpro_matches": [ ... ],
  "chromosome_location": [ ... ],
  "gocams": [ ... ],
  ...
{{ '}' }}
  </pre>
</details>

#### Other species

A small amount of information is also available for species that have
curated orthologs in ${database_name}.  Examples:

%%if db=PomBase
 - *S. japonicus*: `${base_url}/api/gene/by_id/SJAG_03404`
%%end db=PomBase
%%if db=JaponicusDB
 - *S. pombe*: `${base_url}/api/gene/by_id/SPAC1F12.05`
%%end db=JaponicusDB
 - human: `${base_url}/api/gene/by_id/HGNC:1774`
 - *S. cerevisiae*: `${base_url}/api/gene/by_id/YOR322C`

### Lookup multiple genes by systematic ID

`${base_url}/api/genes/by_id/`{.html}**SYSTEMATIC_ID_LIST**

where **SYSTEMATIC_ID_LIST** is a comma-separated list of ${species}
systematic identifiers.

```{=html}
<details>
  <summary>
Example of querying with two IDs
  </summary>
```

```html
%%if db=PomBase
curl -s ${base_url}/api/genes/by_id/SPBC216.07c,SPAC1F12.05 > genes.json
%%end db=PomBase
%%if db=JaponicusDB
curl -s ${base_url}/api/genes/by_id/SJAG_03404,SJAG_01143 > genes.json
%%end db=JaponicusDB
```

The gene details will be returned in the "`found`" field.  Any IDs
that don't match a ${species} systematic identifier will be returned
in the "`not_found`" field.

Example output from the API:
%%if db=PomBase
[SPBC216.07c and SPAC1F12.05 JSON](${base_url}/api/genes/by_id/SPBC216.07c,SPAC1F12.05)
%%end db=PomBase
%%if db=JaponicusDB
[SJAG_03404 and SJAG_01143 JSON](${base_url}/api/genes/by_id/SJAG_03404,SJAG_01143)
%%end db=JaponicusDB

```{=html}
</details>
```

### Lookup with a POST request

The gene ID list can also be sent with a POST request.

```{=html}
<details>
  <summary>
POST example using cURL
  </summary>
```

```sh
curl -X POST -H "Content-Type: application/x-www-form-urlencoded" \
%%if db=PomBase
   -d q=SPBPB21E7.02c,SPBC651.07,SPCC1919.06c,SPBC1921.03c \
%%end db=PomBase
%%if db=JaponicusDB
   -d q=SJAG_03404,SJAG_01143 \
%%end db=JaponicusDB
   ${base_url}/api/genes/by_id > genes.json
```

Note that the `q=` at the start of the ID list is required.

```{=html}
</details>
```

### Lookup a gene by UniProtKB accession {#lookup-gene-by-uniprot-id}

`${base_url}/api/gene/by_uniprot_accession/`{.html}**UNIPROT_ACCESSION**

```{=html}
<details>
  <summary>
Example
  </summary>
```

```html
curl -s ${base_url}/api/gene/by_uniprot_accession/Q9Y7K2 > gene.json
```

The `404` status code is returned if no gene has that accession.

```{=html}
</details>
```

### Lookup multiple genes by UniProtKB accessions

`${base_url}/api/genes/by_uniprot_accession/`{.html}**UNIPROT_ACCESSION_LIST**

```{=html}
<details>
  <summary>
Example
  </summary>
```

```html
%%if db=PomBase
curl -s ${base_url}/api/genes/by_uniprot_accession/Q9Y7K2,Q9Y7M4 > genes.json
%%end db=PomBase
%%if db=JaponicusDB
curl -s ${base_url}/api/genes/by_uniprot_accession/B6JZI3,B6K451 > genes.json
%%end db=JaponicusDB
```

```{=html}
</details>
```

### Lookup using UniProtKB accessions with a POST request

```{=html}
<details>
  <summary>
Example using cURL
  </summary>
```

```sh
curl -X POST -H "Content-Type: application/x-www-form-urlencoded" \
%%if db=PomBase
   -d q=Q9Y7K2,Q9Y7M4 \
%%end db=PomBase
%%if db=JaponicusDB
   -d q=B6JZI3,B6K451 \
%%end db=JaponicusDB
   ${base_url}/api/genes/by_uniprot_accession > genes.json
```

The `q=` at the start of the ID list is required.

```{=html}
</details>
```

------------------------

### Lookup ${species} genes by ortholog IDs with the mapping API {#mapping-api-ortholog-lookup}

`${base_url}/api/mapper/from_ortholog/taxon:`{.html}**TAXON_ID**`/`{.html}**ID_LIST**`/`{.html}**OUTPUT_TYPE**

where:

 - **TAXON_ID** is 9606 (*human*), 4932 (*S. cerevisiae*)
%%if db=PomBase
   or 4897 (*S. japonicus*)
%%end db=PomBase
%%if db=JaponicusDB
   or 4896 (*S. pombe*),
%%end db=JaponicusDB
 - **ID_LIST** is a comma separated list of ortholog IDs
 - **OUTPUT_TYPE** is one of `csv`, `tsv` or `json`

#### Examples

```{=html}
<details>
  <summary>
Lookup using human IDs, return a human to ${species} ID mapping in CSV format
  </summary>
```

```sh
curl -s ${base_url}/api/mapper/from_ortholog/taxon:9606/HGNC:1772,HGNC:1779,HGNC:20593/csv > gene_mapping.csv
```

result:
%%if db=PomBase
```csv
  HGNC:1772,SPBC11B10.09
  HGNC:20593,SPAC23H4.14
  HGNC:1779,SPAC23H4.17c
```
%%end db=PomBase
%%if db=JaponicusDB
```csv
  HGNC:1772,SJAG_03048
  HGNC:20593,SJAG_05184
  HGNC:1779,SJAG_00342
```
%%end db=JaponicusDB

```{=html}
</details>
```

```{=html}
<details>
  <summary>
Lookup ${species} genes using <i>cerevisiae</i> ortholog IDs, results in JSON format:
  </summary>
```

```sh
curl -s ${base_url}/api/mapper/from_ortholog/taxon:4932/YDR473C,YGR268C/json > gene_mapping.json
```

result:

<pre class="sourceCode">
 {{ '{' }}
   "matches": [
%%if db=PomBase
     ["YGR268C", "SPAC17A5.10"],
     ["YDR473C", "SPAC29E6.02"]
%%end db=PomBase
%%if db=JaponicusDB
     ["YGR268C", "SJAG_03273"],
     ["YDR473C", "SJAG_01634"]
%%end db=JaponicusDB
   ],
   "not_found": []
 {{ '}' }}
</pre>

```{=html}
</details>
```

### Lookup by ortholog IDs with a POST request

For long list of IDs a POST request can be used using the following
the parameters:

 - **taxon_id** - one of 9606 (*human*), 4932 (*S. cerevisiae*)
%%if db=PomBase
   or 4897 (*S. japonicus*)
%%end db=PomBase
%%if db=JaponicusDB
   or 4896 (*S. pombe*),
%%end db=JaponicusDB
 - **q** - a list of orthologs IDs
 - **output_type** - one of `csv`, `tsv` or `json`

```{=html}
<details>
  <summary>
Example
  </summary>
```

```sh
curl -X POST -H "Content-Type: application/x-www-form-urlencoded" -d taxon_id=9606 \
     -d q=HGNC:11079,HGNC:861 -d output_type=tsv ${base_url}/api/mapper/from_ortholog
```

Result (tab delimited):
```
%%if db=PomBase
 HGNC:11079      SPAC15A10.06
 HGNC:861        SPAC2C4.13
%%end db=PomBase
%%if db=JaponicusDB
 HGNC:11079      SJAG_04616
 HGNC:861        SJAG_02023
%%end db=JaponicusDB
```

```{=html}
</details>
```

### Using the mapping API to lookup ${species} genes using UniProtKB accessions {#mapping-api-uniprot-id-lookup}

`${base_url}/api/mapper/from_uniprot/`{.html}**ACCESSION_LIST**`/`{.html}**OUTPUT_TYPE**

where:

 - **ACCESSION_LIST** is a comma separated list of UniProtKB accessions
 - **OUTPUT_TYPE** is one of `csv`, `tsv` or `json`

```{=html}
<details>
  <summary>
Example using a GET request
  </summary>
```

```sh
%%if db=PomBase
curl -s ${base_url}/api/mapper/from_uniprot/O60150,Q9Y7M4/tsv
%%end db=PomBase
%%if db=JaponicusDB
curl -s ${base_url}/api/mapper/from_uniprot/B6JZI3,B6K451/tsv
%%end db=JaponicusDB
```

```{=html}
</details>
```

```{=html}
<details>
  <summary>
The same query, but using a POST request
  </summary>
```

```sh
curl -X POST -H "Content-Type: application/x-www-form-urlencoded" \
%%if db=PomBase
     -d q=O60150,Q9Y7M4 \
%%end db=PomBase
%%if db=JaponicusDB
     -d q=B6JZI3,B6K451 \
%%end db=JaponicusDB
     -d output_type=tsv ${base_url}/api/mapper/from_uniprot
```

Result (tab delimited):
```
%%if db=PomBase
 O60150    SPBC18H10.20c
 Q9Y7M4    SPBC9B6.05c
%%end db=PomBase
%%if db=JaponicusDB
 B6JZI3    SJAG_02023
 B6K451    SJAG_03404
%%end db=JaponicusDB
```

```{=html}
</details>
```

------------------------

### Lookup ${database_name} Gene Ontology annotations by term ID {#go-annotation-lookup-by-term-id}

`${base_url}/api/go_annotation/by_term_id/`{.html}**TERM_ID_LIST**`/`{.html}**OUTPUT_TYPE**

where:
  - **TERM_ID_LIST** is a GO term ID or a comma separated list of term IDs
  - **OUTPUT_TYPE** is one of `tsv`, `csv` or `json`

The `tsv` type is Gene Ontology Consortium
[GAF TSV format](https://geneontology.org/docs/go-annotation-file-gaf-format-2.2/).
Use `csv` to get the same data in comma separated values format.

The `json` output type includes the same information, but with the
with/from and annotation_extension fields pre-parsed for easy use.

```{=html}
<details>
  <summary>
Example using a single GO term
  </summary>
<div>
<p>
This example returns all annotation for "meiotic spindle assembly
checkpoint signaling" (GO:0033316):
</p>
```

```sh
curl -s ${base_url}/api/go_annotation/by_term_id/GO:0033316/tsv > GO_0033316.gaf.tsv
```

JSON version:
```sh
curl -s ${base_url}/api/go_annotation/by_term_id/GO:0033316/json > GO_0033316.json
```

The returned files will include all annotation visible on the
[${database_name} GO:0033316 page](${base_url}/term/GO:0033316).

```{=html}
</div>
</details>
```

```{=html}
<details>
  <summary>
Example of retrieving annotation for multiple terms
  </summary>
<div>
<p>
This example returns all annotation for "ascospore wall biogenesis"
(GO:0070591) and "ascospore-type prospore membrane formation"
(GO:0032120), and all descendant terms:
</p>
```

```html
${base_url}/api/go_annotation/by_term_id/GO:0070591,GO:0032120/tsv
```

Download in browser: [annotation for GO:0070591 and GO:0032120](${base_url}/api/go_annotation/by_term_id/GO:0070591,GO:0032120/tsv).

Or using the command line:
```sh
curl -s ${base_url}/api/go_annotation/by_term_id/GO:0070591,GO:0032120/tsv > annotations.gaf.tsv
```

```{=html}
</div>
</details>
```

------------------------

### Lookup ${database_name} Phenotype/genotype (FYPO) annotations by term ID {#phenotype-annotation-lookup-by-term-id}

`${base_url}/api/phenotype_annotation/by_term_id/`{.html}**TERM_ID_LIST**`/`{.html}**OUTPUT_TYPE**

where:

  - **TERM_ID_LIST** is a [FYPO](${base_url}/browse-curation/fission-yeast-phenotype-ontology)
    term ID or a comma-separated list of term IDs
  - **OUTPUT_TYPE** is one of `tsv`, `csv` or `json`
    - currently the `tsv` and `csv` types are [PomBase PHAF format](${base_url}/downloads/phenotype-annotations)
      which only represents annotation for single locus haploid
      genotypes
    - use `json` format to retrieve all annotation for a FYPO term

```{=html}
<details>
  <summary>
FYPO API example
  </summary>
<div>
<p>
The example will retrieve the single locus haploid genotype
annotation for "protein mislocalized to endoplasmic reticulum during
vegetative growth" (FYPO:0003657) and its descendants (more specific
terms):
</p>
```

```html
${base_url}/api/phenotype_annotation/by_term_id/FYPO:0003657/tsv
```

Download in browser: [annotation for FYPO:0003657](${base_url}/api/phenotype_annotation/by_term_id/FYPO:0003657/tsv).

```sh
curl -s ${base_url}/api/phenotype_annotation/by_term_id/FYPO:0003657/tsv > FYPO_0003657_annotations.tsv
```

To download all annotation for FYPO:0003657 and descendants use the
`json` output type:

```sh
curl -s ${base_url}/api/phenotype_annotation/by_term_id/FYPO:0003657/json > FYPO_0003657_annotations.json
```

The returned JSON file will include all annotation visible on the
[${database_name} FYPO:0003657 page](${base_url}/term/FYPO:0003657).

```{=html}
</div>
</details>
```
