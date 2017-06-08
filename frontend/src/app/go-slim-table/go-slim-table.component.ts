import { Component, OnInit } from '@angular/core';

import { PombaseAPIService, TermSubsetDetails } from '../pombase-api.service';

@Component({
  selector: 'app-go-slim-table',
  templateUrl: './go-slim-table.component.html',
  styleUrls: ['./go-slim-table.component.css']
})
export class GoSlimTableComponent implements OnInit {

  goSlimSubset: TermSubsetDetails = null;
  nonSlimWithBP = null;
  nonSlimWithoutBP = null;
  apiError = null;

  constructor(private pombaseApiService: PombaseAPIService) { }

  ngOnInit() {
    this.pombaseApiService.getTermSubsets()
      .then(subsets => {
        this.goSlimSubset = Object.assign({}, subsets['bp_goslim_pombe']);
        this.goSlimSubset.elements.sort((a, b) => a.name.localeCompare(b.name));
      })
      .catch(error => {
        this.apiError = error;
      });
    this.pombaseApiService.getGeneSubsets()
      .then(subsets => {
        this.nonSlimWithBP = subsets['non_go_slim_with_bp_annotation'];
        this.nonSlimWithoutBP = subsets['non_go_slim_without_bp_annotation'];
      })
      .catch(error => {
        this.apiError = error;
      });
  }
}
