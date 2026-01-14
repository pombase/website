import { Component, OnInit } from '@angular/core';

import { getAppConfig } from '../../config';
import { FeatureTypeSummary, PombaseAPIService } from '../../pombase-api.service';

@Component({
  selector: 'app-feature-stats',
  templateUrl: './feature-stats.component.html',
  styleUrl: './feature-stats.component.css',
  standalone: false
})
export class FeatureStatsComponent implements OnInit {
  constructor(private pombaseApiService: PombaseAPIService) {}
  appConfig = getAppConfig();

  chrDisplayNameMap: { [name: string]: string } = {};

  featureTypeSummaries: Array<FeatureTypeSummary> = [];

  total(typeSumm: FeatureTypeSummary): number {
    let total = 0;

    for (const chrCount of Object.values(typeSumm.by_chromosome)) {
      total += chrCount;
    }

    return total;
  }

  ngOnInit(): void {
    const featureTypeSummPromise =
      this.pombaseApiService.getFeatureTypeSummariesPromise();

    featureTypeSummPromise.then(summaries => this.featureTypeSummaries = summaries);

    for (const chr of this.appConfig.chromosomes) {
      this.chrDisplayNameMap[chr.name] = chr.short_display_name;
    }
  }
}
