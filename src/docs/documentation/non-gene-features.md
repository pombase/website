## Non-gene sequence features

### Centromeres

<app-seq-feature-table></app-seq-feature-table>

%%if db=PomBase

Repeats are also shown in the diagram below. To see the repeat
sequences, download the
[contiguated sequence files](${base_url}/latest_release/genome_sequence_and_features/artemis_contigs/)
and view them in Artemis. (See
[this FAQ](/faq/is-there-an-equivalent-to-the-artemis-java-applet-in-pombase) for more
information.)

![Centromere map](assets/centromeremapping.gif){ .screenshot width="779" height="540"}

**Notes:**

  - Recent work by Chad Ellermeier and Gerry Smith suggests that
    there are only 4 +/- 1 copies of the 6760 bp repeat missing from
    chromosome 3

  - This map is a schematic diagram. Distances and overlaps are
    approximate. Please refer to the sequence data to design experimental
    constructs.

  - Centromere map from  Wood *et al.* 2002 The genome sequence of *Schizosaccharomyces pombe*.
    Nature 415(6874):871-80 ([PMID:11859360](http://www.ncbi.nlm.nih.gov/pubmed/11859360)). Created by Rhian Gwilliam.

[cen1]: https://www.pombase.org/jbrowse/?loc=I%3A3753680..3789414&tracks=DNA%2CForward%20strand%20features%2CReverse%20strand%20features&highlight=
[cen2]: https://www.pombase.org/jbrowse/?loc=II%3A1602261..1644744&tracks=DNA%2CForward%20strand%20features%2CReverse%20strand%20features&highlight=
[cen3]: https://www.pombase.org/jbrowse/?loc=III%3A1070899..1136998&tracks=DNA%2CForward%20strand%20features%2CReverse%20strand%20features&highlight=

### Telomeres

The fission yeast complete genome sequence currently stops short of the
telomeric repeats. See the [Sequencing Status](status/sequencing-status) 
page for the current assembly status.

The most proximal anchored cosmids to each telomere are (links
to genome browser):

-   Chromosome I left c212 (coordinates [1-29663][tel1l])
-   Cromosome I right c750 ([5554844-5579133][tel1r])
-   Chromosome II left c1348 ([1-39186][tel2l])
-   Chromosome II right pT2R1 ([4500619-4539800][tel2r])
-   There are no telomere proximal clones for chromosome III as the
    unsequenced rDNA blocks occur in between the sequenced portion and
    the telomeres on both chromosome arms.

Details of all clones used for the assembly, and their order, length and
overlap details is provided in a set of
[spreadsheets](https://www.pombase.org/data/archive/Cosmid_assembly_data/)
available from PomBase.

A contig extending the left arm of Chromosome II was sequenced by
Sasaki *et al.*
([PMID:18727152](http://www.ncbi.nlm.nih.gov/pubmed?term=18727152))
and will be attached to the assembly in the next round of sequence
changes. In the meantime, the contig can be viewed in the
[PomBase genome browser][telgap].

A set of [small insert clones](ftp://ftp.sanger.ac.uk/pub/yeast/sequences/pombe/telomeres/)
(FTP link; also see table) from a telomere plasmid library has been
made available by [Neal Sugawara](mailto:sugawara@hydra.rose.brandeis.edu). None can be
assigned to a chromosome at present.

Plasmid|Size of insert|Location of telomeric sequence|Comments|Vector|Laboratory|Funded by|Stage
-------|--------------|------------------------------|--------|------|----------|---------|-----
pNSU28|approx 1kb| |Lies in pNSU21|pUC19|Hinxton|EC|finished
pNSU31|approx 1kb| |Lies in pNSU21|pUC19|Hinxton|EC|finished
pNSU68|423 bp|Internal|Contains 195 bp of telomeric DNA and 123 bp from the rDNA|pMLC28|Hinxton|EC|finished
pNSU71|15 kb|Terminal| |pMLC28|Hinxton|EC|finished
pNSU64^\*^|6.9 kb|Terminal| |pMLC28|Hinxton|EC|finished
pNSU70|7.1 kb| |pMLC28|Hinxton|EC|finished
pNSU77^\*^|12 kb|Internal|Fusion between telomere sequences (7.1kb) and rDNA sequences (4.9kb)|pMLC28|Hinxton|EC|finished
pNSU21|7.9 kb|Terminal|pNSU21 and pNSU65 were isolated from the first and second library respectively pMLC28|Hinxton|EC|finished
pNSU65|8.1 kb|Terminal|pNSU21 and pNSU65 were isolated from the first and second library respectively pMLC28|Hinxton|EC|finished

**Table notes:**
"Terminal" refers to the position adjacent to the vector sequences of
pMLC12 where the blunt end (SmaI end) ligated to the
telomeric sequences. "Internal" means that an *S. pombe*
sequence intervenes between the telomere and vector sequences.

[tel1l]: https://www.pombase.org/jbrowse/?loc=I%3A1..29664&tracks=DNA%2CForward%20strand%20features%2CReverse%20strand%20features&highlight=
[tel1r]: https://www.pombase.org/jbrowse/?loc=I%3A5554843..5579133&tracks=DNA%2CForward%20strand%20features%2CReverse%20strand%20features&highlight=
[tel2l]: https://www.pombase.org/jbrowse/?loc=II%3A1..39181&tracks=DNA%2CForward%20strand%20features%2CReverse%20strand%20features&highlight=
[tel2r]: https://www.pombase.org/jbrowse/?loc=II%3A4500628..4539804&tracks=DNA%2CForward%20strand%20features%2CReverse%20strand%20features&highlight=
[telgap]: https://www.pombase.org/jbrowse/?loc=chr_II_telomeric_gap%3A2002..18001&tracks=DNA%2CForward%20strand%20features%2CReverse%20strand%20features&highlight=

### Mating type region

The *S. pombe* mating type loci are located on Chromosome 2. The
reference strain 972 h- encodes the M-specific mating genes
[II:2114008-2115135][Mc and Mi] at the expressed mat1 locus. The
silent region mat3M is located at coordinates
[II:2129208-2137121][mat]. Note that the silent mat2P region and cenH
element are deleted in the reference strain.

A contig of the h90 configuration of the mat2P-mat3M region was
created by Xavier Marsellach and Lorena Aguilar (Azorín lab) using
available data and *S. pombe var. kambucha* as a scaffold. The contig
can be viewed in the [genome browser][mat23]. Replacing the Chromosome
2 region spanning coordinates 2129208-2137121 with the separate contig
sequence yields the Chromosome 2 contig of an h90 strain.

For a description of how the mating type specific genes are organized
and annotated in PomBase, see this
[FAQ item](https://www.pombase.org/faq/how-are-mating-type-specific-gene-pages-organized).

[mat]: https://www.pombase.org/jbrowse/?loc=II%3A2129210..2137123&tracks=DNA%2CForward%20strand%20features%2CReverse%20strand%20features&highlight=
[mat23]: https://www.pombase.org/jbrowse/?loc=mating_type_region%3A2013..18114&tracks=DNA%2CForward%20strand%20features%2CReverse%20strand%20features&highlight=
[Mc and Mi]: https://www.pombase.org/jbrowse/?loc=II%3A2114008..2115135&tracks=Forward%20strand%20features%2CReverse%20strand%20features&highlight=

%%end db=PomBase

### View sequence features in Artemis

Sequence features can be downloaded from the
%%if db=PomBase
[data directory](${base_url}/latest_release/genome_sequence_and_features/artemis_contigs/)
%%end db=PomBase
%%if db=JaponicusDB
[data directory](https://www.pombase.org/data/genome_sequence_and_features/artemis_files/)
%%end db=JaponicusDB
and viewed in Artemis.  See
[this FAQ](https://www.pombase.org/faq/is-there-an-equivalent-to-the-artemis-java-applet-in-pombase)
for more information.
