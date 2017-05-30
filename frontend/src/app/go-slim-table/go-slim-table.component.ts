import { Component, OnInit } from '@angular/core';

import { PombaseAPIService } from '../pombase-api.service';

@Component({
  selector: 'app-go-slim-table',
  templateUrl: './go-slim-table.component.html',
  styleUrls: ['./go-slim-table.component.css']
})
export class GoSlimTableComponent implements OnInit {

  goSlimSubset = null;
  apiError = null;

  constructor(private pombaseApiService: PombaseAPIService) { }

  ngOnInit() {
    this.pombaseApiService.getTermSubsets()
      .then(subsets => this.goSlimSubset = subsets['bp_goslim_pombe'])
      .catch(error => {
        this.apiError = error;
      });
 }
}
