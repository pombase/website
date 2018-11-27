import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { Util } from '../shared/util';

import { TermDetails, PombaseAPIService, GeneShort,
         TermSubsets,
         APIError,
         GeneSummary} from '../pombase-api.service';
import { getAnnotationTableConfig, AnnotationType, AppConfig, getAppConfig } from '../config';


@Component({
  selector: 'app-term-genes-view',
  templateUrl: './term-genes-view.component.html',
  styleUrls: ['./term-genes-view.component.css']
})
export class TermGenesViewComponent implements OnInit {
  @Input() termDetails: TermDetails;
  queryBuilderRouterLink: string;

  typeConfig: AnnotationType = null;
  genes: Array<GeneShort> = [];
  showAllAnnotationsLink = true;
  apiError: APIError = null;
  subsets: TermSubsets = {};
  geneSummaries: Array<GeneSummary> = null;
  appConfig: AppConfig = getAppConfig();

  constructor(private pombaseApiService: PombaseAPIService,
              private route: ActivatedRoute,
              private titleService: Title,
              private meta: Meta) { }

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
    let title = this.appConfig.site_name;
    let displayName;
    if (this.termDetails) {
      displayName = this.termDetails.termid + ' - ' + this.termDetails.name;
    } else {
      displayName = 'UNKNOWN';
    }
    this.titleService.setTitle(title + ' - ' + displayName);
    this.meta.updateTag({property: 'og:title', content: title});
    this.meta.updateTag({property: 'description', content: title});
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
