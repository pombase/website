import { GenotypeDetails, GenotypeShort, GeneShort,
         AlleleShort } from '../pombase-api.service';

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
        if (gene1.uniquename && gene2.uniquename) {
          return gene1.uniquename.localeCompare(gene2.uniquename);
        } else {
          return 0;
        }
      }
    }
  }

  static geneProductCompare(gene1: GeneShort, gene2: GeneShort) {
    if (gene1.product) {
      if (gene2.product) {
        return gene1.product.localeCompare(gene2.product);
      } else {
        return -1;
      }
    } else {
      if (gene2.product) {
        return 1;
      } else {
        return Util.geneCompare(gene1, gene2);
      }
    }
  }

  static genotypeCompare(genotype1: GenotypeShort, genotype2: GenotypeShort): number {
    return genotype1.displayNameLong.localeCompare(genotype2.displayNameLong);
  }

  static displayNameLong(genotypeDetails: GenotypeDetails|GenotypeShort): string {
    if (genotypeDetails) {
      return genotypeDetails.expressed_alleles
        .map((expressedAllele) => {
          const alleleDisplayName = this.alleleDisplayName(expressedAllele.allele);
          if (expressedAllele.expression &&
              expressedAllele.allele.allele_type !== 'deletion' &&
              expressedAllele.expression !== 'Not assayed') {
            return `${alleleDisplayName}[${expressedAllele.expression}]`;
          } else {
            return alleleDisplayName;
          }
        })
        .join(' ');
    } else {
      return 'UNKNOWN';
    }
  }

  static tidyAlleleName(allele: AlleleShort): string {
    let name = allele.name || 'unnamed';
    name = name.replace(/delta/, 'Δ');
    return name;
  }

  static descriptionWithResidueType(allele: AlleleShort): string {
    let description = allele.description;
    const alleleType = allele.allele_type;

    if (!description || !alleleType) {
      return description;
    }

    if (alleleType.match(/mutation$/)) {
      if (description.match(/\w+\d+\w+$/)) {
        if (alleleType.match(/amino.acid/)) {
          description += ' aa';
        } else {
          if (alleleType.match(/nucleotide/)) {
            description += ' nt';
          }
        }
      }
    }

    return description;
  }

  static alleleDisplayName(allele: AlleleShort): string {
    let name = Util.tidyAlleleName(allele);
    let description = allele.description || '';
    let alleleType = allele.allele_type || 'unknown';

    if (alleleType === 'deletion' && name.match(/(Δ|delta|&Delta;)$/) ||
        alleleType.match(/^wild[\s_]?type$/) && name.match(/\+$/)) {
      let normalisedDescription = description.replace(/[\s_]+/, '');
      let normalisedAlleleType = alleleType.replace(/[\s_]+/, '');
      if (description && normalisedDescription !== normalisedAlleleType) {
        return `${name}(${description})`;
      } else {
        return name;
      }
    }

    if (description) {
      if (name.includes(description)) {
        return name;
      }

      description = Util.descriptionWithResidueType(allele);
    } else {
      description = alleleType || 'unknown';
    }

    if (alleleType.startsWith('partial') &&
        description.match(/\d+$/)) {
      if (alleleType.match(/^partial.amino.acid.deletion$/)) {
        description += ' Δaa';
      } else {
        if (alleleType.match(/^partial.nucleotide.deletion$/)) {
          description += ' Δnt';
        }
      }
    }

    return `${name}(${description})`;
  }

  static splitSequenceString(seq: string): string {
    return seq.replace(/(.{60})(?=.)/g, '$1\n');
  }

  static reverseComplement(seq: string): string {
    let lookup: { [base: string]: string } = {'A': 'T', 'T': 'A', 'G': 'C', 'C': 'G'};

    return seq.split('').reverse().map(base => {
      return base.replace(/([agct])/i, function ($0) {
        return lookup[$0] || 'N';
      });
    }).join('');
  }

  static randInt(upperBound: number): number {
    return Math.floor(Math.random() * upperBound);
  }

  static randElement<T>(arr: Array<T>): T {
    return arr[Util.randInt(arr.length)];
  }
}
