import { Component, OnInit } from '@angular/core';
import { PombaseAPIService, DatabaseStatistics } from '../pombase-api.service';
import { getAppConfig, ConfigOrganism } from '../config';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {
  statistics: DatabaseStatistics;
  organismList: Array<ConfigOrganism>;

  constructor(private pombaseApiService: PombaseAPIService) { }

  ngOnInit() {
    const configOrganism = getAppConfig().getConfigOrganism();
    if (configOrganism) {
      this.organismList = [configOrganism];
    }
    this.pombaseApiService.getStatistics()
      .then(statistics => {
        this.statistics = statistics;
      });
  }
}
