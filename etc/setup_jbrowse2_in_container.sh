#!/bin/sh -

# Create a JBrowse2 instance instead the website container and populate tracks

jbrowse create jbrowse2
jbrowse add-assembly https://www.pombase.org/internal_datasets/bgzip_chromosomes/Schizosaccharomyces_pombe_all_chromosomes.fa.gz --name pombe_v1 --type bgzipFasta --out jbrowse2

cd jbrowse2

jbrowse add-track /pombase/gff/Schizosaccharomyces_pombe_all_chromosomes_forward_strand.gff3 --load copy --name "Forward strand" --category "Genes" --config '{"renderer": {"type": "SvgFeatureRenderer"}}'
jbrowse add-track /pombase/gff/Schizosaccharomyces_pombe_all_chromosomes_reverse_strand.gff3 --load copy --name "Reverse strand" --category "Genes" --config '{"renderer": {"type": "SvgFeatureRenderer"}}'

