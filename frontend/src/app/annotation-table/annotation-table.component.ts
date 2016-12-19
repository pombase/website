import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { TermAnnotation } from '../pombase-api.service';

import { getAnnotationTableConfig, AnnotationTableConfig } from '../config';

@Component({
  selector: 'app-annotation-table',
  templateUrl: './annotation-table.component.html',
  styleUrls: ['./annotation-table.component.css']
})
export class AnnotationTableComponent implements OnInit {
  @Input() annotationTypeName: string;
  @Input() hideColumns: Array<string>;
  @Input() columnsToShow: Array<string>;
  @Input() annotationTable: Array<TermAnnotation>;

  config: AnnotationTableConfig = getAnnotationTableConfig();
  typeConfig: any;
  showDetails = false;
  showGenotypeDetails = false;
  annotationTypeDisplayName = null;
  hideColumn = {};
  showColumn = {};
  termNameColSpan = 0;
  extensionSummaries = {};

  constructor() { }

  trackByTermId(index: number, item: any) {
    return item.term.termid;
  }

  ngOnInit() {
    this.typeConfig = this.config.getAnnotationType(this.annotationTypeName);
    if (this.typeConfig.displayName) {
      this.annotationTypeDisplayName = this.typeConfig.displayName;
    } else {
      this.annotationTypeDisplayName = this.annotationTypeName;
    }

    for (let columnName of this.typeConfig.columnsToShow) {
      this.showColumn[columnName] = true;
    }

    for (let columnName of this.hideColumns) {
      this.showColumn[columnName] = false;
    }

    for (let columnName of Object.keys(this.showColumn)) {
      if (this.showColumn[columnName]) {
        this.termNameColSpan++;
      }
    }
  }
}
