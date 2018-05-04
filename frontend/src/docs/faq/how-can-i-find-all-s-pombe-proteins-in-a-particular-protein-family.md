# How can I find all *S. pombe* proteins in a particular protein family?
<!-- pombase_categories: Orthology,Finding data -->

There are various ways you can find protein family members.

1.  If you know the Pfam, PRINTs, PROSITE, or InterPro accession for the
    family or domain you want, you can use the [advanced search](/query)).
    Click "Protein domain" and then enter the accession.
2.  If you don't have an accession, but do know any member of the
    family, go directly to its gene page. In the "Protein Features"
    section of the gene page there is a table of protein domains and
    families, which includes a link to a list of all family members
    in S. pombe.
3.  If you know neither accessions nor family members, you can search
    for keywords in the [InterPro](http://www.ebi.ac.uk/interpro/)
    database, which combines signatures from a number of member
    databases, including Pfam. Record the accession number(s) of the
    family, and use them in the PomBase advanced search as described
    in item 1 above. (If necessary, you can use the query history to
    combine the results of several queries.)

Example query: <app-query-link [goToResults]="true" [linkText]="'Proteins matching &quot;ATPase, AAA-type, core&quot; (Pfam:PF00004)'"
    [predefinedQueryId]="'Pfam_PF00004'">
</app-query-link>





