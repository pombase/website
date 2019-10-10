import { Component, OnInit, OnChanges, Input, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { ToastrService } from 'ngx-toastr';

import { getJBrowseTracksByPMID, JBrowseTrackInfo, getAppConfig, JBrowseColumnConfig } from '../config';

const JBROWSE_URL_LIMIT = 1500;

@Component({
  selector: 'app-jbrowse-track-picker',
  templateUrl: './jbrowse-track-picker.component.html',
  styleUrls: ['./jbrowse-track-picker.component.css']
})
export class JbrowseTrackPickerComponent implements OnInit, OnChanges {
  @Input() refUniquename: string;

  tracks: Array<JBrowseTrackInfo> = [];
  colConfig: Array<JBrowseColumnConfig> = [];
  tracksVisible = true;
  allSelected = false;
  selectedTracks: { [key: string]: boolean } = {};
  selectedTrackCount = 0;
  selectedLabelLength = 0;

  constructor(@Inject(DOCUMENT) private document: Document,
              private toastr: ToastrService) {
  }

  hasTracks(): boolean {
    return this.tracks.length > 0;
  }

  selectAll() {
    this.tracks.map(track => {
      this.selectedTracks[track.label] = false;
    });

    this.selectedLabelLength = 0;
    this.selectedTrackCount = 0;

    if (!this.allSelected) {
      return;
    }

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

  trackSelected(label: string) {
    if (this.selectedTracks[label]) {
      this.selectedLabelLength += label.length;
    } else {
      this.selectedLabelLength -= label.length;
      this.allSelected = false;
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
    return this.selectedCount() == 0;
  }

  selectCheckboxesDisabled(): boolean {
    return this.selectedLabelLength > JBROWSE_URL_LIMIT;
  }

  loadInJBrowse() {
    let labels = getAppConfig().defaultJBrowseTracks.map(track => track.label);
    this.tracks.filter(track => this.selectedTracks[track.label])
      .map(track => labels.push(track.label));
    let path = encodeURI('/jbrowse/?tracks=' + labels.join(','));
    this.document.location.href = path;
  }

  setTracks() {
    this.tracks = getJBrowseTracksByPMID(this.refUniquename);
    this.tracks.map(track => {
      this.selectedTracks[track.label] = false;
    });

    this.colConfig = [];

    getAppConfig().refPageJBrowseColumns.map(colConf => {
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
