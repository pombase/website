import { Component, OnInit, Input, Inject,
         HostListener } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Title } from '@angular/platform-browser';


import { TermDetails, PombaseAPIService, TermSubsets, APIError } from '../pombase-api.service';

import { getAnnotationTableConfig, AnnotationTableConfig,
         AnnotationType, AppConfig, getAppConfig} from '../config';

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
  apiError: APIError = null;
  visibleSections: Array<string> = [];
  annotatedGeneCount = 0;
  singleAlleleGenotypeGeneCount = 0;
  singleAlleleGenotypeCount = 0;
  appConfig: AppConfig = getAppConfig();

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
  scrollEvent(event: any) {
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
    let title = this.appConfig.site_name + ' - Ontology term - ';
    if (this.termDetails) {
      title += this.termDetails.termid + ' - ' + this.termDetails.name;
    } else {
      title += 'UNKNOWN';
    }
    this.titleService.setTitle(title);
    this.meta.updateTag({property: 'og:title', content: title});
    this.meta.updateTag({property: 'description', content: title});
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

  hasAnnotations(): boolean {
    return this.termDetails.genes_annotated_with.length > 0;
  }

  setCounts(): void {
    this.singleAlleleGenotypeCount = this.termDetails.single_allele_genotypes.length;

    let singleAlleleGenotypeGenes: { [key: string]: boolean } = {};

    for (let genotype of this.termDetails.single_allele_genotypes) {
      let gene = genotype.expressed_alleles[0].allele.gene;
      singleAlleleGenotypeGenes[gene.uniquename] = true;
    }

    this.singleAlleleGenotypeGeneCount = Object.keys(singleAlleleGenotypeGenes).length;

    this.annotatedGeneCount = this.termDetails.genes_annotated_with.length;

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
                this.setCounts();
              })
              .catch(error => {
                this.apiError = error;
              });
      };
    });
  }
}
