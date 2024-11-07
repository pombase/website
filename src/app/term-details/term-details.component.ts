import { Component, OnInit, Input, Inject } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { TermDetails, PombaseAPIService, TermSubsets, APIError } from '../pombase-api.service';

import { getAnnotationTableConfig, AnnotationTableConfig,
         AnnotationType, AppConfig, getAppConfig} from '../config';
import { MenuItem } from '../types';
import { Util } from '../shared/util';

@Component({
  selector: 'app-term-details',
  templateUrl: './term-details.component.html',
  styleUrls: ['./term-details.component.css']
})
export class TermDetailsComponent implements OnInit {
  @Input() termDetails: TermDetails;

  annotationFeatureType = '';
  typeConfig: AnnotationType;
  annotationTypeNames: Array<string> = [];
  config: AnnotationTableConfig = getAnnotationTableConfig();
  apiError?: APIError;
  menuItems: Array<MenuItem> = [];
  annotatedGeneCount = 0;
  singleLocusGenotypeGeneCount = 0;
  singleLocusGenotypeCount = 0;
  appConfig: AppConfig = getAppConfig();

  subsets: TermSubsets = {};

  displayTermId = '';

  constructor(private pombaseApiService: PombaseAPIService,
              private route: ActivatedRoute,
              private titleService: Title,
              private router: Router,
              private readonly meta: Meta,
              @Inject('Window') private window: any
             ) { }

  setPageTitle(): void {
    let title = this.appConfig.site_name + ' - Ontology term - ';
    if (this.termDetails) {
      title += this.displayTermId + ' - ' + this.termDetails.name;
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
    let visibleSectionNames = [];

    for (let annotationTypeName of this.annotationTypeNames) {
      if (this.termDetails.cv_annotations[annotationTypeName] &&
          this.termDetails.cv_annotations[annotationTypeName].length > 0) {
        visibleSectionNames.push(annotationTypeName);
      }

      if (annotationTypeName === 'double_mutant_genetic_interactions' &&
          this.termDetails.double_mutant_genetic_interactions &&
          this.termDetails.double_mutant_genetic_interactions.length > 0) {
        visibleSectionNames.push(annotationTypeName);
      }

      if (annotationTypeName === 'single_allele_genetic_interactions' &&
          this.termDetails.single_allele_genetic_interactions &&
          this.termDetails.single_allele_genetic_interactions.length > 0) {
        visibleSectionNames.push(annotationTypeName);
      }
    }
    this.menuItems =
      visibleSectionNames.map(typeName => {

        let typeConfig = this.config.getAnnotationType(typeName);

        return {
          id: typeName,
          displayName: typeConfig.display_name || Util.capitalize(typeName),
        };
      });
  }

  makeTableDisplayName(annotationTypeName: string): string {
    const m = annotationTypeName.match(/extension:(.*):(.*):(gene|genotype)/);
    if (m) {
      const cvName = m[1];
      const relTypeDisplayName = m[2];

      const cvDisplayName =
        getAnnotationTableConfig().getAnnotationType(cvName).display_name;

      return cvDisplayName + ' annotations with the extension: ' +
        relTypeDisplayName + ' ' + this.termDetails.name;
    } else {
      return this.config.annotationTypes[annotationTypeName].display_name +
        ' annotations for ' + this.displayTermId + ' and its descendants';
    }
  }

  hasAnnotations(): boolean {
    return this.termDetails.annotated_genes.length > 0;
  }

  setCounts(): void {
    this.singleLocusGenotypeCount = this.termDetails.single_locus_genotypes.length;

    let singleLocusGenotypeGenes: { [key: string]: boolean } = {};

    for (let genotype of this.termDetails.single_locus_genotypes) {
      let gene = genotype.loci[0].expressed_alleles[0].allele.gene;
      if (gene) {
        singleLocusGenotypeGenes[gene.uniquename] = true;
      }
    }

    this.singleLocusGenotypeGeneCount = Object.keys(singleLocusGenotypeGenes).length;

    this.annotatedGeneCount = this.termDetails.annotated_genes.length;

  }

  setDisplayTermId() {
    if (this.typeConfig.hide_term_id_prefix) {
        this.displayTermId = this.termDetails.termid.replace(/^.*?:/, '');
    } else {
      this.displayTermId = this.termDetails.termid;
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
                this.setDisplayTermId();
                this.setPageTitle();
                this.annotationFeatureType = termDetails.annotation_feature_type;
                this.annotationTypeNames = this.config.annotationTypeOrder;
                this.setVisibleSections();
                this.scrollToPageTop();
                this.apiError = undefined;
                this.setCounts();
              })
              .catch(error => {
                this.apiError = error;
              });
      };
    });
  }
}
