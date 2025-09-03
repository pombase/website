import { Component, OnInit } from '@angular/core';

import { PombaseAPIService, APIError } from '../../pombase-api.service';

interface DisplaySubset {
  name: string;
  displayName: string;
  title: string;
  geneCount: number;
  elClass?: string;
}

interface StatusConfig {
  displayName?: string;
  title: string;
  elClass?: string;
}

const conf: { [key: string]: StatusConfig } = {
  "characterisation_status_biological_role_published": {
    title: "Characterised in a small scale experiment, with some published information at the biological role (GO biological process slim level)",
    elClass: "biological-role-published"
  },
  "characterisation_status_biological_role_inferred": {
    title: "Biological role (GO biological process slim term) is inferred from homology to an experimentally characterised gene product",
    elClass: "biological-role-inferred"
  },
  "characterisation_status_conserved_unknown": {
    title: "Conserved outside the Schizosaccharomyces lineage, but nothing known about the biological role in any organism",
    elClass: "conserved-unknown"
  },
  "characterisation_status_Schizosaccharomyces_specific_protein_uncharacterized": {
    displayName: "Schizo. specific, uncharacterized",
    title: "Unknown found only in fission yeast (Schizosaccahromyces) lineage; nothing known about biological role. May be single copy or a member of a multi-member family.",
    elClass: "fission-yeast-unknown"
  },
  "characterisation_status_Schizosaccharomyces_pombe_specific_protein_uncharacterized": {
    displayName: "S. pombe specific, uncharacterized",
    title: "Unknown found only in Schizosaccahromyces pombe; nothing known about biological role. May be single copy or a member of a multi-member family.",
    elClass: "fission-yeast-unknown"
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

        const allSubsetNames = Object.keys(subsets);

        let subsetNames =
          allSubsetNames.filter(name => name.startsWith('characterisation_status_'));

        // sort by number of genes
        subsetNames.sort((a, b) => {
          return subsets[b].elements.length - subsets[a].elements.length;
        });

        const dubiousIndex = subsetNames.indexOf('characterisation_status_dubious');

        if (dubiousIndex != -1) {
          subsetNames.splice(dubiousIndex, 0, 'sub total');
        }

        let totalInGraph = 0;

        for (const subsetName of subsetNames) {
          let subset = subsets[subsetName];
          if (subsetName == 'sub total') {
            this.characterisationSubsets.push({
              name: subsetName,
              displayName: subsetName,
              title: 'Sub total: count of the genes in the graph',
              geneCount: totalInGraph,
              elClass: undefined,
            });
            totalInGraph = -1;
            continue;
          }
          let matchResults = subset.display_name.match(/characterisation_status:(.*)/)!;

            const geneCount = subset.elements.length;
            if (totalInGraph != -1) {
              totalInGraph += geneCount;
            }
            this.characterisationSubsets.push({
              name: subset.name,
              displayName: conf[subset.name].displayName || matchResults[1],
              title: conf[subset.name].title,
              geneCount,
              elClass: conf[subset.name].elClass,
            });
            this.total += subset.elements.length;

        }
      })
      .catch(error => {
        this.apiError = error;
      });
  }
}
