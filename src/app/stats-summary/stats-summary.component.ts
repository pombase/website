import { Component } from '@angular/core';
import { Metadata, DatabaseStatistics, StatCountsByTaxon,
         PombaseAPIService,
         StatsIntegerTable} from '../pombase-api.service';
import { getAppConfig, ConfigOrganism } from '../config';

@Component({
  selector: 'app-stats-summary',
  templateUrl: './stats-summary.component.html',
  styleUrls: ['./stats-summary.component.css']
})
export class StatsSummaryComponent {

  metadata: Metadata|undefined = undefined;
  stats: DatabaseStatistics|undefined = undefined;
  organismStats: StatCountsByTaxon|undefined = undefined;
  configOrganism: ConfigOrganism|undefined = undefined;
  curatedPublicationsCount = 0;
  dbCreationDate: string|undefined = undefined;
  appConfig = getAppConfig();

  annotationGroupTotals: Array<[string, number]> = [];

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

    this.pombaseApiService.getMetadata()
      .then(metadata => {
        this.metadata = metadata;
        const dateVersionMatch = this.metadata.date_version.match(/^\d\d\d\d-\d\d-\d\d/g);
        if (dateVersionMatch) {
          this.dbCreationDate = dateVersionMatch[0];
        } else {
          this.dbCreationDate = metadata.db_creation_datetime.split(' ')[0];
        }
      });

    this.pombaseApiService.getStatistics()
      .then(stats => {
        this.stats = stats;
        if (this.configOrganism) {
          this.organismStats = stats.by_taxon[this.configOrganism.taxonid];

          this.curatedPublicationsCount =
           stats.community_pubs_count + stats.non_community_pubs_count;

          if (this.organismStats.annotation_type_counts_by_year) {
            this.setAnnotationGroupTotals(this.organismStats.annotation_type_counts_by_year);
          }
        }
      });
  }
}