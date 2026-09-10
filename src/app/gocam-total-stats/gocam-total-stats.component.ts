import { Component } from '@angular/core';

import { GoCamTotalStats, PombaseAPIService } from '../pombase-api.service';

@Component({
  selector: 'app-gocam-total-stats',
  imports: [],
  templateUrl: './gocam-total-stats.component.html',
  styleUrl: './gocam-total-stats.component.css',
  standalone: false,
})
export class GocamTotalStatsComponent {
  stats?: GoCamTotalStats;

  constructor(pombaseApi: PombaseAPIService) {
    pombaseApi.getGoCamTotalStats()
      .then((stats: GoCamTotalStats) => this.stats = stats);
  }
}
