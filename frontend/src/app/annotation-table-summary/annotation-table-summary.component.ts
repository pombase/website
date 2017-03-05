import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { TermSummary } from '../pombase-api.service';

import { getAnnotationTableConfig, AnnotationTableConfig } from '../config';

@Component({
  selector: 'app-annotation-table-summary',
  templateUrl: './annotation-table-summary.component.html',
  styleUrls: ['./annotation-table-summary.component.css']
})
export class AnnotationTableSummaryComponent implements OnInit, OnChanges {
  @Input() annotationTypeName: string;
  @Input() summaries: Array<TermSummary>;

  config: AnnotationTableConfig = getAnnotationTableConfig();
  annotationTypeDisplayName = null;
  extensionsToHide = [];

  constructor() { }

  trackByTermId(index: number, item: any) {
    return item.term.termid;
  }

  ngOnChanges() {
  }

  ngOnInit() {
    this.ngOnChanges();
  }
}
