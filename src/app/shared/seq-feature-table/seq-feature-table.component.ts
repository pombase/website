import { Component, OnInit } from '@angular/core';

import { PombaseAPIService, FeatureShort } from '../../pombase-api.service';
import { getAppConfig, AppConfig } from '../../config';

interface DisplayFeatureShort extends FeatureShort {
  jBrowseURL: string;
  chromosomeDisplayId: string;
}

@Component({
  selector: 'app-seq-feature-table',
  templateUrl: './seq-feature-table.component.html',
  styleUrls: ['./seq-feature-table.component.css']
})
export class SeqFeatureTableComponent implements OnInit {

  appConfig: AppConfig = getAppConfig();
  seqFeatures: Array<DisplayFeatureShort> = null;

  constructor(pombaseApiService: PombaseAPIService) {
    pombaseApiService.getSeqFeaturePageFeatures()
      .then(features => {
        this.seqFeatures = features as Array<DisplayFeatureShort>;
        this.seqFeatures.map((feat: DisplayFeatureShort) => {
          const chrDisplayId = this.appConfig.chromosomes[feat.location.chromosome_name].export_id;

          const tracks = 'PomBase%20forward%20strand%20features%2CPomBase%20reverse%20strand%20features%2CDNA%20sequence';

          feat.jBrowseURL =
            `/jbrowse/?loc=${chrDisplayId}%3A${feat.location.start_pos}..${feat.location.end_pos}&tracks=${tracks}`;
          feat.chromosomeDisplayId = chrDisplayId;

          const typeDisplayName =
            this.appConfig.termDisplayNames[feat.feature_type];

          if (typeDisplayName) {
            feat.feature_type = typeDisplayName;
          }
        });
        this.seqFeatures.sort((a, b) => {
          return a.feature_type.localeCompare(b.feature_type)
            ||
          a.chromosomeDisplayId.localeCompare(b.chromosomeDisplayId)
            ||
          a.location.start_pos - b.location.start_pos;
        })
      });
  }

  ngOnInit(): void {
  }
}
