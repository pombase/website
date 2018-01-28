import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Util } from '../shared/util';

import { TermDetails, PombaseAPIService, GeneShort,
         TermSubsets } from '../pombase-api.service';
import { getAnnotationTableConfig, AnnotationType } from '../config';


@Component({
  selector: 'app-term-genes-view',
  templateUrl: './term-genes-view.component.html',
  styleUrls: ['./term-genes-view.component.css']
})
export class TermGenesViewComponent implements OnInit {
  @Input() termDetails: TermDetails;
  queryBuilderRouterLink: string;

  typeConfig: AnnotationType = null;
  genes = [];
  showAllAnnotationsLink = true;
  apiError = null;
  subsets: TermSubsets = {};
  geneSummaries = null;

  constructor(private pombaseApiService: PombaseAPIService,
              private route: ActivatedRoute,
              private titleService: Title
             ) { }

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

  setPageTitle(): void {
    let title = this.titleService.getTitle();
    let displayName;
    if (this.termDetails) {
      displayName = this.termDetails.termid + ' - ' + this.termDetails.name;
    } else {
      displayName = 'UNKNOWN';
    }
    this.titleService.setTitle(title + ' - ' + displayName);
  }

  collectGenes(): void {
    this.pombaseApiService.getGeneSummaryMapPromise()
      .then(geneSummaries => {
        this.genes =
          this.termDetails.genes_annotated_with
          .map(geneUniquename => geneSummaries[geneUniquename]);
        this.genes.sort(Util.geneCompare);
      });
  }

  ngOnInit() {
    this.pombaseApiService.getTermSubsets()
      .then((termSubsets) => this.subsets = termSubsets);

    this.route.params.forEach((params: Params) => {
      if (params['termid'] !== undefined) {
        let termid = params['termid'];
        this.pombaseApiService.getTerm(termid)
              .then(termDetails => {
                this.termDetails = termDetails;
                this.typeConfig =
                  getAnnotationTableConfig().getAnnotationType(termDetails.cv_name);
                if (this.typeConfig && this.typeConfig.hide_term_details) {
                  this.showAllAnnotationsLink = false;
                }
                this.setPageTitle();
                this.collectGenes();
                this.queryBuilderRouterLink = '/query/save/from/term_subset/' +
                  termDetails.termid + '/' + encodeURIComponent(termDetails.name);
              })
              .catch(error => {
                this.apiError = error;
              });
      };
    });
  }
}
