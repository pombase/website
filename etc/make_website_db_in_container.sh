#!/bin/sh -

# In container (with "docker exec -ti --name pombase-website bash"):

apt install -y postgresql
/etc/init.d/postgresql start

su - postgres -c '(echo pombase; echo pombase) | createuser -s -P pombase'
su - postgres -c 'createdb -O pombase pombase-website'
su - postgres -c 'psql pombase-website' < website-database-schema.sql

sed 's/\$(CIRCUS.ENV.HOST_IP_ADDRESS)/localhost/' circus.ini > circus.ini.new && mv circus.ini.new circus.ini

circusctl restart
