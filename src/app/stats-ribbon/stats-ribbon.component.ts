import { Component, OnInit } from '@angular/core';

import { Metadata, DatabaseStatistics, StatCountsByTaxon,
         PombaseAPIService } from '../pombase-api.service';
import { getAppConfig, ConfigOrganism } from '../config';

@Component({
  selector: 'app-stats-ribbon',
  templateUrl: './stats-ribbon.component.html',
  styleUrls: ['./stats-ribbon.component.css']
})
export class StatsRibbonComponent implements OnInit {
  metadata: Metadata|undefined = undefined;
  stats: DatabaseStatistics|undefined = undefined;
  organismStats: StatCountsByTaxon|undefined = undefined;
  configOrganism: ConfigOrganism|undefined = undefined;
  curatedPublicationsCount = 0;
  dbCreationDate: string|undefined = undefined;

  constructor(private pombaseApiService: PombaseAPIService) { }

  ngOnInit() {

    this.configOrganism = getAppConfig().getConfigOrganism();

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
        }
      });
  }
}
