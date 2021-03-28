import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';

import { TrackViewFeature, TrackViewTrack } from '../track-view-track';
import { ProteinDetails } from '../pombase-api.service';
import { getAppConfig } from '../config';

class DisplayTrack {
  constructor(public label: string|null,
              public dbName: string,
              public feature: TrackViewFeature) {

  }
}

@Component({
  selector: 'app-track-view',
  templateUrl: './track-view.component.html',
  styleUrls: ['./track-view.component.css']
})
export class TrackViewComponent implements OnInit, OnChanges {
  @Input() trackViewData: Array<TrackViewTrack>;
  @Input() protein: ProteinDetails;
  @Input() highlightedId: string;
  @Output() highlightedIdChange = new EventEmitter<string>();

  appConfig = getAppConfig();
  featureFeaturesConfig = this.appConfig.proteinFeatures;
  trackColors: { [dbName: string]: string } = {};

  displayTracks: Array<DisplayTrack> = [];

  totalHeight = 0;

  constructor() { }

  featureHeight(): number {
    return 6;
  }

  featureLabelHeight(): number {
    return 17;
  }

  trackLabelWidth(): number {
    return 120;
  }

  trackWidth(): number {
    return 600;
  }

  widthScaleFactor(): number {
    return 1.0 * this.trackWidth() / this.protein.number_of_residues;
  }

  viewBox(): string {
    return `-5 -5 ${this.trackWidth()+this.trackLabelWidth()+50} ${this.totalHeight+10}`;
  }

  setHighlighted(id: string) {
    this.highlightedId = id;
    this.highlightedIdChange.emit(id);
  }

  ngOnInit(): void {
    Object.keys(this.featureFeaturesConfig.track_config)
      .map(dbName => {
        const trackConfig = this.featureFeaturesConfig.track_config[dbName];
        if (trackConfig) {
          this.trackColors[dbName] = trackConfig.colour || null;
        }
      });
  }

  ngOnChanges(): void {
    this.totalHeight = 0;
    this.displayTracks = [];
    for (const track of this.trackViewData) {
      this.totalHeight += track.features.length * (this.featureHeight() + this.featureLabelHeight());

      for (let i = 0; i < track.features.length; i++) {
        let label = null;
        if (i == 0) {
          label = track.label;
        }
        const feature = track.features[i];
        const displayTrack = new DisplayTrack(label, track.dbName, feature);
        this.displayTracks.push(displayTrack);
      }
    }
  }
}
