import { Component, OnInit, Input, OnChanges } from '@angular/core';

import { TermSubsets, PombaseAPIService, TermSubsetElement, GeneDetails } from '../pombase-api.service';
import { AnnotationType, getAnnotationTableConfig } from '../config';

@Component({
  selector: 'app-slim-summary',
  templateUrl: './slim-summary.component.html',
  styleUrls: ['./slim-summary.component.css']
})
export class SlimSummaryComponent implements OnInit, OnChanges {
  @Input() geneDetails: GeneDetails;
  @Input() annotationTypeName: string;

  annotationType: AnnotationType = null;

  subsetPromise: Promise<TermSubsets> = null;
  geneSlimTerms: Array<TermSubsetElement> = [];

  getAllAncestors(): Set<string> {
    let ret = new Set<string>();

    let annotations = this.geneDetails.cv_annotations[this.annotationTypeName];

    if (annotations) {
      for (let term_annotations of annotations) {
        let term = term_annotations.term;

        if (term_annotations.is_not) {
          continue;
        }

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
    this.annotationType = getAnnotationTableConfig().getAnnotationType(this.annotationTypeName);
    this.subsetPromise
      .then((subsets) => {
        let allAncestors = this.getAllAncestors();
        this.geneSlimTerms =
          subsets[this.annotationType.slim_subset_name].elements.filter((termAndName) => {
            return allAncestors.has(termAndName.termid);
          });
      });
  }
}
