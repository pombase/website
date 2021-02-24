import { Component, OnInit } from '@angular/core';

import { PombaseAPIService, APIError } from '../../pombase-api.service';

interface DisplaySubset {
  name: string;
  displayName: string;
  geneCount: number;
}

@Component({
  selector: 'app-characterisation-status-table',
  templateUrl: './characterisation-status-table.component.html',
  styleUrls: ['./characterisation-status-table.component.css']
})
export class CharacterisationStatusTableComponent implements OnInit {
  characterisationSubsets: Array<DisplaySubset>;
  apiError: APIError;
  total = 0;

  constructor(private pombaseApiService: PombaseAPIService) { }

  ngOnInit() {
    this.pombaseApiService.getGeneSubsets()
      .then(subsets => {
        this.characterisationSubsets = [];
        this.total = 0;

        let subsetNames = Object.keys(subsets);
        // sort by number of genes
        subsetNames.sort((a, b) => {
          return subsets[b].elements.length - subsets[a].elements.length;
        });

        for (let subsetName of subsetNames) {
          let subset = subsets[subsetName];
          let matchResults = subset.display_name.match(/characterisation_status:(.*)/);
          if (matchResults) {
            this.characterisationSubsets.push({
              name: subset.name,
              displayName: matchResults[1],
              geneCount: subset.elements.length,
            });
            this.total += subset.elements.length;
          }
        }
      })
      .catch(error => {
        this.apiError = error;
      });
  }
}
