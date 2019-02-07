import { Component, OnInit } from '@angular/core';

import { PombaseAPIService, TermSubsetDetails, GeneSubsetDetails, APIError } from '../../pombase-api.service';

@Component({
  selector: 'app-disease-slim-table',
  templateUrl: './disease-slim-table.component.html',
  styleUrls: ['./disease-slim-table.component.css']
})
export class DiseaseSlimTableComponent implements OnInit {

  slimSubset: TermSubsetDetails = null;
  apiError: APIError = null;

  constructor(private pombaseApiService: PombaseAPIService) {

    this.pombaseApiService.getTermSubsets()
    .then(subsets => {
      this.slimSubset = Object.assign({}, subsets['disease_ontology_slim']);
      this.slimSubset.elements.sort((a, b) => a.name.localeCompare(b.name));
    })
    .catch(error => {
      this.apiError = error;
    });
  }

  ngOnInit() {

  }
}
