## About ${database_name}

${database_name} is a model organism database that provides organization of
and access to scientific data for the fission yeast
*${genus_and_species}*. ${database_name} supports genomic sequence and
features, genome-wide datasets and manual literature curation.

${database_name} also provides a community hub for researchers, providing
genome statistics, a community curation interface, news, events,
documentation and mailing lists.

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
Subscribe to [Pombelist](https://lists.cam.ac.uk/mailman/listinfo/ucam-pombelist) to receive
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
PomBase is funded by the [Wellcome Trust](https://wellcome.ac.uk/) \[104967/Z/14/Z\].
%%end db=PomBase

%%if db=JaponicusDB
JaponicusDB is funded by the [Wellcome Trust](https://wellcome.org/)
(Senior Investigator Award \[103741/Z/14/Z\] to Snezhana Oliferenko)
%%end db=JaponicusDB

