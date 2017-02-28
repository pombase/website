import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { TermDetails, TermAndRelation, Annotation,
         PombaseAPIService } from '../pombase-api.service';

import { getAnnotationTableConfig, AnnotationTableConfig,
         getAppConfig } from '../config';

@Component({
  selector: 'app-term-details',
  templateUrl: './term-details.component.html',
  styleUrls: ['./term-details.component.css']
})
export class TermDetailsComponent implements OnInit {
  @Input() termDetails: TermDetails;

  annotationFeatureType = '';
  filteredAncestors: Array<TermAndRelation> = [];

  constructor(private pombaseApiService: PombaseAPIService,
              private route: ActivatedRoute,
              private titleService: Title
             ) { }

  filterAncestors(): void {
    let termPageConfig = getAppConfig().termPageConfig;

    this.filteredAncestors =
      this.termDetails.direct_ancestors.filter(termAndRel => {
        return termPageConfig.ancestorRelNames.indexOf(termAndRel.relation_name) != -1;
      });
  }

  setPageTitle(): void {
    let title = this.titleService.getTitle();
    let displayName;
    if (this.termDetails) {
      displayName = this.termDetails.termid + " - " + this.termDetails.name;
    } else {
      displayName = "UNKNOWN";
    }
    this.titleService.setTitle(title + " - " + displayName);
  }

  ngOnInit() {
    this.route.params.forEach((params: Params) => {
      if (params['termid'] !== undefined) {
        let termid = params['termid'];
        this.pombaseApiService.getTerm(termid)
              .then(termDetails => {
                this.termDetails = termDetails;
                this.setPageTitle();
                this.annotationFeatureType = termDetails.annotation_feature_type;
                this.filterAncestors();
              });
      };
    });
  }
}
