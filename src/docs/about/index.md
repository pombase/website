## About ${database_name}

${database_name} is the comprehensive model organism knowledgebase or the fission yeast *${genus_and_species}*, which aims to standardise, integrate, display, and disseminate biological knowledge and datasets to the wider scientific community, making a wide range of data-types from large and small-scale publications [FAIR](https://pubmed.ncbi.nlm.nih.gov/26978244/).

You can use ${database_name} to:

- Access and query manually **curated literature** annotations:
  - **Gene Ontology (GO)** annotations describing the normal (evolved) roles and locations of gene products.
  - **Phenotype** annotations linked to the alleles and genotypes that cause them.
  - **Genetic and Physical interactions** between genes.
  - **Protein modifications,** the gene products that add/ remove them, when in the cell cycle they occur or under which environmental conditions, .
  - **Phylogenetic** information and **gene complementation.**
- **Browse the genome** of *${genus_and_species}*, and access **gene sequences and features** (UTRs, exons and introns, protein sequence features).
- Download **genome-wide datasets**.

${database_name} is also a community hub for researchers providing news, events, documentation, mailing lists, genome statistics, and a community curation interface. New to the fission yeast community? Visit our [getting started page](documentation/getting-started).

%%if db=PomBase
## More about ${database_name}:

  - ${database_name} promotes **community curation**, involving authors in the curation of their published research. This increases curation quality, and allows researchers to become familiar with the data organisation and supported data types. We developed [<u>Canto</u>](https://github.com/pombase/canto), a web-based curation tool to support professional and community curation that is also used by [<u>FlyBase</u>](https://flybase.org/), [<u>PHI-Base</u>](http://www.phi-base.org/) and [<u>JaponicusDB</u>](https://www.japonicusdb.org/). [Read more](community/fission-yeast-community-curation-project) about community curation.
  - We provide over **300.000 curated standardised annotations** and our 27.000 experimentally supported GO annotations support more than 687.000 species-wide annotations in other key model species. [<u>See our stats</u>](https://curation.pombase.org/pombe/stats/annotation)
  - We actively participate in the **development of several ontologies** to extend and improve standards that represent the knowledge produced by researchers.
  - See all of our ongoing [collaborations](/about/collaborations) and [projects](/about/projects).
%%end db=PomBase

%%if db=JaponicusDB
JaponicusDB was established with support from the [Wellcome
Trust](https://wellcome.org/) (Senior Investigator Award
[103741/Z/14/Z] to Snezhana Oliferenko), and has been deployed using
code originally developed at the University of Cambridge for
[PomBase](https://www.pombase.org/). The *S. japonicus* community
contributes literature curation and maintains JaponicusDB. The
JaponicusDB collaboration is led by researchers at the [Francis Crick
Institute](https://www.crick.ac.uk/) and [King's College
London](https://www.kcl.ac.uk/).
%%end db=JaponicusDB

------------------------------------

### Contact ${database_name} staff

Email: [${helpdesk_address}](mailto:${helpdesk_address})

%%if db=PomBase
For more information, see the [${database_name} Staff](about/pombase-staff) page.
%%end db=PomBase

### Submit Data

See the [Submit data](submit-data) page

### Data sources

Source publications for external data used in ${database_name} pages and genome browser.

[Data sources](about/data-sources)

------------------------------------

### Citing ${database_name}

The [Citing ${database_name}](/about/citing-${lc_database_name}) page lists papers to cite
for ${database_name}, the *${species_abbrev}* genome sequence, annotation data, and
other resources.

### Terms of Use

[Terms of Use](about/terms-of-use) for ${database_name} data and Canto.

### ${database_name} Publications

Complete list of [papers published by ${database_name}](about/published-by-${lc_database_name}).

------------------------------------

%%if db=PomBase
### PomBase SAB

[Scientific Advisory Board members](about/pombase-sab)

------------------------------------

### PomBase staff

Current and past [PomBase Staff](about/pombase-staff)

------------------------------------

### Data versions

Versions of internal and external data loaded into current and past
PomBase releases.

[Version history](about/version-history)
%%end db=PomBase

### Receive project updates

%%if db=PomBase
Subscribe to [Pombelist](https://lists.cam.ac.uk/sympa/info/ucam-pombelist) to receive
annotation and data updates
%%end db=PomBase

%%if db=JaponicusDB
Subscribe to [japonicus-list](https://mailman.kcl.ac.uk/mailman/listinfo/japonicus-list) to receive
annotation and data updates
%%end db=JaponicusDB

------------------------------------

### Privacy

See the ${database_name} [privacy policy](about/privacy-policy) and [cookie policy](about/cookie-policy).

------------------------------------

### Project funding
%%if db=PomBase
PomBase is funded by the [Wellcome Trust](https://wellcome.ac.uk/) \[218236/Z/19/Z\].
%%end db=PomBase

%%if db=JaponicusDB
JaponicusDB is funded by the [Wellcome Trust](https://wellcome.org/)
(Senior Investigator Award \[103741/Z/14/Z\] to Snezhana Oliferenko)
%%end db=JaponicusDB

