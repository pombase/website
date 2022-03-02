# Can I find promoters in PomBase?
<!-- pombase_categories: Finding data -->

There are very few manually curated promoters in PomBase; they are
included in the forward and reverse strand feature tracks, which are
enabled by default. To search the manually curated promoters, we
suggest that you use Artemis. Follow the instructions in 
[this FAQ](/faq/there-equivalent-artemis-java-applet-pombase), 
and search for features with "Key" = "promoter".

Computationally identified matches to the [DNA binding
sites](https://www.pombase.org/browse-curation/dna-binding-sites)
found in *S. pombe* are available as a data track in PomBase
JBrowse. To launch JBrowse with the track loaded, use [this
link][prom].

The genome browser also includes transcription start site datasets,
such as the CAGE-defined [transcription start sites][tss] across 5
different conditions from [Thodberg *et al.* (2018)](https://www.biorxiv.org/content/early/2018/03/13/281642).

We will also soon add the dataset from Li *et al.* (2015) Genome-wide
analysis of core promoter structures in *Schizosaccharomyces pombe*
with DeepCAGE. RNA Biol. 12:525-37
([PMID:25747261](http://www.ncbi.nlm.nih.gov/pubmed/?term=25747261)),
which was available in the previous version of the PomBase genome browser.

We will also add any new promoter data sets that are submitted to us.


<!-- edit & restore
The PomBase genome browser includes a data track of core promoter
locations from Li *et al.* (2015) Genome-wide analysis of core promoter
structures in *Schizosaccharomyces pombe* with DeepCAGE. RNA Biol.
12:525-37 ([PMID:25747261](http://www.ncbi.nlm.nih.gov/pubmed/?term=25747261)).
-->

[prom]: https://www.pombase.org/jbrowse/?loc=III%3A725762..736349&tracks=Forward%20strand%20features%2CReverse%20strand%20features%2CConsensus%20transcription%20factor%20DNA%20binding%20motifs&highlight=

[tss]: https://www.pombase.org/jbrowse/?loc=II%3A27586..65254&tracks=DNA%20sequence%2CForward%20strand%20features%2CReverse%20strand%20features%2CConsensus%20transcription%20start%20sites%20-%20Thodberg%20et%20al.%20(2018)%2CTranscription%20start%20sites%20during%20heat%20shock%20(forward%20strand)%20-%20Thodberg%20et%20al.%20(2018)%2CTranscription%20start%20sites%20during%20heat%20shock%20(reverse%20strand)%20-%20Thodberg%20et%20al.%20(2018)%2CTranscription%20start%20sites%20during%20nitrogen%20starvation%20(forward%20strand)%20-%20Thodberg%20et%20al.%20(2018)%2CTranscription%20start%20sites%20during%20nitrogen%20starvation%20(reverse%20strand)%20-%20Thodberg%20et%20al.%20(2018)%2CTranscription%20start%20sites%20during%20oxidative%20stress%20(forward%20strand)%20-%20Thodberg%20et%20al.%20(2018)%2CTranscription%20start%20sites%20during%20oxidative%20stress%20(reverse%20strand)%20-%20Thodberg%20et%20al.%20(2018)%2CTranscription%20start%20sites%20in%20YES%20(forward%20strand)%20-%20Thodberg%20et%20al.%20(2018)%2CTranscription%20start%20sites%20in%20YES%20(reverse%20strand)%20-%20Thodberg%20et%20al.%20(2018)%2CTranscription%20start%20sites%20in%20glucose%20minimal%20medium%20(forward%20strand)%20-%20Thodberg%20et%20al.%20(2018)%2CTranscription%20start%20sites%20in%20glucose%20minimal%20medium%20(reverse%20strand)%20-%20Thodberg%20et%20al.%20(2018)&highlight=

