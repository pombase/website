import { Component, OnInit } from '@angular/core';
import { PombaseAPIService, StatCountsByTaxon, StatsIntegerTable } from '../pombase-api.service';
import { ConfigOrganism, getAppConfig } from '../config';

@Component({
  selector: 'app-curation-stats',
  templateUrl: './curation-stats.component.html',
  styleUrls: ['./curation-stats.component.css']
})
export class CurationStatsComponent implements OnInit {
  organismStats: StatCountsByTaxon | undefined = undefined;
  configOrganism: ConfigOrganism | undefined = undefined;
  appConfig = getAppConfig();

  annotationGroupTotals: Array<[string, number]> = [];

  cumulativeByYearPlotLoaded = false;
  cumulativeAnnotationByYearPlotLoaded = false;
  curatedByYearPlotLoaded = false;
  curatableByYearPlotLoaded = false;
  communityResponseRates = false;

  constructor(private pombaseApiService: PombaseAPIService) { }

  setAnnotationGroupTotals(annotationTypeCountsByYear: StatsIntegerTable) {
    let { header, data } = annotationTypeCountsByYear;

    let totals: { [groupName: string]: number } = {};

    const statsConfig = this.appConfig.stats;

    header.forEach((cvName, idx) => {
      let groupConfig = undefined;
      for (const conf of statsConfig.annotation_type_groups) {
        if (conf.cv_names.includes(cvName)) {
          groupConfig = conf;
          break;
        }
      }
      if (!groupConfig) {
        return;
      }

      const groupName = groupConfig.display_name;

      for (const dataRow of data) {
        if (totals[groupName]) {
          totals[groupName] += dataRow[1][idx];
        } else {
          totals[groupName] = dataRow[1][idx];
        }
      }
    });

    this.annotationGroupTotals = [];

    for (const groupConf of statsConfig.annotation_type_groups) {
      const groupName = groupConf.display_name;
      this.annotationGroupTotals.push([groupName, totals[groupName]]);
    }
  }

  ngOnInit() {
    this.configOrganism = this.appConfig.getConfigOrganism();

    this.pombaseApiService.getStatistics()
      .then(stats => {
        if (this.configOrganism) {
          this.organismStats = stats.by_taxon[this.configOrganism.taxonid];

          if (this.organismStats.annotation_type_counts_by_year) {
            this.setAnnotationGroupTotals(this.organismStats.annotation_type_counts_by_year);
          }
        }
      });
  }
}
