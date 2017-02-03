import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { GenotypeDetails, PombaseAPIService } from '../pombase-api.service';

import { getAnnotationTableConfig, AnnotationTableConfig,
         getAppConfig, AppConfig } from '../config';

@Component({
  selector: 'app-genotype-details',
  templateUrl: './genotype-details.component.html',
  styleUrls: ['./genotype-details.component.css']
})
export class GenotypeDetailsComponent implements OnInit {
  @Input() genotypeDetails: GenotypeDetails;

  annotationTypeNames: Array<string> = [];
  config: AnnotationTableConfig = getAnnotationTableConfig();
  appConfig: AppConfig = getAppConfig();
  displayAlleles: Array<any> = [];

  constructor(private pombaseApiService: PombaseAPIService,
              private route: ActivatedRoute,
              private titleService: Title
             ) { }

  displayNameLong(): string {
    if (this.genotypeDetails) {
      return this.genotypeDetails.name || this.genotypeDetails.uniquename;
    } else {
      return "UNKNOWN";
    }
  }

  setDisplayAlleles(): void {
    this.displayAlleles =
      this.genotypeDetails.expressed_alleles
      .map((expressedAllele) => {
        let expressedAlleleCopy = Object.assign({expression: expressedAllele.expression},
                                                expressedAllele.allele);
        if (expressedAllele.allele.description) {
          expressedAlleleCopy.description = expressedAllele.allele.description.replace(/,/g , ',&#8203;');
        } else {
          expressedAlleleCopy.description = '';
        }
        return expressedAlleleCopy;
      });
  }

  setPageTitle(): void {
    let title = this.titleService.getTitle();
    this.titleService.setTitle(title + " - " + this.displayNameLong());
  }

  ngOnInit() {
    this.route.params.forEach((params: Params) => {
      if (params['uniquename'] !== undefined) {
        let uniquename = params['uniquename'];
        this.pombaseApiService.getGenotype(uniquename)
          .then(genotypeDetails => {
            this.genotypeDetails = genotypeDetails;
            this.annotationTypeNames = this.config.annotationTypeOrder;
            this.setDisplayAlleles();
            this.setPageTitle();
          });
      };
    });
  }
}
