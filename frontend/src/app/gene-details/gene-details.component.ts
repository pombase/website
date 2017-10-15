import { Component, OnInit, Input, Inject } from '@angular/core';
import { Meta } from '@angular/platform-browser';
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
  annotationTypeNames: Array<string> = [];
  visibleSections: Array<string> = [];
  config: AnnotationTableConfig = getAnnotationTableConfig();
  appConfig: AppConfig = getAppConfig();
  apiError = null;
  showProteinFeatures = false;
  productSize = '';
  organism = null;
  ensemblImageUrl = null;
  ensemblImage = new Image();
  extraMenuSections = [
    {
      id: 'transcript-sequence',
      displayName: 'Sequence',
    },
    {
      id: 'external-refs',
      displayName: 'External references',
    },
    {
      id: 'literature',
      displayName: 'Literature',
    }
  ];

  miscAnnotationTypeNames = ['cat_act', 'ex_tools', 'genome_org', 'misc'];

  constructor(private pombaseApiService: PombaseAPIService,
              private route: ActivatedRoute,
              private titleService: Title,
              private readonly meta: Meta,
              @Inject('Window') private window: any
             ) { }

  makeDisplayLocation(location: ChromosomeLocation): string {
    let chromosomeName = location.chromosome.name;
    let chromosomeConfig = this.appConfig.chromosomes[chromosomeName];

    let displayName = chromosomeConfig.display_name || chromosomeName;

    let ret = displayName + ', ';
    if (location.strand === 'reverse') {
      ret += location.end_pos + '-' + location.start_pos;
    } else {
      ret += location.start_pos + '-' + location.end_pos;
    }
    ret += ' (' + (location.end_pos - location.start_pos + 1) + 'nt)';
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
    return synonyms
      .filter((synonym) => synonym.type !== 'obsolete_name')
      .map((synonym) => {
        if (synonym.type === 'exact') {
          return synonym.name;
        } else {
          return synonym.name + ' (' + synonym.type + ')';
        }
      }).join(', ');
  }

  displayNameLong(): string {
    if (this.geneDetails) {
      let nameId = '';
      if (this.geneDetails.name) {
        nameId = this.geneDetails.name + ' (' + this.geneDetails.uniquename + ')';
      } else {
        nameId = this.geneDetails.uniquename;
      }

      if (this.geneDetails.product) {
        return nameId + ' - ' + this.geneDetails.product;
      }
    } else {
      return 'UNKNOWN';
    }
  }

  setPageTitle(): void {
    let title = 'Gene - ' + this.displayNameLong();
    this.titleService.setTitle(title);
    this.meta.updateTag({property: 'og:title', content: title});
  }

  hasMiscAnnotations(): boolean {
    for (let annotationTypeName of this.miscAnnotationTypeNames) {
      if (this.geneDetails.cv_annotations[annotationTypeName] &&
          this.geneDetails.cv_annotations[annotationTypeName].length > 0) {
        return true;
      }
    }
    return false;
  }

  setVisibleSections(): void {
    this.visibleSections = [];

    for (let annotationTypeName of this.annotationTypeNames) {
      if (this.geneDetails.cv_annotations[annotationTypeName] &&
          this.geneDetails.cv_annotations[annotationTypeName].length > 0) {
        this.visibleSections.push(annotationTypeName);
      }

      if ((annotationTypeName === 'protein_features' && this.showProteinFeatures ||
           annotationTypeName === 'transcript_view') &&
          this.geneDetails.feature_type === 'mRNA gene') {
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

      if (annotationTypeName === 'miscellaneous') {
        if (this.hasMiscAnnotations()) {
          this.visibleSections.push(annotationTypeName);
        }
      }
    }
  }

  scrollToPageTop(): void {
    this.window.scrollTo(0, 0);
  }

  setProductSize(): void {
    for (let transcript of this.geneDetails.transcripts) {
      let protein = transcript.protein;
      if (protein) {
        let proteinSequenceLength = protein.number_of_residues;
        let weight = Math.round(protein.molecular_weight * 100) / 100.0;
        this.productSize = proteinSequenceLength + ' aa, ' + weight + ' kDa';
      } else {
        this.productSize = transcript.sequence.length + ' nt';
      }
    }
  }

  private isGeneDetailPageType(typeName: string): boolean {
    return !this.config.getAnnotationType(typeName).no_gene_details_section;
  }

  ngOnInit(): void {
    this.route.params.forEach((params: Params) => {
      if (params['uniquename'] !== undefined) {
        let uniquename = params['uniquename'];

        // (slightly) prefetch the image
        this.ensemblImageUrl =
          `http://preview.pombase.org/browser_images/${uniquename}_gene.png`;
        this.ensemblImage.src = this.ensemblImageUrl;

        // delete api call so image request is first
        setTimeout(() => {
          this.pombaseApiService.getGene(uniquename)
            .then(geneDetails => {
              this.geneDetails = geneDetails;
              this.synonymsDisplay = this.makeSynonymsDisplay(geneDetails.synonyms);
              this.displayLocation = this.makeDisplayLocation(geneDetails.location);
              this.displayFeatureType = this.makeDisplayFeatureType(geneDetails.feature_type);
              this.annotationTypeNames =
                this.config.annotationTypeOrder
                .filter(typeName => this.isGeneDetailPageType(typeName));
              this.setPageTitle();
              this.scrollToPageTop();
              this.setProductSize();
              this.showProteinFeatures =
                this.geneDetails.transcripts && this.geneDetails.transcripts.length > 0 &&
                !!this.geneDetails.transcripts[0].protein ||
                this.geneDetails.interpro_matches.length > 0 ||
                !!this.geneDetails.cv_annotations['PomBase family or domain'];
              this.setVisibleSections();
              this.organism = this.appConfig.getOrganismByTaxonid(geneDetails.taxonid);
              this.apiError = null;
            })
            .catch(error => {
              this.apiError = error;
            });
        }, 1);
      };
    });
  }
}
