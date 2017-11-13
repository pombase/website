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
        return gene1.uniquename.localeCompare(gene2.uniquename);
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
        return this.geneCompare(gene1, gene2);
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
          return this.alleleDisplayName(expressedAllele.allele);
        })
        .join(' ');
    } else {
      return 'UNKNOWN';
    }
  }

  static alleleDisplayName(allele: AlleleShort): string {
    let name = allele.name || 'unnamed';
    name = name.replace(/delta/, 'Δ');
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

    if (!description) {
      description = alleleType || 'unknown';
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
    let lookup = {'A': 'T', 'T': 'A', 'G': 'C', 'C': 'G'};

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
