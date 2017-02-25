import { Component, OnInit, Input, OnChanges } from '@angular/core';
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
  @Input() showFeaturesInSummary?: boolean;
  @Input() featureInFirstColumn? = false;
  @Input() annotationTable: Array<TermAnnotation>;

  config: AnnotationTableConfig = getAnnotationTableConfig();

  showDetails = false;
  summaryHideColumns: Array<string> = [];

  constructor() { }

  ngOnInit() {
    this.summaryHideColumns = ['evidence', 'reference', 'extension',
                               'qualifiers', 'conditions'].concat(this.hideColumns);
  }

  ngOnChanges() {
    // reset when gene changes
    this.showDetails = false;
  }
}
