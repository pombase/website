import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';

import { Util } from '../shared/util';

import { GenotypeDetails, PombaseAPIService, APIError } from '../pombase-api.service';

import { getAnnotationTableConfig, AnnotationTableConfig, AppConfig, getAppConfig } from '../config';
import { title } from 'process';

@Component({
  selector: 'app-genotype-details',
  templateUrl: './genotype-details.component.html',
  styleUrls: ['./genotype-details.component.css']
})
export class GenotypeDetailsComponent implements OnInit {
  @Input() genotypeDetails: GenotypeDetails;

  annotationTypeNames: Array<string> = [];
  config: AnnotationTableConfig = getAnnotationTableConfig();
  displayAlleles: Array<any> = [];
  displayName = '';
  apiError: APIError = null;
  appConfig: AppConfig = getAppConfig();

  constructor(private pombaseApiService: PombaseAPIService,
              private route: ActivatedRoute,
              private titleService: Title,
              private readonly meta: Meta) { }

  displayNameLong(): string {
    return Util.displayNameLong(this.genotypeDetails).replace(/,/g, ',&thinsp;');;
  }

  setDisplayName(): void {
    this.displayName = this.displayNameLong();
  }

  setPageTitle(): void {
    this.titleService.setTitle(this.appConfig.site_name + ' - Genotype - ' + this.displayName);
    this.meta.updateTag({property: 'og:title', content: title});
    this.meta.updateTag({property: 'description', content: title});
  }

  ngOnInit() {
    this.route.params.forEach((params: Params) => {
      if (params['uniquename'] !== undefined) {
        let uniquename = params['uniquename'];
        this.pombaseApiService.getGenotype(uniquename)
          .then(genotypeDetails => {
            this.genotypeDetails = genotypeDetails;
            this.setDisplayName();
            this.annotationTypeNames = this.config.annotationTypeOrder;
            this.setPageTitle();
            this.apiError = null;
          })
          .catch(error => {
            this.apiError = error;
          });
      };
    });
  }
}
