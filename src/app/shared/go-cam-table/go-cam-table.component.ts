import { Component } from '@angular/core';
import { GoCamSummary, PombaseAPIService } from '../../pombase-api.service';

@Component({
    selector: 'app-go-cam-table',
    templateUrl: './go-cam-table.component.html',
    styleUrls: ['./go-cam-table.component.css'],
    standalone: false
})
export class GoCamTableComponent {
  gocams: Array<GoCamSummary> = [];

  constructor(private pombaseApiService: PombaseAPIService) {
    this.pombaseApiService.getAllGoCamSummaries()
      .then(results => this.gocams = results);
  }
}
