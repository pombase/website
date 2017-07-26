import { Component, OnInit, OnChanges, Input } from '@angular/core';

import { TermDetails, TermAndRelation, PombaseAPIService,
         TermSubsets } from '../pombase-api.service';
import { getAnnotationTableConfig, AnnotationTableConfig,
         getAppConfig, AnnotationType } from '../config';

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
  config: AnnotationTableConfig = getAnnotationTableConfig();

  constructor(private pombaseApiService: PombaseAPIService) { }

  isInSubset(subsetName: string): boolean {
    if (!this.subsets[subsetName]) {
      return false;
    }
    for (let element of this.subsets[subsetName].elements) {
      if (element.termid === this.termDetails.termid) {
        return true;
      }
    }

    return false;
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

