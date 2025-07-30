import { Component } from '@angular/core';
import { PombaseAPIService } from '../pombase-api.service';

@Component({
  selector: 'app-gocam-project-scope',
  templateUrl: './gocam-project-scope.component.html',
  styleUrl: './gocam-project-scope.component.css',
  standalone: false
})
export class GocamProjectScopeComponent {
  modelCount = 0;

  constructor(pombaseApi: PombaseAPIService) {
    pombaseApi.getAllGoCamDetailsMap()
      .then(results => {
        this.modelCount = Object.keys(results).length;
      })
  }
}
