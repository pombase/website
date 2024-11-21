import { Component, OnInit, Input } from '@angular/core';

import { ActivatedRoute, Params } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';

import { TermDetails, GeneShort, PombaseAPIService } from '../pombase-api.service';
import { AppConfig, getAppConfig } from '../config';

@Component({
    selector: 'app-term-single-gene-genotypes-view',
    templateUrl: './term-single-gene-genotypes-view.component.html',
    styleUrls: ['./term-single-gene-genotypes-view.component.css'],
    standalone: false
})
export class TermSingleGeneGenotypesViewComponent implements OnInit {
  @Input() termDetails: TermDetails;

  appConfig: AppConfig = getAppConfig();

  singleLocusGenotypeGenes: Array<GeneShort> = [];

  constructor(private pombaseApiService: PombaseAPIService,
              private route: ActivatedRoute,
              private titleService: Title,
              private meta: Meta) { }

  setPageTitle(): void {
    let title = this.appConfig.site_name;
    let displayName;
    if (this.termDetails) {
      displayName = 'Genes from single locus genotypes annotated with ' +
        this.termDetails.termid + ' - ' + this.termDetails.name;
    } else {
      displayName = 'UNKNOWN';
    }
    this.titleService.setTitle(title + ' - ' + displayName);
    this.meta.updateTag({property: 'og:title', content: title});
    this.meta.updateTag({property: 'description', content: title});
  }

  setGenes(): void {
    this.pombaseApiService.getGeneSummaryMapPromise()
      .then(geneSummaryMap => {
        this.singleLocusGenotypeGenes = [];

        let genes: { [key: string]: GeneShort } = {};

        for (let genotype of this.termDetails.single_locus_genotypes) {
          let gene = genotype.loci[0].expressed_alleles[0].allele.gene;
          if (gene) {
            genes[gene.uniquename] = gene;
          }
        }

        for (let geneUniquename of Object.keys(genes)) {
          this.singleLocusGenotypeGenes.push(geneSummaryMap[geneUniquename]);
        }
      })
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
