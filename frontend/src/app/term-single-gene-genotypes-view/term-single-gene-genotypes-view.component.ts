import { Component, OnInit, Input } from '@angular/core';

import { ActivatedRoute, Params } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { TermDetails, GeneShort, PombaseAPIService } from '../pombase-api.service';

@Component({
  selector: 'app-term-single-gene-genotypes-view',
  templateUrl: './term-single-gene-genotypes-view.component.html',
  styleUrls: ['./term-single-gene-genotypes-view.component.css']
})
export class TermSingleGeneGenotypesViewComponent implements OnInit {
  @Input() termDetails: TermDetails;

  singleAlleleGenotypeGenes: Array<GeneShort> = [];

  constructor(private pombaseApiService: PombaseAPIService,
              private route: ActivatedRoute,
              private titleService: Title
             ) { }

  setPageTitle(): void {
    let title = this.titleService.getTitle();
    let displayName;
    if (this.termDetails) {
      displayName = this.termDetails.termid + " - " + this.termDetails.name +
        " - genes from single allele genotypes";
    } else {
      displayName = "UNKNOWN";
    }
    this.titleService.setTitle(title + " - " + displayName);
  }

  setGenes(): void {
    let genes = {};

    for (let genotype of this.termDetails.single_allele_genotypes) {
      let gene = genotype.expressed_alleles[0].allele.gene;
      genes[gene.uniquename] = gene;
    }

    for (let geneUniquename of Object.keys(genes)) {
      this.singleAlleleGenotypeGenes.push(genes[geneUniquename]);
    }
  }

  ngOnInit() {
    this.route.params.forEach((params: Params) => {
      if (params['termid'] !== undefined) {
        let termid = params['termid'];
        this.pombaseApiService.getTerm(termid)
              .then(termDetails => {
                this.termDetails = termDetails;
                this.setPageTitle();
                this.setGenes();
              });
      };
    });
  }
}
