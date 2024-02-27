import { Component, OnInit, Input } from '@angular/core';

import { ActivatedRoute, Params } from '@angular/router';
import { GeneDetails, PombaseAPIService, AlleleShort } from '../pombase-api.service';
import { DeployConfigService } from '../deploy-config.service';

@Component({
  selector: 'app-gene-alleles-page',
  templateUrl: './gene-alleles-page.component.html',
  styleUrls: ['./gene-alleles-page.component.css']
})
export class GeneAllelesPageComponent implements OnInit {
  @Input() geneDetails: GeneDetails;

  deletionAlleles: Array<AlleleShort> = [];
  wildtypeAlleles: Array<AlleleShort> = [];
  otherAlleles: Array<AlleleShort> = [];

  constructor(private pombaseApiService: PombaseAPIService,
              private route: ActivatedRoute,
              public deployConfigService: DeployConfigService) { }

  makeAlleleTables(): void {
    this.deletionAlleles = [];
    this.wildtypeAlleles = [];
    this.otherAlleles = [];

    const seenAlleles: Set<string> = new Set();

    for (const genotypeUniquename of Object.keys(this.geneDetails.genotypes_by_uniquename)) {
      const genotypeShort = this.geneDetails.genotypes_by_uniquename[genotypeUniquename];

      for (const locus of genotypeShort.loci) {
        for (const expressedAllele of locus.expressed_alleles) {
          const allele = expressedAllele.allele;

          if (allele.gene_uniquename !== this.geneDetails.uniquename) {
            continue;
          }

          if (seenAlleles.has(allele.uniquename)) {
            continue;
          }

          seenAlleles.add(allele.uniquename);

          if (allele.allele_type == 'deletion') {
            this.deletionAlleles.push(allele);
          } else {
            if (allele.allele_type == 'wild_type') {
              this.wildtypeAlleles.push(allele);
            } else {
              this.otherAlleles.push(allele);
            }
          }
        }
      }
    }
  }

  ngOnInit(): void {
    this.route.params.forEach((params: Params) => {
      if (params['uniquename'] !== undefined) {
        let uniquename = params['uniquename'];

        this.pombaseApiService.getGene(uniquename)
          .then(geneDetails => {
            this.geneDetails = geneDetails;

            this.makeAlleleTables();
          });
      }
    })
  }
}
