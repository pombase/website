# Getting started


## Getting started in the *${genus_and_species}* community

%%if db=PomBase
To get started as a new community member, you can:

- **Join the pombe mailing list** with more than 1300 subscribers, where you can ask and answer questions about fission yeast generally, get notifications about ${database_name} updates and get invitations to the monthly online seminar PombeTalks. [Join here](https://lists.cam.ac.uk/sympa/suboptions/ucam-pombelist).
- **Join the pombe Slack channel,** to get in touch with other fellow *${genus_and_species}* researchers. See the instructions to join [here](https://www.pombase.org/faq/how-can-i-join-pombeslack). If this is your first time using Slack, you can get started with [this guide](https://www.youtube.com/watch?v=RRxQQxiM7AA).
- Read the basics about *${genus_and_species}* biology and experimental methods in the [Forsburg Lab website](https://dornsife.usc.edu/pombenet/about-pombe/).
- Read about the history and importance of *${genus_and_species}* as a model system [PMC4896181](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4896181/) and a primer introducing genetic and bioinformatic tools: [PMC4596657](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4596657/)

%%end db=PomBase

%%if db=JaponicusDB
Visit our [community section](/community).
%%end db=JaponicusDB

For ${database_name} help you can read our [Frequently Asked Questions](/faq) or send us an email at [${helpdesk_address}](mailto:${helpdesk_address}).

If you use Pombase for your research, please cite or acknowledge the resource in your publications. This is extremely important to indicate the importance of resources to funders.
%%if db=JaponicusDB
[How to cite ${database_name}](/about/citing-japonicusdb).
%%end db=JaponicusDB
%%if db=PomBase
[How to cite ${database_name}](/about/citing-pombase).
%%end db=PomBase

## Types of pages in ${database_name}

${database_name} is centred around **Gene Pages** so this is a good place to begin to familiarise yourself with how data is organised. You should visit your favourite gene page, but for this example we are using pol1, the DNA polymerase alpha catalytic subunit. You can access the page by typing the gene name (i.e. pol1) into the search box at the top-right of the website, or at this
%%if db=PomBase
[link](https://www.pombase.org/gene/SPAC3H5.06c).
%%end db=PomBase
%%if db=JaponicusDB
[link](https://www.japonicusdb.org/gene/SJAG_05239).
%%end db=JaponicusDB

At the top of the page, you will find some basic information about the locus and gene product. Immediately below is a view of the genomic context of the gene in the JBrowse genome browser. (documentation to access browser data tracks is [here](/documentation/JBrowse_quick_start)):

![Top of gene page](assets/gene_page_top_part.png "Top of the gene page"){width="700"}

<details>
<summary>
Read more about the names of genes…
</summary>
<p>The same gene may be known by different names. In ${database_name},
we consider three types:</p>
<ul>
<li><strong>Systematic ID</strong>, a unique identifier that represents
exclusively this gene in <em>${genus_and_species}</em>.</li>
<li><strong>Gene standard name,</strong> the most commonly used name of
this gene, that may not be exclusive to pombe, and could even be used as
a synonym of other fission yeast genes. This name will frequently be the
same as the orthologous gene in <em>S. cerevisiae</em>, (the ortholog of
pol1 in <em>S. cerevisiae</em> is also called pol1), but be aware there
are many notable examples where the same name is used for different
genes in other species. Some genes don’t yet have a standard name, but
if you study them you can <a
href="/submit-data/gene-naming-guidelines">name them</a>.</li>
<li><strong>Synonyms,</strong> alternative names for this gene that have
been used in the literature before. We encourage you to use the standard
name in publications where possible.</li>
</ul>
</details>

On the left side of the **Gene Page**, there is a menu listing the sections in the page (GO molecular function, GO biological process, etc.). Each section contains different kinds of annotations. Go through them and click on the <img src="/assets/info_icon.svg" style="width: 1em"/> button to see what information is displayed in each section. Most sections show a “summary view” of the experimentally relevant information so that it is easier to consume the biological context. The “Show details” link uncollapses the section to show important associated information such as evidence and provenance, often presenting multiple sources supporting the same annotation. You also will notice that many of the displayed annotations are blue and link to other types of pages:

- **GO term pages**: contain the **definition** of the GO term and lists all the **genes annotated to a specific GO term** and its “child” terms.
    <details>
    <summary>
    Read more…
    </summary>
    <ul>
    <li>GO annotations <strong>link</strong> <strong>a gene to a GO
    term</strong> that describes the molecular function(s) of its gene
    products, the process(es) they are involved in their localisation in the
    cell or their presence in macromolecular complexes.</li>
    <li>A term name may change over time, but if the <em>meaning</em> of a
    definition changes the term must be obsoleted, and the associated genes
    reannotated to the correct definition. This makes the term definition
    critical and curators must always ensure that the definition is
    appropriate for the annotation.</li>
    <li>A GO term can be linked to several parent terms through
    relationships. Let’s take the term <a
    href="https://www.ebi.ac.uk/QuickGO/term/GO:0001055">GO:0001055</a> (RNA
    polymerase II activity), graph below.
    <ul>
    <li>RNA polymerase II activity is a GO molecular function.</li>
    <li>This activity is a specific type of <a
    href="https://www.ebi.ac.uk/QuickGO/term/GO:0003899">GO:0003899</a>
    (DNA-directed 5’-3’ RNA polymerase activity), so <a
    href="https://www.ebi.ac.uk/QuickGO/term/GO:0001055">GO:0001055</a> is
    linked to <a
    href="https://www.ebi.ac.uk/QuickGO/term/GO:0003899">GO:0003899</a>
    through an <strong>is_a</strong> relationship.</li>
    <li>This activity is part of the GO biological process <a
    href="https://www.ebi.ac.uk/QuickGO/term/GO:0006366">GO:0006366</a>
    (Transcription by RNA polymerase II), so <a
    href="https://www.ebi.ac.uk/QuickGO/term/GO:0001055">GO:0001055</a> is
    linked to <a
    href="https://www.ebi.ac.uk/QuickGO/term/GO:0006366">GO:0006366</a>
    through a <strong>part_of</strong> relationship.</li>
    <li>This activity occurs at the GO cellular component <a
    href="https://www.ebi.ac.uk/QuickGO/term/GO:0000785">GO:0000785</a>
    (chromatin) so <a
    href="https://www.ebi.ac.uk/QuickGO/term/GO:0001055">GO:0001055</a> is
    linked to <a
    href="https://www.ebi.ac.uk/QuickGO/term/GO:0000785">GO:0000785</a>
    through a <strong>occurs_in</strong> relationship. <img
    src="assets/getting_started_go_tree.png"
    title="AmiGO ontology relationship tree for GO:0001055" width="500"
    alt="AmiGO ontology relationship tree for GO:0001055" /></li>
    </ul></li>
    <li>In ${database_name} GO term pages, for simplicity we do not present
    inter-ontology links and only link to children and parent terms of the
    same ‘aspect’ (i.e molecular function, biological process, cellular
    component) these include terms related to each other by the
    relationships is_a, part_of and the 3 ‘regulates’ relationships. For
    instance, in the page of GO molecular function <a
    href="https://www.pombase.org/term/GO:0003899">GO:0003899</a>
    (DNA-directed 5’-3’ RNA polymerase activity):
    <ul>
    <li>We include <a
    href="https://www.pombase.org/term/GO:0001055">GO:0001055</a> (RNA
    polymerase II activity), which is also a GO molecular function, linked
    to GO:0003899 through an <strong>is_a</strong> relationship</li>
    <li>We do not include the cellular component <a
    href="https://www.pombase.org/term/GO:0000428">GO:0000428</a>, linked to
    the molecular function GO:0003899 through a <strong>capable_of</strong>
    relationship.</li>
    <li>If you expand a term by clicking on the ‘+’ icon on its left, you
    can see the relationship to the term in the current page.</li>
    </ul></li>
    <li>Learn more about GO, its development and use in analyses in <a
    href="https://www.youtube.com/watch?v=6Am2VMbyTm4">this webinar</a> by
    former PomBase curator Antonia Lock.</li>
    </ul>
    </details>

- **Phenotype pages** the Fission Yeast Phenotype Ontology (FYPO) term pages: provide the phenotype **definition** and list all the **genotypes annotated to a FYPO term** and its 'child’ terms, as well as link to the parent terms. Read more…
    <details>
    <summary>
    Read more…
    </summary>
    <ul>
    <li>As for GO, the simplest relationship between FYPO terms is
    <strong>is_a</strong>, in which the child term describes a more specific
    phenotype than the parent. For example, <a
    href="https://www.pombase.org/term/FYPO:0006885">FYPO:0006885</a>
    (decreased protein level at mitotic spindle) <strong>is_a</strong> <a
    href="https://www.pombase.org/term/FYPO:0001324">FYPO:0001324</a>
    (decreased protein level during vegetative growth), which in turn
    <strong>is_a</strong> <a
    href="https://www.pombase.org/term/FYPO:0001325">FYPO:0001325</a>
    (altered protein level during vegetative growth).</li>
    <li>Other relationships also exist, such as <strong>output_of</strong>,
    which links a given phenotype to another that causes it. For example, <a
    href="https://www.pombase.org/term/FYPO:0000118">FYPO:0000118</a>
    (multiseptate vegetative cell) is <strong>output_of</strong> <a
    href="https://www.pombase.org/term/FYPO:0000032">FYPO:0000032</a>
    (abnormal cytokinesis). Therefore, in the page of <a
    href="https://www.pombase.org/term/FYPO:0000032">FYPO:0000032</a>, the
    annotations of <a
    href="https://www.pombase.org/term/FYPO:0000118">FYPO:0000118</a> are
    also displayed.</li>
    <li>Read more about FYPO, our phenotype ontology here.</li>
    </ul>
    </details>

- **Genotype pages:** contain all the **phenotypes associated with a genotype** as well as the alleles that constitute that genotype. Example: [mal3delta](https://www.pombase.org/genotype/mal3delta).

- **Other ontology term pages**. [Read more](https://www.pombase.org/documentation/ontology-term-page)

## Advanced search / query builder

You can query ${database_name} annotations using a Graphical User Interface, the “Advanced search” ([https://www.pombase.org/query](https://www.pombase.org/query)). You can make lists of genes that satisfy a certain condition, and perform operations with these lists. Below some examples:

<p>Disease-associated genes that give a cytoskeleton phenotype in
<em>${genus_and_species}</em>:</p>
<details>
<summary>
Read how to make this query…
</summary>
<ul>
<li>Get the list of all disease-associated genes:
<ul>
<li>Click on <em>Commonly used queries &gt; All disease associated
genes.</em></li>
</ul></li>
<li>Get the list of all genes annotated with a cytoskeleton phenotype:
<ul>
<li>Click on <em>Phenotype</em></li>
<li>Type “abnormal cytoskeleton” and select FYPO:0002397.</li>
<li>Click on <em>Submit</em></li>
</ul></li>
<li>You should see two queries in the <em>Combine queries</em> table
below named “genes annotated with”abnormal cytoskeleton” […]” and ”All
disease associated genes”. Select both by clicking on the tickbox on the
left.</li>
<li>Then click on <em>intersect / and</em>. This will generate an
intersection of both lists (genes present in both) with genes that
satisfies both conditions.</li>
<li>The number in the “Results” column is the number of genes that
satisfy those conditions. Click on it to see the lists of genes.</li>
<li>In that page, you can choose the columns to be displayed, and export
your data for further usage.</li>
</ul>
</details>
<p>Genes that locate to the Golgi apparatus or the endoplasmic reticulum
and cause an exocytosis or endocytosis phenotype.</p>
<details>
<summary>
Read how to make this query…
</summary>
<ul>
<li>Get the list of all genes that have annotations saying that one of
their gene products locates to the Golgi apparatus (they are annotated
to GO:0005794, “Golgi apparatus”):
<ul>
<li>Click on <em>GO</em></li>
<li>Type “Golgi apparatus” and select GO:0005794.</li>
<li>Click on Submit</li>
</ul></li>
<li>Get the list of all genes that have annotations saying that one of
their gene products locates to the endoplasmic reticulum (they are
annotated to GO:0005783, “endoplasmic reticulum”).
<ul>
<li>Click on <em>GO</em></li>
<li>Type “endoplasmic reticulum” and select GO:0005783.</li>
<li>Click on Submit</li>
</ul></li>
<li>In the <em>Combine queries</em> table below, select both <em>genes
annotated with “Golgi apparatus”</em> and <em>genes annotated with
“endoplasmic reticulum”</em> by clicking on the tickbox on the
left.</li>
<li>Then click on <em>Union / or</em>. This will generate a union of
both lists (genes present in either of the lists) with genes that
satisfy either condition.</li>
<li>Get the list of all genes annotated with an exocytosis phenotype:
<ul>
<li>Click on <em>Phenotype</em></li>
<li>Type “abnormal exocytosis” and select FYPO:0007873</li>
<li>Click on <em>Submit</em></li>
</ul></li>
<li>Get the list of all genes annotated with an endocytosis phenotype:
<ul>
<li>Click on <em>Phenotype</em></li>
<li>Type “abnormal endocytosis” and select FYPO:0003886</li>
<li>Click on <em>Submit</em></li>
</ul></li>
<li>Do a union of the phenotype lists, as for the GO terms.</li>
<li>Still in the <em>Combine queries</em> table, select both union
lists, and click on <em>intersect / and</em>. This will generate an
intersection of both lists (genes present in both) with genes that
satisfies both conditions.</li>
<li>The number in the “Results” column is the number of genes that
satisfy those conditions. Click on it to see the lists of genes.</li>
<li>In that page, you can choose the columns to be displayed, and export
your data for further usage.</li>
</ul>
</details>

Full documentation of advanced search can be found [here](/documentation/advanced-search).

## Other useful links

- [Documentation page](/documentation)
- [Hosted datasets](/datasets)
- [Frequently Asked Questions](/faq)
