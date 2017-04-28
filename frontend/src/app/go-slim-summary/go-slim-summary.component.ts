import { Component, OnInit, Input, OnChanges } from '@angular/core';

import { getAppConfig, TermAndName } from '../config';
import { GeneDetails } from '../pombase-api.service';

@Component({
  selector: 'app-go-slim-summary',
  templateUrl: './go-slim-summary.component.html',
  styleUrls: ['./go-slim-summary.component.css']
})
export class GoSlimSummaryComponent implements OnInit, OnChanges {
  @Input() geneDetails: GeneDetails;

  goSlimTerms: Array<TermAndName> = getAppConfig().goSlimTerms;

  geneSlims = null;

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

  getGeneSlims(): Array<TermAndName> {
    let allAncestors = this.getAllAncestors();

    return this.goSlimTerms.filter((termAndName) => {
      return allAncestors.has(termAndName.termid);
    });
  }

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges() {
    this.geneSlims = this.getGeneSlims();
  }
}
