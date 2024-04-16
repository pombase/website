import { Component } from '@angular/core';
import { Metadata, DatabaseStatistics, PombaseAPIService} from '../pombase-api.service';
import { getAppConfig, ConfigOrganism } from '../config';

@Component({
  selector: 'app-stats-summary',
  templateUrl: './stats-summary.component.html',
  styleUrls: ['./stats-summary.component.css']
})
export class StatsSummaryComponent {

  metadata: Metadata|undefined = undefined;
  stats: DatabaseStatistics|undefined = undefined;
  configOrganism: ConfigOrganism|undefined = undefined;
  curatedPublicationsCount = 0;
  dbCreationDate: string|undefined = undefined;
  appConfig = getAppConfig();

  constructor(private pombaseApiService: PombaseAPIService) { }

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
        this.curatedPublicationsCount =
          stats.community_pubs_count + stats.non_community_pubs_count;
      });
  }
}