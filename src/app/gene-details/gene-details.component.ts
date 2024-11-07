import { Component, OnInit, Inject } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { ActivatedRoute, Params } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { faWarning } from '@fortawesome/free-solid-svg-icons';

import { SynonymDetails, GeneDetails, PombaseAPIService,
         ReferenceShort } from '../pombase-api.service';

import {
  getAnnotationTableConfig, AnnotationTableConfig,
  getAppConfig, AppConfig, ConfigOrganism, DetailsPageLinkConfig, getJBrowseTracksByGeneName, JBrowseTrackInfo
} from '../config';
import { DeployConfigService } from '../deploy-config.service';
import { Util } from '../shared/util';
import { MenuItem } from '../types';

@Component({
  selector: 'app-gene-details',
  templateUrl: './gene-details.component.html',
  styleUrls: ['./gene-details.component.css']
})
export class GeneDetailsComponent implements OnInit {
  geneDetails: GeneDetails;

  synonymsDisplay = '';
  displayFeatureType = '';
  displayLocation?: Array<string>;
  annotationTypeNames: Array<string> = [];
  menuItems: Array<MenuItem> = [];
  config: AnnotationTableConfig = getAnnotationTableConfig();
  appConfig: AppConfig = getAppConfig();
  noGeneNameRoute = this.appConfig.no_gene_name_route;
  apiError: any = null;
  showProteinFeatures = false;
  productSizeOfTranscript1 = '';
  productSizeStrings: Array<string> = [];
  transcriptCount = 0;
  // number of unique translations:
  proteinCount = 0;
  organism?: ConfigOrganism;
  organismLongName?: string;
  isConfiguredOrganism: boolean;
  hasCharacterisationStatus = this.appConfig.has_characterisation_status;
  faWarning = faWarning;
  locationWarning?: string;

  extraMenuSections: Array<{ id: string; displayName: string; }> = [];

  products: Array<string> = [];

  externalLinks: Array<DetailsPageLinkConfig>;

  miscAnnotationTypeNames = ['cat_act', 'ex_tools', 'genome_org', 'misc', 'm_f_g'];
  currentGeneBrowserTracks: Array<JBrowseTrackInfo>;

  trackPickerVisible = false;

  sourcePublications: Array<ReferenceShort> = [];

  constructor(private pombaseApiService: PombaseAPIService,
              private route: ActivatedRoute,
              private titleService: Title,
              public deployConfigService: DeployConfigService,
              private readonly meta: Meta,
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
    const chromosomeConfig = this.appConfig.getChromosomeConfigByName(chromosomeName);

    let chrDisplayName;
    if (chromosomeConfig) {
      chrDisplayName = chromosomeConfig.short_display_name || chromosomeName;
    } else {
      chrDisplayName = chromosomeName;
    }

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

  showOrthologsSection(): boolean {
    return this.geneDetails.ortholog_annotations.length > 0 ||
      this.geneDetails.feature_type === 'mRNA gene' ||
      this.geneDetails.feature_type === 'pseudogene';
  }

  setMenuItems(): void {

    let visibleSectionNames = [];

    for (let annotationTypeName of this.annotationTypeNames) {
      if (this.geneDetails.cv_annotations[annotationTypeName] &&
          this.geneDetails.cv_annotations[annotationTypeName].length > 0) {
        visibleSectionNames.push(annotationTypeName);
      }

      if (annotationTypeName === 'protein_domains_and_properties' && this.showProteinFeatures &&
          this.geneDetails.feature_type === 'mRNA gene') {
        visibleSectionNames.push(annotationTypeName);
      }
      if (annotationTypeName === 'transcript_view' &&
        this.geneDetails && this.geneDetails.transcripts &&
        this.geneDetails.transcripts.length > 0) {
        visibleSectionNames.push(annotationTypeName);
      }

      if (annotationTypeName === 'physical_interactions') {
        if (this.geneDetails.physical_interactions &&
            this.geneDetails.physical_interactions.length > 0) {
          visibleSectionNames.push(annotationTypeName);
        }
      }

      if (annotationTypeName === 'genetic_interactions') {
        if (this.geneDetails.genetic_interactions &&
            this.geneDetails.genetic_interactions.length > 0) {
          visibleSectionNames.push(annotationTypeName);
        }
      }

      if (annotationTypeName === 'orthologs' &&
          this.showOrthologsSection()) {
        visibleSectionNames.push(annotationTypeName);
      }

      if (annotationTypeName === 'paralogs') {
        if (this.geneDetails.paralog_annotations &&
            this.geneDetails.paralog_annotations.length > 0) {
          visibleSectionNames.push(annotationTypeName);
        }
      }

      if (annotationTypeName === 'target_of') {
        if (this.geneDetails.target_of_annotations &&
            this.geneDetails.target_of_annotations.length > 0) {
          visibleSectionNames.push(annotationTypeName);
        }
      }

      if (annotationTypeName === 'miscellaneous') {
        if (this.hasMiscAnnotations()) {
          visibleSectionNames.push(annotationTypeName);
        }
      }
    }

    this.menuItems =
        visibleSectionNames.map(typeName => {

          let typeConfig = this.config.getAnnotationType(typeName);
          let subItems: Array<MenuItem> | undefined;

          if (typeConfig.split_by_parents) {
            subItems = typeConfig.split_by_parents.map(splitByConf => {
              return {
                id: typeName + '-' + splitByConf.config_name,
                displayName: splitByConf.display_name,
                subItems: undefined,
              };
            });
          }

          return {
            id: typeName,
            displayName: typeConfig.display_name || Util.capitalize(typeName),
            subItems,
          };
        });

    if (this.geneDetails.gene_history.length > 0) {
      this.menuItems.push({
        id: 'gene-history',
        displayName: 'Gene structure history'
      });
    }

    this.menuItems.push({
      id: 'transcript-sequence',
      displayName: 'Sequence',
    });

    this.menuItems.push({
      id: 'external-refs',
      displayName: 'External references',
    });

    this.menuItems.push({
      id: 'literature',
      displayName: 'Literature',
    });
  }

  scrollToPageTop(): void {
    this.window.scrollTo(0, 0);
  }

  setProducts(): void {
    this.products = [];
    const transcripts = this.geneDetails.transcripts;
    if (transcripts.length === 0) {
      return;
    }

    this.productSizeOfTranscript1 = Util.productStringOfTranscript(transcripts[0]);

    this.proteinCount = 0;

    let seenTranslations = new Set();

    this.geneDetails.transcripts.map(transcript => {
      const protein = transcript.protein;
      if (protein) {
        if (!seenTranslations.has(protein.sequence)) {
          seenTranslations.add(protein.sequence);
          this.proteinCount++;
        }
        if (protein.product && !this.products.includes(protein.product)) {
          this.products.push(protein.product);
        }
      }
    });

    if (this.products.length == 0 && this.geneDetails.product) {
      // fail-back if no transcript has a protein with a product
      this.products.push(this.geneDetails.product);
    }
  }

  private showAsSection(typeName: string): boolean {
    return !this.config.getAnnotationType(typeName).no_gene_details_section;
  }

  private setSourcePublications() {
    this.sourcePublications = [];

    for (const featurePub of this.geneDetails.feature_publications) {
      if (featurePub.source == "contig_file_dbxref") {
        this.sourcePublications.push(featurePub.reference);
      }
    }
  }

  showTrackPicker(): void {
    this.trackPickerVisible = true;
  }

  showCharacterisationStatus(): boolean {
    return this.isConfiguredOrganism && this.hasCharacterisationStatus &&
      !!this.geneDetails.characterisation_status;
  }

  ngOnInit(): void {
    this.route.params.forEach((params: Params) => {
      if (params['uniquename'] !== undefined) {
          let uniquename = params['uniquename'];

          this.pombaseApiService.getGene(uniquename)
            .then(geneDetails => {
              this.geneDetails = geneDetails;
              this.externalLinks =
                this.appConfig.getGenePageExternalLinks(this.geneDetails);
              this.currentGeneBrowserTracks = getJBrowseTracksByGeneName(geneDetails.name);
              this.trackPickerVisible = false;
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

              this.hasCharacterisationStatus = this.appConfig.has_characterisation_status &&
                (!this.geneDetails.feature_type.endsWith('RNA gene') ||
                 !!this.geneDetails.characterisation_status);

              this.transcriptCount = this.geneDetails.transcripts.length;

              this.showProteinFeatures =
                this.geneDetails.transcripts.length > 0 &&
                !!this.geneDetails.transcripts[0].protein ||
                this.geneDetails.interpro_matches.length > 0 ||
                !!this.geneDetails.cv_annotations['pombase_family_or_domain'];
              this.setMenuItems();
              this.organism = this.appConfig.getOrganismByTaxonid(geneDetails.taxonid);
              this.organismLongName = this.organism.genus + ' ' + this.organism.species;
              this.isConfiguredOrganism = this.appConfig.isConfigOrganism(this.organism.taxonid);
              this.apiError = null;
              this.locationWarning = undefined;
              for (const locationWarningConf of this.appConfig.featureLocationWarnings) {
                for (const confFeatureType of locationWarningConf.feature_types) {
                  if (confFeatureType == this.geneDetails.feature_type ||
                     confFeatureType + ' gene' == this.geneDetails.feature_type) {
                    this.locationWarning = locationWarningConf.warning;
                  }
                }
              }
              this.setSourcePublications();
            })
            .catch((error: any) => {
              this.apiError = error;
            });
      };
    });
  }
}
