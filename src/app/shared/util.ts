import { SolrAlleleSummary } from '../complete.service';
import { GenotypeDetails, GenotypeShort, GeneShort,
         AlleleShort, TranscriptDetails} from '../pombase-api.service';
import { TermId } from '../pombase-query';

export type TextOrTermId = {
  text?: string;
  termid?: TermId;
}
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

  static safeCompare(str1?: string|number|Array<string>,
                     str2?: string|number|Array<string>, options?: any) {
    if (str1) {
      if (str2) {
        if (typeof(str1) === 'number' && typeof(str1) === 'number') {
          return (str1 as number) - (str2 as number);
        } else {
          if (options && options['numeric']) {
            let num1 = Number(str1);
            if (Number.isNaN(num1)) {
              num1 = -1e99;
            }
            let num2 = Number(str2);
            if (Number.isNaN(num2)) {
              num2 = -1e99;
            }
            return num1 - num2;
          } else {
            if (str1 instanceof Array) {
              str1 = str1.join(',');
            }
            if (str2 instanceof Array) {
              str2 = str2.join(',');
            }
            return str1.localeCompare(str2 as string, undefined, options);
          }
        }
      } else {
        return -1;
      }
    } else {
      if (str2) {
        return 1;
      } else {
        return 0;
      }
    }
  }

  static genotypeCompare(genotype1: GenotypeShort, genotype2: GenotypeShort): number {
    return genotype1.displayNameLong.localeCompare(genotype2.displayNameLong);
  }

  static genotypeDisplayName(genotypeDetails: GenotypeDetails|GenotypeShort): string {
    if (genotypeDetails) {
      return genotypeDetails.loci
        .map(locus => {
          return locus.expressed_alleles.map(expressedAllele => {
            const alleleDisplayName = this.alleleDisplayName(expressedAllele.allele);
            if (expressedAllele.expression &&
                expressedAllele.allele.allele_type !== 'deletion' &&
                !expressedAllele.expression.startsWith('Not assayed')) {
              return `${alleleDisplayName}[${expressedAllele.expression}]`;
            } else {
              return alleleDisplayName;
            }
          })
          .join('/');
        })
        .join(' ');
    } else {
      return 'UNKNOWN';
    }
  }

  static tidyAlleleName(alleleName?: string): string {
    let name = alleleName || 'unnamed';
    name = name.replace(/delta/g, 'Δ');
    return name;
  }

  static descriptionWithResidueType(allele: AlleleShort|SolrAlleleSummary): string {
    let description = allele.description;
    const alleleType = allele.allele_type;

    if (!description || !alleleType) {
      return 'unknown';
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

  static alleleDisplayName(allele: AlleleShort|SolrAlleleSummary): string {
    let name = Util.tidyAlleleName(allele.name);
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
        if (alleleType.match(/amino.acid/)) {
          return name + '(aa)';
        } else {
          if (alleleType.match(/nucleotide/)) {
            return name + '(nt)';
          } else {
            return name;
          }
        }
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

  static randNElements<T>(arr: Array<T>, count: number): Array<T> {
    if (count > arr.length) {
      return arr;
    }
    const wrapped = arr.concat(arr);
    const pos = Util.randInt(arr.length);
    return wrapped.slice(pos, pos+count);
  }

  static productStringOfTranscript(transcript: TranscriptDetails): string {
    const protein = transcript.protein;

    if (protein) {
      const proteinSequenceLength = protein.number_of_residues;
      const weight = Math.round(protein.molecular_weight * 100) / 100.0;
      return proteinSequenceLength + ' aa, ' + weight + ' kDa';
    } else {
      return transcript.sequence.length + ' nt';
    }
  }

  static capitalize(input: string): string {
    return input.charAt(0).toUpperCase() + input.slice(1);
  }

  static transcriptStructureAsString(transcript: TranscriptDetails): string {
    let ret = '';

    const transcriptLoc = transcript.location;

    if (transcriptLoc.strand == 'reverse') {
      ret += 'complement(';
    }

    const codingExonCount =
          transcript.parts.filter(part => part.feature_type === 'exon').length;

    if (codingExonCount > 1) {
      ret += 'join(';
    }

    const partCoords = transcript.parts
      .filter(part => part.feature_type == 'exon')
      .map((part) => {
        return part.location.start_pos + '..' + part.location.end_pos;
      });

    ret += partCoords.join(',');

    if (codingExonCount > 1) {
      ret += ')';
    }

    if (transcriptLoc.strand == 'reverse') {
      ret += ')';
    }

    return ret;
  }

  static splitDescription(description: string, termids: Array<TermId>): Array<TextOrTermId> {
    if (termids.length == 0) {
      return [{ text: description }];
    }

    const termidRe = new RegExp('(' + termids.join('|') + ')');

    const descriptionBits = description.split(termidRe);

    return descriptionBits.map(bit => {
      const index = termids.indexOf(bit);
      if (index === -1) {
        return {
          text: bit,
        };
      } else {
        return {
          termid: bit,
        };
      }
    });
  }
}
