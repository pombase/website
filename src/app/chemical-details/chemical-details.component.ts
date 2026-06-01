import { Component, OnInit, Input, Inject } from '@angular/core';

import { Meta } from '@angular/platform-browser';
import { ActivatedRoute, Params } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { TermDetails, PombaseAPIService, APIError } from '../pombase-api.service';

import {
  getAnnotationTableConfig, AnnotationTableConfig,
  AppConfig, getAppConfig
} from '../config';
import { MenuItem } from '../types';
import { Util } from '../shared/util';

@Component({
  selector: 'app-chemical-details',
  templateUrl: './chemical-details.component.html',
  styleUrl: './chemical-details.component.css',
  standalone: false
})
export class ChemicalDetailsComponent implements OnInit {

  @Input() termDetails: TermDetails;

  menuItems: Array<MenuItem> = [];
  apiError?: APIError;
  config: AnnotationTableConfig = getAnnotationTableConfig();
  appConfig: AppConfig = getAppConfig();

  constructor(private pombaseApiService: PombaseAPIService,
    private route: ActivatedRoute,
    private titleService: Title,
    private readonly meta: Meta,
    @Inject('Window') private window: any
  ) { }

  setPageTitle(): void {
    let title = this.appConfig.site_name + ' - Chemical - ';
    if (this.termDetails) {
      title += this.termDetails.termid + ' - ' + this.termDetails.name;
    } else {
      title += 'UNKNOWN';
    }
    this.titleService.setTitle(title);
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'description', content: title });
  }

  scrollToPageTop(): void {
    this.window.scrollTo(0, 0);
  }

  setVisibleSections(): void {
    this.menuItems = [
      {
          id: 'temp'
          displayName: ''
      }];
  }

  ngOnInit() {
    this.route.params.forEach((params: Params) => {
      if (params['termid'] !== undefined) {
        let termid = params['termid'];
        this.pombaseApiService.getTerm(termid)
          .then(termDetails => {
            this.termDetails = termDetails;
            this.setPageTitle();

            this.setVisibleSections();
            this.scrollToPageTop();
            this.apiError = undefined;

          })
          .catch(error => {
            this.apiError = error;
          });
      };
    });
  }
}
