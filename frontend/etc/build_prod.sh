#!/bin/sh -

ABBREVS="SO SGD PR RGD MGI EC Pfam PANTHER UniProtKB UniPathway FB InterPro ECOGENE UniProtKB-KW PDB WB AGI_LocusCode dictyBase"

etc/make-link-js.pl /var/pomcur/sources/go-svn/doc/GO.xrf_abbs $ABBREVS > src/app/config/external-links.json
ng build --env=prod --target=production && (cd dist; rsync -cavP * oliver0:/var/www/www-pombase2/)

