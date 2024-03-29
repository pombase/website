# Can I access ${database_name} via SQL?
<!-- pombase_categories: Finding data,Tools and resources -->

${database_name} does not have a publicly accessible SQL query server, but
[Chado database dumps](/downloads/chado-database-dumps) (PostgresQL)
are available to download and query locally.

The [Ensembl Fungi MySQL database](https://fungi.ensembl.org/info/data/mysql.html) 
server does provide access to query *${species_abbrev}* data. Note, however,
that Ensembl Genomes (EG) is updated much less frequently than
${database_name}, so EG data will rarely be as up-to-date as the ${database_name} web
site.

MySQL dumps of EG data, including *Schizosaccharomyces* species, are
available from [EG's FTP site](ftp://ftp.ensemblgenomes.org/pub/current/fungi/mysql/).
