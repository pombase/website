import { Component, OnInit, OnChanges, Input } from '@angular/core';

import { TermDetails, TermAndRelation, PombaseAPIService,
         TermSubsets } from '../pombase-api.service';
import { getAnnotationTableConfig, AnnotationTableConfig,
         getAppConfig, AnnotationType } from '../config';
import { Router } from '@angular/router';

@Component({
  selector: 'app-term-page-summary',
  templateUrl: './term-page-summary.component.html',
  styleUrls: ['./term-page-summary.component.css']
})
export class TermPageSummaryComponent implements OnInit, OnChanges {
  @Input() termDetails: TermDetails;

  filteredAncestors: Array<TermAndRelation> = [];
  subsets: TermSubsets = {};
  typeConfig: AnnotationType = null;
  slimConfig = getAppConfig().slims;
  slimConfigNames = Object.keys(this.slimConfig);
  config: AnnotationTableConfig = getAnnotationTableConfig();

  constructor(private router: Router,
              private pombaseApiService: PombaseAPIService) { }

  isInSubset(subsetName: string): boolean {
    if (!this.subsets[subsetName]) {
      return false;
    }
    for (let termid of Object.keys(this.subsets[subsetName].elements)) {
      if (termid === this.termDetails.termid) {
        return true;
      }
    }

    return false;
  }

  goToFullSlim(slimName: string) {
    this.router.navigate([this.slimConfig[slimName].full_slim_path]);
  }

  filterAncestors(): void {
    let termPageConfig = getAppConfig().termPageConfig;

    this.filteredAncestors =
      this.termDetails.direct_ancestors.filter(termAndRel => {
        return termPageConfig.ancestorRelNames.indexOf(termAndRel.relation_name) !== -1;
      });
  }

  ngOnInit() {
    this.pombaseApiService.getTermSubsets()
      .then((termSubsets) => this.subsets = termSubsets);
  }

  ngOnChanges() {
    this.filterAncestors();
    this.typeConfig =
      getAnnotationTableConfig().getAnnotationType(this.termDetails.cv_name);
  }
}

