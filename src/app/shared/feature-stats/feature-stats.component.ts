import { Component, OnInit } from '@angular/core';

import { ChromosomeConfig, getAppConfig } from '../../config';
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

  chrDetailMap: { [name: string]: ChromosomeConfig } = {};

  featureTypeSummaries: Array<[string, Array<FeatureTypeSummary>]> = [];

  makeFeatureGenesLink(featureType: string): string {
    const json = `
{"constraints":{"node_name":"subset: feature_type_${featureType}","subset":{"subset_name":"feature_type_${featureType}"}},"output_options":{}}
`;
    return `/results/from/json/${json}`;
  }

  makeChrGenesLink(chrName: string, featureType: string): string {
    const chrDisplayName = this.chrDetailMap[chrName].long_display_name;
    const json = `
{"constraints":{"and":[{"node_name":"all genes from ${chrDisplayName}","genome_range":{"chromosome_name":"${chrName}"}},{"node_name":"subset: feature_type_${featureType}","subset":{"subset_name":"feature_type_${featureType}"}}],"node_name":"subset: feature_type_${featureType} AND all genes from ${chrDisplayName}"},"output_options":{}}
`;
    return `/results/from/json/${json}`;
  }

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

    const featureTypesTableConf = this.appConfig.stats.feature_types_table;

    featureTypeSummPromise.then(summaries => {
      const summByType: { [typeName: string]: FeatureTypeSummary} = {};

      const geneSummaries: Array<FeatureTypeSummary> = [];

      for (const summ of summaries) {
        summByType[summ.type_name] = summ;
        if (summ.is_gene_type) {
          geneSummaries.push(summ);
        }
      }

      this.featureTypeSummaries.push(['Gene type', geneSummaries])

      for (const conf of featureTypesTableConf) {
        const summariesOfType: Array<FeatureTypeSummary> = [];

        for (const typeName of conf.type_names) {
          if (summByType[typeName]) {
            summariesOfType.push(summByType[typeName]);
          }
        }

        this.featureTypeSummaries.push([conf.sub_title, summariesOfType])
      }
    });

    for (const chr of this.appConfig.chromosomes) {
      this.chrDetailMap[chr.name] = chr;
    }
  }
}
