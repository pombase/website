import { Component, OnInit, Input, OnChanges } from '@angular/core';

import { getAppConfig } from '../config';
import { GeneDetails, TermSubsets, PombaseAPIService } from '../pombase-api.service';

@Component({
  selector: 'app-go-slim-summary',
  templateUrl: './go-slim-summary.component.html',
  styleUrls: ['./go-slim-summary.component.css']
})
export class GoSlimSummaryComponent implements OnInit, OnChanges {
  @Input() geneDetails: GeneDetails;

  subsetPromise: Promise<TermSubsets> = null;
  geneSlimTerms = null;

  getAllAncestors(): Set<string> {
    let ret = new Set();

    let biological_process = this.geneDetails.cv_annotations['biological_process'];

    if (biological_process) {
      for (let term_annotations of biological_process) {
        let term = term_annotations.term;

        ret.add(term.termid);

        if (term.interesting_parents) {
          for (let ancestor of term.interesting_parents) {
            ret.add(ancestor);
          }
        }
      }
    }

    return ret;
  }

  constructor(private pombaseApiService: PombaseAPIService) {
    this.subsetPromise = this.pombaseApiService.getTermSubsets();
  }

  ngOnInit() {
  }

  ngOnChanges() {
    this.subsetPromise
      .then((subsets) => {
        if (this.geneDetails) {
          let allAncestors = this.getAllAncestors();
          this.geneSlimTerms =
            subsets['bp_goslim_pombe'].elements.filter((termAndName) => {
              return allAncestors.has(termAndName.termid);
            });
        }
      });
  }
}
