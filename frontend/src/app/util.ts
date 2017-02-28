import { GenotypeDetails, GenotypeShort, GeneShort,
         AlleleShort } from './pombase-api.service';

export class Util {

  static geneCompare(gene1: GeneShort, gene2: GeneShort): number {
    if (gene1.name) {
      if (gene2.name) {
        return gene1.name.localeCompare(gene2.name);
      } else {
        return -1;
      }
    } else {
      if (gene2.name) {
        return 1;
      } else {
        return gene1.uniquename.localeCompare(gene2.uniquename);
      }
    }
  }

  static displayNameLong(genotypeDetails: GenotypeDetails|GenotypeShort): string {
    if (genotypeDetails) {
      return genotypeDetails.expressed_alleles
        .map((expressedAllele) => {
          return this.alleleDisplayName(expressedAllele.allele);
        })
        .join(" ");
    } else {
      return "UNKNOWN";
    }
  }

  static alleleDisplayName(allele: AlleleShort): string {
    let name = allele.name || 'unnamed';
    name = name.replace(/delta$/, '&Delta;');
    let description = allele.description || '';
    let alleleType = allele.allele_type || 'unknown';

    if (alleleType == 'deletion' && name.match(/(delta|&Delta;)$/) ||
        alleleType.match(/^wild[\s_]?type$/) && name.match(/\+$/)) {
      let normalisedDescription = description.replace(/[\s_]+/, '');
      let normalisedAlleleType = alleleType.replace(/[\s_]+/, '');
      if (description && normalisedDescription != normalisedAlleleType) {
        return `${name}(${description})`;
      } else {
        return name;
      }
    }

    if (!description) {
      description = alleleType || 'unknown';
    }

    if (alleleType.match(/^mutation/)) {
      if (alleleType.match(/amino acid/)) {
        description.replace(/(^|,\s*)/g,
                            function(match, p1) {
                              return p1 + 'aa';
                            });
      } else {
        if (alleleType.match(/nucleotide/)) {
          description.replace(/(^|,\s*)/,
                              function(match, p1) {
                                return p1 + 'nt';
                              });
        }
      }
    }
    return `${name}(${description})`;
  }

}
