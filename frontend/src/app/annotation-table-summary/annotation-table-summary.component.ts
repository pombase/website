import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { TermAnnotation } from '../pombase-api.service';

import { getAnnotationTableConfig, AnnotationTableConfig } from '../config';

@Component({
  selector: 'app-annotation-table-summary',
  templateUrl: './annotation-table-summary.component.html',
  styleUrls: ['./annotation-table-summary.component.css']
})
export class AnnotationTableSummaryComponent implements OnInit {
  @Input() annotationTable: Array<TermAnnotation>;

  annotationTypeDisplayName = null;

  extensionSummariesByTerm = {};

  constructor() { }

  trackByTermId(index: number, item: any) {
    return item.term.termid;
  }

  makeExtensionSummaries() {
    for (let term_annotation of this.annotationTable) {
      let termid = term_annotation.term.termid;
      let thisTermExtensions =
        term_annotation.annotations.map(annotation => annotation.extension)
        .filter(extension => extension && extension.length > 0);
      if (thisTermExtensions.length > 0) {
        this.extensionSummariesByTerm[termid] = thisTermExtensions;
      }
    }
  }

  ngOnInit() {
    this.makeExtensionSummaries();
  }
}
