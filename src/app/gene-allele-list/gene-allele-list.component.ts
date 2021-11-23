import { Component, OnInit, Input } from '@angular/core';

import { ActivatedRoute, Params } from '@angular/router';

import { GeneDetails, PombaseAPIService, GenotypeShort,


         AlleleShort } from '../pombase-api.service';

class AlleleSection {
  public nameAndDescription: string;

  constructor(public alleleUniquename: string,
              public alleleName: string,
              public alleleDescription: string,
              public alleleType: string,
              public expressedAlleles: Array<ExpressedAlleleSection>) {
    let name = this.alleleName;
    if (!name) {
      name = 'unknown';
    }

    let description = this.alleleDescription;

    if (!description) {
      description = 'unknown';
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

      const alleleName = alleleMap[alleleUniquename].name;
      const alleleDescription = alleleMap[alleleUniquename].description;
      const alleleType = alleleMap[alleleUniquename].allele_type;

      const alleleSection =
        new AlleleSection(alleleUniquename, alleleName, alleleDescription, alleleType,
                          expressedAlleleSections);
      this.alleleTable.push(alleleSection);
    }

    this.alleleTable.sort((a, b) => {
      if (a.alleleType === b.alleleType) {
        return a.nameAndDescription.localeCompare(b.nameAndDescription);
      } else {
        return a.alleleType.localeCompare(b.alleleType);
      }
    })
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
