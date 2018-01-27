import { Component, OnInit, Input, Inject,
         HostListener } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Title } from '@angular/platform-browser';


import { TermDetails, PombaseAPIService, TermSubsets } from '../pombase-api.service';

import { getAnnotationTableConfig, AnnotationTableConfig,
         AnnotationType } from '../config';

@Component({
  selector: 'app-term-details',
  templateUrl: './term-details.component.html',
  styleUrls: ['./term-details.component.css']
})
export class TermDetailsComponent implements OnInit {
  @Input() termDetails: TermDetails;

  annotationFeatureType = '';
  typeConfig: AnnotationType = null;
  annotationTypeNames: Array<string> = [];
  config: AnnotationTableConfig = getAnnotationTableConfig();
  apiError = null;
  visibleSections: Array<string> = [];
  hasAnnotations = false;

  menuPositionFixed = false;

  subsets: TermSubsets = {};

  constructor(private pombaseApiService: PombaseAPIService,
              private route: ActivatedRoute,
              private titleService: Title,
              private router: Router,
              private readonly meta: Meta,
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

  setPageTitle(): void {
    let title = this.titleService.getTitle() + ' - Ontology term - ';
    if (this.termDetails) {
      title += this.termDetails.termid + ' - ' + this.termDetails.name;
    } else {
      title += 'UNKNOWN';
    }
    this.titleService.setTitle(title);
    this.meta.updateTag({property: 'og:title', content: title});
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

  makeTableDisplayName(annotationTypeName: string): string {
    const m = annotationTypeName.match(/extension:(.*):(.*):(gene|genotype)/);
    if (m) {
      const relTypeDisplayName = m[2];
      return 'Annotations with the extension: ' +
        relTypeDisplayName + ' ' + this.termDetails.termid;
    } else {
      return this.config.annotationTypes[annotationTypeName].display_name +
        ' annotations for ' + this.termDetails.termid + ' and its descendants';
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
                this.setVisibleSections();
                this.scrollToPageTop();
                this.apiError = null;
                this.hasAnnotations =
                  Object.keys(this.termDetails.cv_annotations).length > 0;
              })
              .catch(error => {
                this.apiError = error;
              });
      };
    });
  }
}
