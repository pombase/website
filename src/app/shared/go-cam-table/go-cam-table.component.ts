import { Component } from '@angular/core';
import { GoCamDetails, PombaseAPIService } from '../../pombase-api.service';

@Component({
    selector: 'app-go-cam-table',
    templateUrl: './go-cam-table.component.html',
    styleUrls: ['./go-cam-table.component.css'],
    standalone: false
})
export class GoCamTableComponent {
  gocams: Array<GoCamDetails> = [];

  constructor(private pombaseApiService: PombaseAPIService) {
    this.pombaseApiService.getAllGoCamDetails()
      .then(results => this.gocams = results);
  }
}
