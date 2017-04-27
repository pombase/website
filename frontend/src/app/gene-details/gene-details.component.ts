import { Component, OnInit, Input,
         Inject, HostListener } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { SynonymDetails, GeneDetails, ChromosomeLocation, PombaseAPIService } from '../pombase-api.service';

import { getAnnotationTableConfig, AnnotationTableConfig,
         getAppConfig, AppConfig } from '../config';

@Component({
  selector: 'app-gene-details',
  templateUrl: './gene-details.component.html',
  styleUrls: ['./gene-details.component.css']
})
export class GeneDetailsComponent implements OnInit {
  @Input() geneDetails: GeneDetails;

  synonymsDisplay = '';
  displayFeatureType = '';
  displayLocation = '';
  shortChromosomeName = '';
  annotationTypeNames: Array<string> = [];
  visibleSections: Array<string> = [];
  config: AnnotationTableConfig = getAnnotationTableConfig();
  appConfig: AppConfig = getAppConfig();
  apiError = null;

  menuPositionFixed = false;

  constructor(private pombaseApiService: PombaseAPIService,
              private route: ActivatedRoute,
              private titleService: Title,
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

  makeDisplayLocation(location: ChromosomeLocation): string {
    let chromosome_name = location.chromosome_name;
    let matches = chromosome_name.match(/chromosome_(\d+)/);
    this.shortChromosomeName = '';
    if (matches) {
      chromosome_name = 'Chromosome ';
      for (let i = 0; i < +matches[1]; i++) {
        this.shortChromosomeName += 'I';
      }
      chromosome_name += this.shortChromosomeName;
    } else {
      if (chromosome_name === 'mating_type_region') {
        chromosome_name = 'Mating type region';
        this.shortChromosomeName = 'MTR';
      } else {
        if (chromosome_name === 'MISPCG') {
          chromosome_name = 'Mitochondria';
          this.shortChromosomeName = 'MT';
        } else {
          this.shortChromosomeName = chromosome_name;
        }
      }
    }
    let ret = chromosome_name + ', ';
    if (location.strand === 'reverse') {
      ret += location.end_pos + '-' + location.start_pos;
    } else {
      ret += location.start_pos + '-' + location.end_pos;
    }
    ret += ' (' + (location.end_pos - location.start_pos) + 'nt)';
    return ret;
  }

  makeDisplayFeatureType(rawFeatureType: string): string {
    if (rawFeatureType === 'mRNA gene') {
      return 'protein coding';
    } else {
      return rawFeatureType;
    }
  }

  makeSynonymsDisplay(synonyms: Array<SynonymDetails>): string {
    return synonyms.map((synonym) => {
      if (synonym.type === 'exact') {
        return synonym.name;
      } else {
        let synonym_type = synonym.type;
        if (synonym_type === 'obsolete_name') {
          synonym_type = 'obsolete';
        }
        return synonym.name + ' (' + synonym_type + ')';
      }
    }).join(', ');
  }

  displayNameLong(): string {
    if (this.geneDetails) {
      if (this.geneDetails.name) {
        return this.geneDetails.name + ' (' + this.geneDetails.uniquename + ')';
      } else {
        return this.geneDetails.uniquename;
      }
    } else {
      return 'UNKNOWN';
    }
  }

  setPageTitle(): void {
    let title = this.titleService.getTitle();
    this.titleService.setTitle(title + ' - ' + this.displayNameLong());
  }

  setVisibleSections(): void {
    this.visibleSections = [];

    for (let annotationTypeName of this.annotationTypeNames) {
      if (this.geneDetails.cv_annotations[annotationTypeName] &&
          this.geneDetails.cv_annotations[annotationTypeName].length > 0) {
        this.visibleSections.push(annotationTypeName);
      }

      if (annotationTypeName === 'physical_interactions') {
        if (this.geneDetails.physical_interactions &&
            this.geneDetails.physical_interactions.length > 0) {
          this.visibleSections.push(annotationTypeName);
        }
      }

      if (annotationTypeName === 'genetic_interactions') {
        if (this.geneDetails.genetic_interactions &&
            this.geneDetails.genetic_interactions.length > 0) {
          this.visibleSections.push(annotationTypeName);
        }
      }

      if (annotationTypeName === 'orthologs') {
        if (this.geneDetails.ortholog_annotations &&
            this.geneDetails.ortholog_annotations.length > 0) {
          this.visibleSections.push(annotationTypeName);
        }
      }

      if (annotationTypeName === 'paralogs') {
        if (this.geneDetails.paralog_annotations &&
            this.geneDetails.paralog_annotations.length > 0) {
          this.visibleSections.push(annotationTypeName);
        }
      }

      if (annotationTypeName === 'target_of') {
        if (this.geneDetails.target_of_annotations &&
            this.geneDetails.target_of_annotations.length > 0) {
          this.visibleSections.push(annotationTypeName);
        }
      }
    }
  }

  ngOnInit(): void {
    this.route.params.forEach((params: Params) => {
      if (params['uniquename'] !== undefined) {
        let uniquename = params['uniquename'];
        this.pombaseApiService.getGene(uniquename)
          .then(geneDetails => {
            this.geneDetails = geneDetails;
            this.synonymsDisplay = this.makeSynonymsDisplay(geneDetails.synonyms);
            this.displayLocation = this.makeDisplayLocation(geneDetails.location);
            this.displayFeatureType = this.makeDisplayFeatureType(geneDetails.feature_type);
            this.annotationTypeNames = this.config.annotationTypeOrder;
            this.setPageTitle();
            this.setVisibleSections();
          })
          .catch(error => {
            this.apiError = error;
          });
      };
    });
  }
}
