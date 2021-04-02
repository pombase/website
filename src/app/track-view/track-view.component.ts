import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';

import { TrackViewFeature, TrackViewFeaturePart, TrackViewTrack } from '../track-view-track';
import { ProteinDetails } from '../pombase-api.service';
import { getAppConfig } from '../config';

class DisplayTrack {
  constructor(public dbFirstRowLabel: string|null,
              public dbLabel: string,
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
  @Input() highlightedId?: string;
  @Output() highlightedIdChange = new EventEmitter<string>();

  appConfig = getAppConfig();
  featureFeaturesConfig = this.appConfig.proteinFeatures;
  trackColors: { [dbName: string]: string } = {};

  displayTracks: Array<DisplayTrack> = [];

  currentDisplayTrack?: DisplayTrack;
  currentFeaturePart?: TrackViewFeaturePart;

  totalHeight = 0;

  scaleMarkMinSpacing = 100;
  scaleMarkPositions: Array<number> = [];

  constructor() { }

  featureHeight(): number {
    return 6;
  }

  featureLabelHeight(): number {
    return 17;
  }

  trackLabelWidth(): number {
    return 100;
  }

  trackWidth(): number {
    return 600;
  }

  scaleBarY(): number {
    return this.totalHeight + 10
  }

  widthScaleFactor(): number {
    return 1.0 * this.trackWidth() / this.protein.number_of_residues;
  }

  viewBox(): string {
    return `-5 -5 ${this.trackWidth()+this.trackLabelWidth()+100} ${this.totalHeight+60}`;
  }

  mouseEnter(currentDisplayTrack: DisplayTrack,
             currentFeaturePart?: TrackViewFeaturePart) {
    this.currentDisplayTrack = currentDisplayTrack;
    this.currentFeaturePart = currentFeaturePart;
    const id = currentDisplayTrack.feature.id;
    this.highlightedId = id;
    this.highlightedIdChange.emit(id);
  }

  mouseLeave(_: string) {
  }

  ngOnInit(): void {
    Object.keys(this.featureFeaturesConfig.track_config)
      .map(dbName => {
        const trackConfig = this.featureFeaturesConfig.track_config[dbName];
        if (trackConfig) {
          this.trackColors[dbName] = trackConfig.colour;
        }
      });
  }

  ngOnChanges(): void {
    this.totalHeight = 0;
    this.displayTracks = [];
    for (const track of this.trackViewData) {
      this.totalHeight +=
        track.features.length * (this.featureHeight() + this.featureLabelHeight());

      for (let i = 0; i < track.features.length; i++) {
        let dbFirstRowLabel = null;
        if (i == 0) {
          dbFirstRowLabel = track.label;
        }
        const feature = track.features[i];
        const displayTrack =
          new DisplayTrack(dbFirstRowLabel, track.label, track.dbName, feature);
        this.displayTracks.push(displayTrack);
      }
    }

    let scaleMarkSpacing = 10;
    if (scaleMarkSpacing * this.widthScaleFactor() < this.scaleMarkMinSpacing) {
      const scaledSpacing = this.scaleMarkMinSpacing / this.widthScaleFactor();
      if (scaledSpacing > 100) {
        scaleMarkSpacing = Math.round(scaledSpacing / 100) * 100;
      } else {
        scaleMarkSpacing = Math.round(scaledSpacing / 10) * 10;
      }
    }

    this.scaleMarkPositions = [];

    for (let pos = scaleMarkSpacing;
         pos < this.protein.number_of_residues;
         pos += scaleMarkSpacing) {
      this.scaleMarkPositions.push(pos);
    }
  }
}
