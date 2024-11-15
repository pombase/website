## Monarch Disease Ontology slim

A “slim” is a high-level subset of terms from an ontology, used to
analyze sets of annotated genes. The table below shows a slim set of
grouping terms that we have selected from the [Mondo Disease Ontology](https://mondo.monarchinitiative.org/) (Mondo)
and the number of annotations to each term. Mondo IDs link to ${database_name}
ontology term pages. The annotation totals link to pages with
information about the term and a list of annotated genes. A gene may
be included in the annotation sets for more than one slim term.

You can download a list of current
[${database_name} Mondo slim IDs and term names](https://www.pombase.org/releases/latest/misc/pombe_mondo_slim_ids_and_names.tsv)
from the ${database_name} FTP site.

If you would like to have any terms added to the ${database_name} Mondo slim set, please
contact the [helpdesk](mailto:${helpdesk_address}).

<app-slim-table [slimName]="'pombe_mondo_slim'"></app-slim-table>
