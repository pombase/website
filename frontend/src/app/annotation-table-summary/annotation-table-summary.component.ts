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

  extensionSummaries = null;

  constructor() { }

  trackByTermId(index: number, item: any) {
    return item.term.termid;
  }

  makeExtensionSummaries() {
//    this.extensionSummaries =
//      this.annotationTable.map(annotation => annotation.extension);
  }

  getExtensionSummaries() {
    if (!this.extensionSummaries) {
      this.makeExtensionSummaries();
    }
  }

  ngOnInit() {
  }
}
