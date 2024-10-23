import { Component, Input } from '@angular/core';

import { GeneDetails, ProteinViewTrack } from '../pombase-api.service';
import { PombaseAPIService, ProteinViewData } from '../pombase-api.service';

interface DisplayFeature {
  name: string;
  positions: string;
}

interface DisplayTrack {
  name: string;
  isSingleRow: boolean;
  features: Array<DisplayFeature>;
}

@Component({
  selector: 'app-protein-feature-table',
  templateUrl: './protein-feature-table.component.html',
  styleUrls: ['./protein-feature-table.component.css']
})
export class ProteinFeatureTableComponent {
  @Input() geneDetails: GeneDetails

  proteinViewData?: ProteinViewData;
  displayTracks: Array<DisplayTrack> = [];

  constructor(private pombaseApiService: PombaseAPIService) {
  }

  makeDisplayTracks(data: ProteinViewData): Array<DisplayTrack> {
    const makeDisplayFeatures = (trackData: ProteinViewTrack) => {
      return trackData.features.map(feature => {
        const positions = feature.positions
              .map(pos => {
                if (pos[1] == pos[2]) {
                  return pos[1];
                } else {
                  return pos[1] + '..' + pos[2];
                }
              })
              .join(',');
        let name = feature.display_name || feature.id;
        // don't repeat the position in the name:
        name = name
          .split(' ')
          .filter(bit => bit != positions && bit != positions + '..' + positions)
          .join(' ');
        if (name == trackData.name) {
          name = '';
        }
        return {
          name,
          positions,
        }
      });
    };
    return data.tracks
      .filter(track => track.features.length > 0)
      .map((track) => {
        const displayFeatures = makeDisplayFeatures(track);
        let isSingleRow = false;
        if (displayFeatures.length == 1 && displayFeatures[0].name == '') {
          isSingleRow = true;
        }
        return {
          name: track.name,
          isSingleRow,
          features: displayFeatures,
        };
    });
  }

  ngOnInit(): void {
    const promise =
      this.pombaseApiService.getProteinViewData(this.geneDetails.uniquename, 'full');
    promise.then(data => {
      this.proteinViewData = data;
      this.displayTracks = this.makeDisplayTracks(data);
    });
  }
}
