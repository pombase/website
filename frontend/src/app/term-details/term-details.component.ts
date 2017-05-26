import { Component, OnInit, Input, Inject,
         HostListener } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { TermDetails, TermAndRelation, PombaseAPIService } from '../pombase-api.service';

import { getAnnotationTableConfig, AnnotationTableConfig,
         getAppConfig, AnnotationType } from '../config';

@Component({
  selector: 'app-term-details',
  templateUrl: './term-details.component.html',
  styleUrls: ['./term-details.component.css']
})
export class TermDetailsComponent implements OnInit {
  @Input() termDetails: TermDetails;

  annotationFeatureType = '';
  filteredAncestors: Array<TermAndRelation> = [];
  typeConfig: AnnotationType = null;
  annotationTypeNames: Array<string> = [];
  config: AnnotationTableConfig = getAnnotationTableConfig();
  apiError = null;
  visibleSections: Array<string> = [];

  menuPositionFixed = false;

  constructor(private pombaseApiService: PombaseAPIService,
              private route: ActivatedRoute,
              private titleService: Title,
              private router: Router,
              @Inject('Window') private window: any
             ) { }

  @HostListener('window:scroll', ['$event'])
  scrollEvent(event) {
    if (typeof(document) !== 'undefined') {
      // see: http://stackoverflow.com/questions/28633221/document-body-scrolltop-firefox-returns-0-only-js
      let scrollingElement = document.scrollingElement || document.documentElement;

      if (scrollingElement.scrollTop > 115) {
        this.menuPositionFixed = true;
      } else {
        this.menuPositionFixed = false;
      }
    } else {
      this.menuPositionFixed = false;
    }
  }

  filterAncestors(): void {
    let termPageConfig = getAppConfig().termPageConfig;

    this.filteredAncestors =
      this.termDetails.direct_ancestors.filter(termAndRel => {
        return termPageConfig.ancestorRelNames.indexOf(termAndRel.relation_name) !== -1;
      });
  }

  isInSubset(subsetName: string): boolean {
    return getAppConfig().isInSubset(this.termDetails.termid, subsetName);
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

  scrollToPageTop(): void {
    this.window.scrollTo(0, 0);
  }

  setVisibleSections(): void {
    this.visibleSections = [];

    for (let annotationTypeName of this.annotationTypeNames) {
      if (this.termDetails.cv_annotations[annotationTypeName] &&
          this.termDetails.cv_annotations[annotationTypeName].length > 0) {
        this.visibleSections.push(annotationTypeName);
      }
    }
  }

  ngOnInit() {
    this.route.params.forEach((params: Params) => {
      if (params['termid'] !== undefined) {
        let termid = params['termid'];
        this.pombaseApiService.getTerm(termid)
              .then(termDetails => {
                this.termDetails = termDetails;
                this.typeConfig =
                  getAnnotationTableConfig().getAnnotationType(termDetails.cv_name);
                if (this.typeConfig && this.typeConfig.hide_term_details) {
                  this.router.navigate(['/term_genes', termid]);
                }
                this.setPageTitle();
                this.annotationFeatureType = termDetails.annotation_feature_type;
                this.annotationTypeNames = this.config.annotationTypeOrder;
                this.filterAncestors();
                this.setVisibleSections();
                this.scrollToPageTop();
              })
              .catch(error => {
                this.apiError = error;
              });
      };
    });
  }
}
