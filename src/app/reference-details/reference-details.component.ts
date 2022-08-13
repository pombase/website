import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';

import { getAnnotationTableConfig, AnnotationTableConfig,
         getAppConfig, AppConfig, getJBrowseTracksByPMID, getXrfWithPrefix, DetailsPageLinkConfig } from '../config';
import { Util } from '../shared/util';

import { ReferenceDetails, PombaseAPIService, APIError, AnnotationCurator } from '../pombase-api.service';

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
  pubMedId?: string;
  apiError?: APIError;
  cantoCuratorName?: string;
  hasStaffCurator = false;
  cantoTriageStatus = 'UNKNOWN';

  multiOrgMode = getAppConfig().isMultiOrganismMode();
  graphicalAbstractImagePath?: string;
  showBigGraphicalAbstract = false;
  bigGraphicalAbstractImagePath?: string;
  videoPath?: string;
  doiUrl?: string;

  communityCuratorNames?: string;
  adminCuratorList: Array<AnnotationCurator> = [];

  externalLinks?: Array<DetailsPageLinkConfig>;

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
    this.cantoCuratorName = undefined;

    this.cantoTriageStatus = this.refDetails.canto_triage_status;

    this.hasStaffCurator = true;

    this.communityCuratorNames = undefined;
    this.adminCuratorList = [];

    let communityCuratorList = [];

    for (const curator of this.refDetails.annotation_curators) {
      if (curator.community_curator) {
        communityCuratorList.push(curator.name);
        this.hasStaffCurator = false
      } else {
        if (this.appConfig.show_names_of_staff_curators) {
          this.adminCuratorList.push(curator);
        }
      }
    }

    if (communityCuratorList.length == 1) {
      this.communityCuratorNames = communityCuratorList[0];
    } else {
      if (communityCuratorList.length > 1) {
        const lastName = communityCuratorList.pop();
        this.communityCuratorNames = communityCuratorList.join(', ') + ' and ' + lastName;
      }
    }
  }

  hasApprovedSession(): boolean {
    return !!this.refDetails.canto_approved_date;
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

  isCuratable(): boolean {
    return !!this.cantoTriageStatus && (this.cantoTriageStatus === 'Curatable' ||
      this.hasPossibleBrowserTracks());
  }

  hasPossibleBrowserTracks(): boolean {
    return this.appConfig.canto_data_config.browser_track_triage_types.includes(this.cantoTriageStatus);
  }

  hasBrowserTracks(): boolean {
    return getJBrowseTracksByPMID(this.refDetails.uniquename).length > 0;
  }

  hasAnnotations(): boolean {
    if (Object.keys(this.refDetails.cv_annotations).length > 0 ||
        this.refDetails.genetic_interactions.length > 0 ||
        this.refDetails.physical_interactions.length > 0 ||
        this.refDetails.paralog_annotations.length > 0 ||
        this.refDetails.ortholog_annotations.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  hasCantoSession(): boolean {
    return !!this.refDetails.canto_curator_name;
  }

  isAdminSession(): boolean {
    return this.hasCantoSession() && this.refDetails.canto_curator_role.toLowerCase() !== 'community';
  }

  displayBigGraphicalAbstract(): void {
    this.showBigGraphicalAbstract = true;
  }

  setGraphicalAbstract(): void {
    this.graphicalAbstractImagePath = undefined;
    this.videoPath = undefined;
    let selectedPath = null;
    for (const panelConf of this.appConfig.frontPagePanels) {
      if (panelConf.panel_type === 'spotlight' && panelConf.head_image &&
          panelConf.reference_id && panelConf.reference_id === this.refDetails.uniquename) {
        selectedPath = Util.randElement(panelConf.head_image);
        if (selectedPath.endsWith('.mp4')) {
          this.videoPath = selectedPath;
        } else {
          this.graphicalAbstractImagePath = 'assets/' + selectedPath;
        }
        break;
      }
    }

    this.bigGraphicalAbstractImagePath = undefined;

    if (selectedPath) {
      const match = /^spotlight\/(.*)\.png$/.exec(selectedPath);
      if (match) {
        const imageBaseName = match[1];
        if (this.appConfig.graphicalAbstractFileNames.has(imageBaseName + '.png')) {
          this.bigGraphicalAbstractImagePath = 'assets/graphical_abstract/' + imageBaseName + '.png';
        } else {
          if (this.appConfig.graphicalAbstractFileNames.has(imageBaseName + '.jpg')) {
            this.bigGraphicalAbstractImagePath = 'assets/graphical_abstract/' + imageBaseName + '.jpg';
          }
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
            this.apiError = undefined;
            this.refDetails = refDetails;
            this.externalLinks = this.appConfig.refPageExtraLinks[this.refDetails.uniquename];
            this.annotationTypeNames = this.config.annotationTypeOrder;
            let re = /(PMID):(\d+)/i;
            let matches = refDetails.uniquename.match(re);
            if (matches) {
              this.isPubMedRef = true;
              this.pubMedId = matches[2];
            } else {
              this.isPubMedRef = false;
              this.pubMedId = undefined;
            }
            this.setPageTitle();
            this.setCantoFields();
            this.setVisibleSections();

            this.setGraphicalAbstract();
            if (refDetails.doi) {
              this.doiUrl = getXrfWithPrefix('DOI', refDetails.doi)?.url;
            } else {
              this.doiUrl = undefined;
            }
          })
          .catch(error => {
            this.apiError = error;
          });
      };
    });
  }
}
