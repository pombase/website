import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { Util } from '../util';

import { GenotypeDetails, PombaseAPIService } from '../pombase-api.service';

import { getAnnotationTableConfig, AnnotationTableConfig } from '../config';

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
  apiError = null;

  constructor(private pombaseApiService: PombaseAPIService,
              private route: ActivatedRoute,
              private titleService: Title
             ) { }

  displayNameLong(): string {
    return Util.displayNameLong(this.genotypeDetails);
  }

  setDisplayName(): void {
    this.displayName = this.displayNameLong();
  }

  setPageTitle(): void {
    let title = this.titleService.getTitle();
    this.titleService.setTitle(title + ' - ' + this.displayName);
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
          })
          .catch(error => {
            this.apiError = error;
          });
      };
    });
  }
}
