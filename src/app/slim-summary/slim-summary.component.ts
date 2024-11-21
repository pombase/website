import { Component, OnInit, Input, OnChanges } from '@angular/core';

import { TermSubsets, PombaseAPIService, GeneDetails } from '../pombase-api.service';
import { AnnotationType, getAnnotationTableConfig } from '../config';
import { TermShort, TermXref } from '../pombase-query';

class SlimSubsetElement implements TermShort {
  definition: string;
  interesting_parent_ids: Array<string> = [];
  is_obsolete = false;
  xrefs: { [source_name: string]: TermXref } = {};
  constructor(public termid: string,
              public name: string,
              public gene_count: number) { }
}

@Component({
    selector: 'app-slim-summary',
    templateUrl: './slim-summary.component.html',
    styleUrls: ['./slim-summary.component.css'],
    standalone: false
})
export class SlimSummaryComponent implements OnInit, OnChanges {
  @Input() geneDetails: GeneDetails;
  @Input() annotationTypeName: string;

  annotationType?: AnnotationType;

  subsetPromise: Promise<TermSubsets>;
  geneSlimTerms: Array<SlimSubsetElement>;

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

        if (term.interesting_parent_ids) {
          for (let ancestor of term.interesting_parent_ids) {
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
        this.geneSlimTerms = [];
        const slimSubsetName = this.annotationType!.slim_subset_name;
        if (slimSubsetName) {
          const subset = subsets[slimSubsetName];
          for (const termid of Object.keys(subset.elements)) {
            if (allAncestors.has(termid)) {
              const element = subset.elements[termid];
              const slimTerm = new SlimSubsetElement(termid, element.name, element.gene_count);
              this.geneSlimTerms.push(slimTerm);
            }
          }
        }
        this.geneSlimTerms.sort((a,b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
      });
  }
}
