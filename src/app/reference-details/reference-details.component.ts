import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';

import { getAnnotationTableConfig, AnnotationTableConfig,
         getAppConfig, AppConfig, getJBrowseTracksByPMID } from '../config';
import { Util } from '../shared/util';

import { ReferenceDetails, PombaseAPIService, APIError } from '../pombase-api.service';

@Component({
  selector: 'app-reference-details',
  templateUrl: './reference-details.component.html',
  styleUrls: ['./reference-details.component.css']
})
export class ReferenceDetailsComponent implements OnInit {
  @Input() refDetails: ReferenceDetails;

  annotationTypeNames: Array<string>;
  appConfig: AppConfig = getAppConfig();
  siteName = '';
  visibleSections: Array<string> = [];
  config: AnnotationTableConfig = getAnnotationTableConfig();
  isPubMedRef = false;
  pubMedId: string = null;
  apiError: APIError = null;
  cantoCommunityCuratorName: string = null;
  refAnnotationStatus: string = null;
  jbrowseTrackLabels: Array<string> = [];
  jbrowsePath = '';
  multiOrgMode = getAppConfig().isMultiOrganismMode();
  graphicalAbstractImagePath: string = null;

  constructor(private pombaseApiService: PombaseAPIService,
              private route: ActivatedRoute,
              private titleService: Title,
              private readonly meta: Meta,
             ) {
    this.siteName = this.appConfig.site_name;
  }

  setPageTitle(): void {
    let title = this.appConfig.site_name + ' - Reference - ';
    if (this.refDetails) {
      title += this.refDetails.uniquename;
      if (this.refDetails.title) {
        title += ' - ' + this.refDetails.title;
      }
    } else {
      title = 'UNKNOWN';
    }
    this.titleService.setTitle(title);
    this.meta.updateTag({property: 'og:title', content: title});
    this.meta.updateTag({property: 'description', content: title});
  }

  setCantoFields(): void {
    if (this.refDetails.canto_curator_role &&
        this.refDetails.canto_curator_role === 'community' &&
        this.refDetails.canto_curator_name) {
      this.cantoCommunityCuratorName = this.refDetails.canto_curator_name;
    }
  }

  setVisibleSections(): void {
    this.visibleSections = [];

    for (let annotationTypeName of this.annotationTypeNames) {
      if (this.refDetails.cv_annotations[annotationTypeName] &&
          this.refDetails.cv_annotations[annotationTypeName].length > 0) {
        this.visibleSections.push(annotationTypeName);
      }


      if (annotationTypeName === 'physical_interactions') {
        if (this.refDetails.physical_interactions &&
            this.refDetails.physical_interactions.length > 0) {
          this.visibleSections.push(annotationTypeName);
        }
      }

      if (annotationTypeName === 'genetic_interactions') {
        if (this.refDetails.genetic_interactions &&
            this.refDetails.genetic_interactions.length > 0) {
          this.visibleSections.push(annotationTypeName);
        }
      }

      if (annotationTypeName === 'orthologs') {
        if (this.refDetails.ortholog_annotations &&
            this.refDetails.ortholog_annotations.length > 0) {
          this.visibleSections.push(annotationTypeName);
        }
      }

      if (annotationTypeName === 'paralogs') {
        if (this.refDetails.paralog_annotations &&
            this.refDetails.paralog_annotations.length > 0) {
          this.visibleSections.push(annotationTypeName);
        }
      }
    }
  }

  setAnnotationStatus() {
    if (Object.keys(this.refDetails.cv_annotations).length > 0 ||
        this.refDetails.genetic_interactions.length > 0 ||
        this.refDetails.physical_interactions.length > 0 ||
        this.refDetails.paralog_annotations.length > 0 ||
        this.refDetails.ortholog_annotations.length > 0) {
      this.refAnnotationStatus = 'has-annotations';
    } else {
      if (this.refDetails.canto_triage_status === 'Curatable' &&
          !this.refDetails.approved_date) {
        this.refAnnotationStatus = 'not-curated';
      } else {
        this.refAnnotationStatus = 'no-annotation';
      }
    }
  }

  setGraphicalAbstract(): void {
    this.graphicalAbstractImagePath = null;
    for (const panelConf of this.appConfig.frontPagePanels) {
      if (panelConf.panel_type === 'spotlight' && panelConf.head_image &&
          panelConf.reference_id && panelConf.reference_id === this.refDetails.uniquename) {
         const filteredImages = panelConf.head_image.filter(path => !path.endsWith('.mp4'));
         if (filteredImages.length > 0) {
           this.graphicalAbstractImagePath = Util.randElement(filteredImages);
         }
       }
     }
  }

  setJBrowseTrackLabels() {
    const tracks = getJBrowseTracksByPMID(this.refDetails.uniquename);
    if (tracks) {
      this.jbrowseTrackLabels = [];
      let totalLength = 0;
      // make sure the URL doesn't get too long
      for (const track of tracks) {
        this.jbrowseTrackLabels.push(track.label);
        totalLength += track.label.length;
        if (totalLength >= 1800) {
          break;
        }
      }
      this.jbrowsePath = encodeURI('/jbrowse/?tracks=' + this.jbrowseTrackLabels.join(','));
    } else {
      this.jbrowseTrackLabels = [];
    }
  }

  hasJBrowseTracks(): boolean {
    return this.jbrowseTrackLabels.length > 0;
  }

  ngOnInit() {
    this.route.params.forEach((params: Params) => {
      if (params['uniquename'] !== undefined) {
        let uniquename = params['uniquename'];
        this.pombaseApiService.getReference(uniquename)
          .then(refDetails => {
            this.refDetails = refDetails;
            this.annotationTypeNames = this.config.annotationTypeOrder;
            let re = /(PMID):(\d+)/i;
            let matches = refDetails.uniquename.match(re);
            if (matches) {
              this.isPubMedRef = true;
              this.pubMedId = matches[2];
            }
            this.setPageTitle();
            this.setCantoFields();
            this.setVisibleSections();
            this.apiError = null;
            this.setAnnotationStatus();
            this.setGraphicalAbstract();
            this.setJBrowseTrackLabels();
          })
          .catch(error => {
            this.apiError = error;
          });
      };
    });
  }
}
