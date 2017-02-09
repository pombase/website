import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { TermAnnotation } from '../pombase-api.service';

import { getAnnotationTableConfig, AnnotationTableConfig } from '../config';

@Component({
  selector: 'app-annotation-sub-table',
  templateUrl: './annotation-sub-table.component.html',
  styleUrls: ['./annotation-sub-table.component.css']
})
export class AnnotationSubTableComponent implements OnInit, OnChanges {
  @Input() annotationTypeName: string;
  @Input() hideColumns: Array<string>;
  @Input() showGeneInSummary?: boolean;
  @Input() geneInFirstColumn?: boolean = false;
  @Input() annotationTable: Array<TermAnnotation>;

  config: AnnotationTableConfig = getAnnotationTableConfig();

  showDetails = false;
  summaryHideColumns: Array<string> = [];

  constructor() { }

  ngOnInit() {
    this.summaryHideColumns = ["evidence", "reference", "extension", "conditions"].concat(this.hideColumns);
  }

  ngOnChanges() {
    // reset when gene changes
    this.showDetails = false;
  }
}
