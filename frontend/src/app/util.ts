import { GenotypeDetails, AlleleShort } from './pombase-api.service';

export class Util {

  static displayNameLong(genotypeDetails: GenotypeDetails): string {
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
