import { Component, OnInit, Input } from '@angular/core';

import { ActivatedRoute, Params } from '@angular/router';

import { GeneDetails, PombaseAPIService, GenotypeShort,


         AlleleShort } from '../pombase-api.service';
import { Util } from '../shared/util';

class AlleleSection {
  public nameAndDescription: string;

  constructor(public alleleUniquename: string,
              public alleleName: string,
              public alleleDescription: string,
              public alleleType: string,
              public expressedAlleles: Array<ExpressedAlleleSection>) {
    this.alleleName = Util.tidyAlleleName(alleleName);

    let description = this.alleleDescription;

    if (!description) {
      description = 'unknown';
      this.alleleDescription = '';
    }

    this.nameAndDescription = name + '(' + description + ')';
  }

  expressedAlleleCount(): number {
    return this.expressedAlleles.length;
  }

  genotypeCount(): number {
    let count = 0;

    for (const expressedAllele of this.expressedAlleles) {
      count += expressedAllele.genotypes.length;
    }

    return count;
  }
}

class ExpressedAlleleSection {
  constructor(public expression: string, public genotypes: Array<GenotypeShort>) {

  }
}

type ExpressedAllelemap = { [expression: string]: Array<GenotypeShort> };
type AlleleMap = { [alleleUniquename: string]: ExpressedAllelemap };

@Component({
  selector: 'app-gene-allele-list',
  templateUrl: './gene-allele-list.component.html',
  styleUrls: ['./gene-allele-list.component.css']
})
export class GeneAlleleListComponent implements OnInit {
  @Input() geneDetails: GeneDetails;

  alleleTable: Array<AlleleSection>;
  sortByColumnName: string = 'type';

  genotypeVisible: { [key: string ]: boolean } = {};

  constructor(private pombaseApiService: PombaseAPIService,
              private route: ActivatedRoute) { }

  genotypesVisible(allele: AlleleSection): boolean {
    return !!this.genotypeVisible[allele.alleleUniquename];
  }

  anyVisibleGenotypes(): boolean {
    return Object.keys(this.genotypeVisible).length > 0;
  }

  showGenotypes(allele: AlleleSection): void {
    this.genotypeVisible[allele.alleleUniquename] = true;
  }

  showAllGenotypes(): void {
    for (const allele of this.alleleTable) {
      this.genotypeVisible[allele.alleleUniquename] = true;
    }
  }

  hideAllGenotypes(): void {
    this.genotypeVisible = {};
  }

  alleleRowspan(allele: AlleleSection): number {
    if (this.genotypesVisible(allele)) {
      return allele.genotypeCount();
    } else {
      return 1;
    }
  }

  sortBy(columnName: 'name'|'description'|'type'): void {
    this.sortByColumnName = columnName;

    this.sortTable();
  }

  sortTable(): void {
    if (this.sortByColumnName == 'type') {
      this.alleleTable.sort((a, b) => {
        if (a.alleleType === b.alleleType) {
          return a.nameAndDescription.localeCompare(b.nameAndDescription);
        } else {
          return a.alleleType.localeCompare(b.alleleType);
        }
      });
    } else {
      this.alleleTable.sort((a, b) => {
        let result;

        if (this.sortByColumnName === 'name') {
          result = a.alleleName.localeCompare(b.alleleName);
        } else {
          if (a.alleleDescription.length == 0 && b.alleleDescription.length == 0) {
            result = 0;
          } else {
            if (a.alleleDescription.length == 0) {
              // missing / blank description sort last
              result = 1;
            } else {
              if (b.alleleDescription.length == 0) {
                return -1
              } else {
                result = a.alleleDescription.localeCompare(b.alleleDescription);
              }
            }
          }
        }

        if (result === 0) {
          result = a.alleleType.localeCompare(b.alleleType);
        }

        return result;
      })

    }
  }

  makeAlleleTable(): void {
    this.alleleTable = [];

    const alleleExpressionGenotypeMap: AlleleMap = {};

    const alleleMap: { [alleleUniquename: string]: AlleleShort } = {};

  GENOTYPE:
    for (const genotypeUniquename of Object.keys(this.geneDetails.genotypes_by_uniquename)) {
      const genotypeShort = this.geneDetails.genotypes_by_uniquename[genotypeUniquename];

      for (const locus of genotypeShort.loci) {
        for (const expressedAllele of locus.expressed_alleles) {
          const allele = expressedAllele.allele;

          if (allele.gene_uniquename !== this.geneDetails.uniquename) {
            continue GENOTYPE;
          }

          if (!alleleMap[allele.uniquename]) {
            alleleMap[allele.uniquename] = allele;
          }

          if (!alleleExpressionGenotypeMap[allele.uniquename]) {
            alleleExpressionGenotypeMap[allele.uniquename] = {};
          }

          const expressedAlleleMap = alleleExpressionGenotypeMap[allele.uniquename];

          if (!expressedAlleleMap[expressedAllele.expression]) {
            expressedAlleleMap[expressedAllele.expression] = [];
          }

          expressedAlleleMap[expressedAllele.expression].push(genotypeShort);
        }
      }
    }

    for (const [alleleUniquename, expressedAlleleMap] of Object.entries(alleleExpressionGenotypeMap)) {
      const expressedAlleleSections = [];
      for (const [expression, genotypes] of Object.entries(expressedAlleleMap)) {
        expressedAlleleSections.push(new ExpressedAlleleSection(expression, genotypes));
      }

      expressedAlleleSections.sort((a, b) =>
        a.expression.localeCompare(b.expression)
      );

      const alleleShort = alleleMap[alleleUniquename];

      const alleleName = alleleShort.name;
      const alleleDescription = alleleShort.description;
      const alleleType = alleleShort.allele_type;

      const alleleSection =
        new AlleleSection(alleleUniquename, alleleName, alleleDescription, alleleType,
                          expressedAlleleSections);
      this.alleleTable.push(alleleSection);
    }

    this.sortTable();
  }

  ngOnInit(): void {
    this.route.params.forEach((params: Params) => {
      if (params['uniquename'] !== undefined) {
          let uniquename = params['uniquename'];

          this.pombaseApiService.getGene(uniquename)
            .then(geneDetails => {
              this.geneDetails = geneDetails;

              this.makeAlleleTable();
            });
      }
    })
  }
}
