# How can I find all S. pombe proteins in a particular protein family?
<!-- pombase_categories: Orthology,Querying/Searching -->

There are various ways you can find protein family members.

1.  If you know the Pfam, PRINTs, PROSITE, or InterPro accession for the
    family or domain you want, you can use the [Advanced     Search](http://www.pombase.org/spombe/query/builder)(http://www.pombase.org/spombe/query/builder).
    Go to the New Query tab, choose "Proteins That Have Specific Protein
    Domains" in the "Select Filter" pulldown, enter the accession, and
    submit.
2.  If you don't have an accession, but do know any member of the
    family, go directly to its gene page. In the "Protein Features"
    section of the gene page there is a table of protein domains and
    families, which includes a link to a list of all family members
    in S. pombe.
3.  If you know neither accessions nor family members, you can
    search for keywords in the
    [InterPro](http://www.ebi.ac.uk/interpro/)database
    (http://www.ebi.ac.uk/interpro/), which combines signatures from a
    number of member databases, including Pfam. Record the accession
    number(s) of the family, and use them in the PomBase advanced search
    as described in item 1 above. (If necessary, you can use Query
    Management to combine the results of several queries.)

You can also try a keyword search in the PomBase advanced search, but
this is much less reliable, because a keyword search may retrieve some
proteins that don't have the domain or aren't family members due to
coincidentally matching words in gene product descriptions. In the
future, we plan to add the ability to search the full text of gene
pages, which will provide another option for finding protein family
information.

Example query: [Proteins matching "ATPase, AAA-type, core" (Pfam:PF00004)](/spombe/query/builder?filter=37&value=%5B%7B%22param%22:%7B%22filter_1%22:%7B%22filter%22:%224%22,%22query_1%22:%22pfam_pf%22,%22query_2%22:%22PF00004%22%7D%7D,%22filter_count%22:%221%22%7D%5D)

