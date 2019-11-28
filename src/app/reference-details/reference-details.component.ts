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
  siteName = this.appConfig.site_name;

  visibleSections: Array<string> = [];
  config: AnnotationTableConfig = getAnnotationTableConfig();
  isPubMedRef = false;
  pubMedId: string = null;
  apiError: APIError = null;
  cantoCommunityCuratorName: string = null;
  cantoTriageStatus: string = 'UNKNOWN';
  refAnnotationStatus: string = null;
  multiOrgMode = getAppConfig().isMultiOrganismMode();
  graphicalAbstractImagePath: string = null;
  videoPath: string = null;

  constructor(private pombaseApiService: PombaseAPIService,
              private route: ActivatedRoute,
              private titleService: Title,
              private readonly meta: Meta,
             ) { }

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
    this.cantoTriageStatus = this.refDetails.canto_triage_status;
  }

  setVisibleSections(): void {
    this.visibleSections = [];

    if (getJBrowseTracksByPMID(this.refDetails.uniquename).length > 0) {
      this.visibleSections.push('jbrowse_tracks');
    }

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
        const selectedPath = Util.randElement(panelConf.head_image);
        if (selectedPath.endsWith('.mp4')) {
          this.videoPath = selectedPath;
          this.graphicalAbstractImagePath = null;
        } else {
          this.graphicalAbstractImagePath = selectedPath;
          this.videoPath = null;
        }
      }
    }
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
          })
          .catch(error => {
            this.apiError = error;
          });
      };
    });
  }
}
