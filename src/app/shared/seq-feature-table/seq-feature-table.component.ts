import { Component, OnInit } from '@angular/core';

import { PombaseAPIService, FeatureShort } from '../../pombase-api.service';
import { getAppConfig, AppConfig } from '../../config';

interface DisplayFeatureShort extends FeatureShort {
  jBrowseURL: string;
}

@Component({
  selector: 'app-seq-feature-table',
  templateUrl: './seq-feature-table.component.html',
  styleUrls: ['./seq-feature-table.component.css']
})
export class SeqFeatureTableComponent implements OnInit {

  appConfig: AppConfig = getAppConfig();
  seqFeatures: Array<FeatureShort> = null;

  constructor(pombaseApiService: PombaseAPIService) {
    pombaseApiService.getSeqFeaturePageFeatures()
      .then(features => {
        this.seqFeatures = features;
        features.map((feat: DisplayFeatureShort) => {
          const chrDisplayName = this.appConfig.chromosomes[feat.location.chromosome_name].export_id;

          const tracks = 'PomBase%20forward%20strand%20features%2CPomBase%20reverse%20strand%20features%2CDNA%20sequence';

          feat.jBrowseURL =
            `/jbrowse/?loc=${chrDisplayName}%3A${feat.location.start_pos}..${feat.location.end_pos}&tracks=${tracks}`;
        });
        features.sort((a, b) => {
          return a.feature_type.localeCompare(b.feature_type)
            ||
          a.location.chromosome_name.localeCompare(b.location.chromosome_name)
            ||
          a.location.start_pos - b.location.start_pos;
        })
      });
  }

  ngOnInit(): void {
  }
}
