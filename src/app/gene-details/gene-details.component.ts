import { Component, OnInit, Input, Inject } from '@angular/core';
import { Meta, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Params } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { DomSanitizer } from '@angular/platform-browser';

import { SynonymDetails, GeneDetails, PombaseAPIService } from '../pombase-api.service';

import { getAnnotationTableConfig, AnnotationTableConfig,
         getAppConfig, AppConfig, ConfigOrganism } from '../config';
import { DeployConfigService } from '../deploy-config.service';
import { Util } from '../shared/util';

@Component({
  selector: 'app-gene-details',
  templateUrl: './gene-details.component.html',
  styleUrls: ['./gene-details.component.css']
})
export class GeneDetailsComponent implements OnInit {
  @Input() geneDetails: GeneDetails;

  synonymsDisplay = '';
  displayFeatureType = '';
  displayLocation?: Array<string>;
  annotationTypeNames: Array<string> = [];
  visibleSections: Array<string> = [];
  config: AnnotationTableConfig = getAnnotationTableConfig();
  appConfig: AppConfig = getAppConfig();
  apiError: any = null;
  showProteinFeatures = false;
  productSizeOfTranscript1 = '';
  productSizeStrings: Array<string> = [];
  transcriptCount = 0;
  // number of translated transcripts:
  proteinCount = 0;
  organism?: ConfigOrganism;
  organismLongName?: string;
  isConfiguredOrganism: boolean;
  jbrowseLinkUrl?: string;
  sanitizedJBrowseURL?: SafeResourceUrl;
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

  miscAnnotationTypeNames = ['cat_act', 'ex_tools', 'genome_org', 'misc', 'm_f_g'];

  constructor(private pombaseApiService: PombaseAPIService,
              private route: ActivatedRoute,
              private titleService: Title,
              private deployConfigService: DeployConfigService,
              private readonly meta: Meta,
              private sanitizer: DomSanitizer,
              @Inject('Window') private window: any
             ) { }

  getCDSDisplayLocation(): string|undefined {
    if (this.geneDetails.transcripts.length > 0) {
      const transcript = this.geneDetails.transcripts[0];

      const cds_location = transcript.cds_location;

      if (!cds_location) {
        return undefined;
      }

      const len = cds_location.end_pos - cds_location.start_pos + 1;

      if (cds_location.strand === 'reverse') {
        return `${cds_location.end_pos}-${cds_location.start_pos} (${len}nt)`;
      } else {
        return `${cds_location.start_pos}-${cds_location.end_pos} (${len}nt)`;
      }
    }

    return undefined;
  }

  makeDisplayLocation(): Array<string>|undefined {
    const location = this.geneDetails.location;
    if (!location) {
      return undefined;
    }
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
    this.meta.updateTag({property: 'description', content: title});
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

      if (annotationTypeName === 'protein_features' && this.showProteinFeatures &&
          this.geneDetails.feature_type === 'mRNA gene') {
        this.visibleSections.push(annotationTypeName);
      }
      if (annotationTypeName === 'transcript_view' &&
        this.geneDetails && this.geneDetails.transcripts &&
        this.geneDetails.transcripts.length > 0) {
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

      if (annotationTypeName === 'orthologs' &&
          (this.geneDetails.feature_type === 'mRNA gene' ||
           this.geneDetails.feature_type === 'pseudogene')) {
        this.visibleSections.push(annotationTypeName);
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

  setProducts(): void {
    const transcripts = this.geneDetails.transcripts;
    if (transcripts.length === 0) {
      return;
    }

    transcripts.map(transcript => {
      this.productSizeOfTranscript1 = Util.productStringOfTranscript(transcript);

      this.proteinCount = 0;
      this.geneDetails.transcripts.map(transcript => {
        if (transcript.protein) {
          this.proteinCount++;
        }
      });
    });
  }

  setJBrowseLink(): void {
    if (this.geneDetails && this.geneDetails.location) {
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

          const chrDisplayName = this.appConfig.chromosomes[chrName].export_id;

          const tracks = 'Forward%20strand%20features%2CReverse%20strand%20features%2CDNA%20sequence';
          this.jbrowseLinkUrl =
            `jbrowse/?loc=${chrDisplayName}%3A${jbStart}..${jbEnd}&tracks=${tracks}`;

          this.sanitizedJBrowseURL =
            this.sanitizer.bypassSecurityTrustResourceUrl(this.jbrowseLinkUrl + '&tracklist=0&nav=0&overview=0');
      });
    } else {
      this.jbrowseLinkUrl = undefined;
      this.sanitizedJBrowseURL = undefined;
    }
  }

  getJBrowseIFrameURL(): SafeResourceUrl|undefined {
    return this.sanitizedJBrowseURL;
  }

  private showAsSection(typeName: string): boolean {
    return !this.config.getAnnotationType(typeName).no_gene_details_section;
  }

  ngOnInit(): void {
    this.route.params.forEach((params: Params) => {
      if (params['uniquename'] !== undefined) {
          let uniquename = params['uniquename'];

          this.pombaseApiService.getGene(uniquename)
            .then(geneDetails => {
              this.geneDetails = geneDetails;
              this.synonymsDisplay = this.makeSynonymsDisplay(geneDetails.synonyms);
              this.displayLocation = this.makeDisplayLocation();
              this.displayFeatureType = this.makeDisplayFeatureType(geneDetails.feature_type);
              this.annotationTypeNames = this.config.annotationTypeOrder
                .filter(typeName => {
                  if (this.showAsSection(typeName)) {
                    const annotationTypeConfig = this.config.getAnnotationType(typeName);

                    if (annotationTypeConfig.deploy_mode) {
                      const mode = this.deployConfigService.getMode();
                      return mode === annotationTypeConfig.deploy_mode;
                    } else {
                      return true;
                    }
                  } else {
                    return false;
                  }
                });
              this.setPageTitle();
              this.scrollToPageTop();
              this.setProducts();
              this.transcriptCount = this.geneDetails.transcripts.length;
              this.setJBrowseLink();
              this.showProteinFeatures =
                this.geneDetails.transcripts.length > 0 &&
                !!this.geneDetails.transcripts[0].protein ||
                this.geneDetails.interpro_matches.length > 0 ||
                !!this.geneDetails.cv_annotations['PomBase family or domain'];
              this.setVisibleSections();
              this.organism = this.appConfig.getOrganismByTaxonid(geneDetails.taxonid);
              this.organismLongName = this.organism.genus + ' ' + this.organism.species;
              this.isConfiguredOrganism = this.appConfig.isConfigOrganism(this.organism.taxonid);
              this.apiError = null;
            })
            .catch((error: any) => {
              this.apiError = error;
            });
      };
    });
  }
}
