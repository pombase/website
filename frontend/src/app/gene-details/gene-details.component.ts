import { Component, OnInit, Input, Inject } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { ActivatedRoute, Params } from '@angular/router';
import { Title } from '@angular/platform-browser';


import { SynonymDetails, GeneDetails, PombaseAPIService } from '../pombase-api.service';

import { getAnnotationTableConfig, AnnotationTableConfig,
         getAppConfig, AppConfig } from '../config';
import { DeployConfigService } from '../deploy-config.service';

@Component({
  selector: 'app-gene-details',
  templateUrl: './gene-details.component.html',
  styleUrls: ['./gene-details.component.css']
})
export class GeneDetailsComponent implements OnInit {
  @Input() geneDetails: GeneDetails;

  synonymsDisplay = '';
  displayFeatureType = '';
  displayLocation: Array<string> = [];
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
  jbrowseLinkUrl = null;
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
              private deployConfigService: DeployConfigService,
              private readonly meta: Meta,
              @Inject('Window') private window: any
             ) { }

  getCDSDisplayLocation(): string {
    if (this.geneDetails.transcripts && this.geneDetails.transcripts.length > 0) {
      const transcript = this.geneDetails.transcripts[0];

      const cds_location = transcript.cds_location;

      if (!cds_location) {
        return null;
      }

      const len = cds_location.end_pos - cds_location.start_pos + 1;

      return `${cds_location.start_pos}-${cds_location.end_pos} (${len}nt)`;
    }

    return null;
  }

  makeDisplayLocation(): Array<string> {
    const location = this.geneDetails.location;
    const chromosomeName = location.chromosome_name;
    const chromosomeConfig = this.appConfig.chromosomes[chromosomeName];

    const chrDisplayName = chromosomeConfig.short_display_name || chromosomeName;

    let genomicLocation;
    if (location.strand === 'reverse') {
      genomicLocation = location.end_pos + '-' + location.start_pos;
    } else {
      genomicLocation = location.start_pos + '-' + location.end_pos;
    }
    genomicLocation += ' (' + (location.end_pos - location.start_pos + 1) + 'nt)';

    const cdsDisplayLocation = this.getCDSDisplayLocation();

    if (cdsDisplayLocation) {
      return [chrDisplayName, `${cdsDisplayLocation} coding start to stop`,
              `${genomicLocation} including UTRs`];
    } else {
      return [chrDisplayName, genomicLocation];
    }
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
      } else {
        return nameId;
      }
    } else {
      return 'UNKNOWN';
    }
  }

  setPageTitle(): void {
    let title = this.appConfig.site_name + ' - Gene - ' + this.displayNameLong();
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

  setJBrowseLink(): void {
    if (this.geneDetails) {
      this.pombaseApiService.getChromosomeSummaryMapPromise()
        .then(chromosomeSummaryMap => {
          const loc = this.geneDetails.location;
          const chrName = loc.chromosome_name;
          const chr = chromosomeSummaryMap[chrName];
          const chrLength = chr.length;

          const lowerPos = Math.min(loc.start_pos, loc.end_pos);
          const upperPos = Math.max(loc.start_pos, loc.end_pos);

          const mid = Math.round((lowerPos + upperPos) / 2);

          const jbHalfWidth = 10000;
          let jbStart = mid - jbHalfWidth;
          if (jbStart < 1) {
            jbStart = 1;
          }

          let jbEnd = mid + jbHalfWidth;
          if (jbEnd > chrLength) {
            jbEnd = chrLength;
          }

          const chrDisplayName = this.appConfig.chromosomes[chrName].short_display_name;

          const tracks = 'PomBase%20forward%20strand%20features%2CDNA%2CPomBase%20reverse%20strand%20features';
          this.jbrowseLinkUrl =
            `jbrowse/?loc=${chrDisplayName}%3A${jbStart}..${jbEnd}&tracks=${tracks}`;
        });
    } else {
      this.jbrowseLinkUrl = null;
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
        this.ensemblImageUrl = `/browser_images/${uniquename}_gene.png`;
        this.ensemblImage.src = this.ensemblImageUrl;

        // delay api call so image request is first
        setTimeout(() => {
          this.pombaseApiService.getGene(uniquename)
            .then(geneDetails => {
              this.geneDetails = geneDetails;
              this.synonymsDisplay = this.makeSynonymsDisplay(geneDetails.synonyms);
              this.displayLocation = this.makeDisplayLocation();
              this.displayFeatureType = this.makeDisplayFeatureType(geneDetails.feature_type);
              this.annotationTypeNames =
                this.config.annotationTypeOrder
                .filter(typeName => this.isGeneDetailPageType(typeName));
              this.setPageTitle();
              this.scrollToPageTop();
              this.setProductSize();
              this.setJBrowseLink();
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
