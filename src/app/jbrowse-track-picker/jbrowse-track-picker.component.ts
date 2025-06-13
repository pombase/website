import { Component, OnInit, OnChanges, Input, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { ToastrService } from 'ngx-toastr';

import { getJBrowseTracksByPMID, JBrowseTrackInfo, getAppConfig, JBrowseColumnConfig, getJBrowseTracksByGeneName } from '../config';

const JBROWSE_URL_LIMIT = 1500;

@Component({
    selector: 'app-jbrowse-track-picker',
    templateUrl: './jbrowse-track-picker.component.html',
    styleUrls: ['./jbrowse-track-picker.component.css'],
    standalone: false
})
export class JbrowseTrackPickerComponent implements OnInit, OnChanges {
  @Input() identifier: string;
  @Input() identifierType: 'gene'|'reference';

  appConfig = getAppConfig();

  tracks: Array<JBrowseTrackInfo> = [];
  colConfig: Array<JBrowseColumnConfig> = [];
  tracksVisible = true;

  hasJBrowse2 = !!getAppConfig().jbrowse2DefaultTrackIds;

  selectedTracks: { [key: string]: boolean } = {};
  selectedTrackCount = 0;
  selectedLabelLength = 0;

  orderByFieldName = '+label';

  constructor(@Inject(DOCUMENT) private document: Document,
              private toastr: ToastrService) {
  }

  hasTracks(): boolean {
    return this.tracks.length > 0;
  }

  setOrderBy(fieldName: string) {
    this.orderByFieldName = '+' + fieldName;
  }

  selectAll() {
    this.selectNone();

    for (let track of this.tracks) {
      if (this.selectedLabelLength < JBROWSE_URL_LIMIT) {
        this.selectedLabelLength += track.label.length;
        this.selectedTracks[track.label] = true;
        this.selectedTrackCount++;
      } else {
        this.toastr.warning('Only ' + this.selectedTrackCount +
                            ' tracks selected due to a JBrowse limit');
        break;
      }
    }
  }

  selectNone() {
    this.tracks.map(track => {
      this.selectedTracks[track.label] = false;
    });

    this.selectedLabelLength = 0;
    this.selectedTrackCount = 0;
  }

  trackSelected(label: string) {
    if (this.selectedTracks[label]) {
      this.selectedLabelLength += label.length;
    } else {
      this.selectedLabelLength -= label.length;
    }
    if (this.selectedLabelLength > JBROWSE_URL_LIMIT) {
      this.toastr.warning('No more tracks can be selected due to a JBrowse limit');
    }

    this.setSelectedCount();
  }

  setSelectedCount() {
    this.selectedTrackCount = 0;
    this.tracks.map(track => {
      if (this.selectedTracks[track.label]) {
        this.selectedTrackCount++;
      }
    });
  }

  selectedCount(): number {
    return this.selectedTrackCount;
  }

  loadButtonDisabled(): boolean {
    return this.selectedCount() === 0;
  }

  selectCheckboxesDisabled(): boolean {
    return this.selectedLabelLength > JBROWSE_URL_LIMIT;
  }

  loadInJBrowse(jbrowseVersion: '1'|'2') {
    let tracksForUrl;
    if (jbrowseVersion == '1') {
      tracksForUrl = this.appConfig.defaultJBrowseTracks.map(track => track.label);
    } else {
      tracksForUrl = this.appConfig.jbrowse2DefaultTrackIds!;
    }
    this.tracks.filter(track => this.selectedTracks[track.label])
      .map(track => {
        if (jbrowseVersion == '1') {
          tracksForUrl.push(track.label);
        } else {
          tracksForUrl.push(track.track_id);
        }
      });
    let baseUrl;
    if (jbrowseVersion == '1') {
      baseUrl = this.appConfig.jbrowseTrackPickerBaseUrl;
    } else {
      const jbrowse2AssemblyName = getAppConfig().jbrowse2AssemblyName;
      baseUrl = this.appConfig.jbrowse2TrackPickerBaseUrl + '&assembly=' + jbrowse2AssemblyName;
    }
    let path = encodeURI(baseUrl + '&tracks=' + tracksForUrl.join(','));
    this.document.location.href = path;
  }

  setTracks() {
    if (this.identifierType == 'gene') {
      this.tracks = getJBrowseTracksByGeneName(this.identifier);
    } else {
      this.tracks = getJBrowseTracksByPMID(this.identifier);
    }
    this.tracks.map(track => {
      this.selectedTracks[track.label] = false;
    });

    this.colConfig = [];

    this.appConfig.refPageJBrowseColumns.map(colConf => {
      let isEmpty = true;
      for (let track of this.tracks) {
        if (!!(track as any)[colConf.name]) {
          isEmpty = false;
          break;
        }
      }
      if (!isEmpty) {
        this.colConfig.push(colConf);
      }
    });

    this.setSelectedCount();
  }

  showTracks() {
    this.tracksVisible = true;
  }

  ngOnInit() {
  }

  ngOnChanges() {
    this.setTracks();
  }
}
