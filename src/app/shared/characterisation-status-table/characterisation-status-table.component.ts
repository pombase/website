import { Component, OnInit } from '@angular/core';

import { PombaseAPIService, APIError } from '../../pombase-api.service';

interface DisplaySubset {
  name: string;
  displayName: string;
  title: string;
  geneCount: number;
}

interface StatusConfig {
  displayName?: string;
  title: string;
}

const titles: { [key: string]: StatusConfig } = {
  "characterisation_status_biological_role_published": {
    title: "Characterised in a small scale experiment, with some published information at the biological role (GO biological process slim level)"
  },
  "characterisation_status_biological_role_inferred": {
    title: "Biological role (GO biological process slim term) is inferred from homology to an experimentally characterised gene product"
  },
  "characterisation_status_conserved_unknown": {
    title: "Conserved outside the Schizosaccharomyces lineage, but nothing known about the biological role in any organism"
  },
  "characterisation_status_Schizosaccharomyces_specific_protein_uncharacterized": {
    displayName: "Schizo. specific, uncharacterized",
    title: "Unknown found only in fission yeast (Schizosaccahromyces) lineage; nothing known about biological role. May be single copy or a member of a multi-member family."
  },
  "characterisation_status_Schizosaccharomyces_pombe_specific_protein_uncharacterized": {
    displayName: "S. pombe specific, uncharacterized",
    title: "Unknown found only in Schizosaccahromyces pombe; nothing known about biological role. May be single copy or a member of a multi-member family."
  },
  "characterisation_status_dubious": {
    title: "Unlikely to be protein coding"
  },
  "characterisation_status_meiotic_driver": {
    displayName: "meiotic drivers (selfish genes)",
    title: "Selfish elements"
  },
  "characterisation_status_transposon": {
    title: "Transposable element"
  },
};

@Component({
    selector: 'app-characterisation-status-table',
    templateUrl: './characterisation-status-table.component.html',
    styleUrls: ['./characterisation-status-table.component.css'],
    standalone: false
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
              displayName: titles[subset.name].displayName || matchResults[1],
              title: titles[subset.name].title,
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
