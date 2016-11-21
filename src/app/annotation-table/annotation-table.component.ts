import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Annotation } from '../pombase-api.service';

import { getAnnotationTableConfig, AnnotationTableConfig } from '../config';

@Component({
  selector: 'app-annotation-table',
  templateUrl: './annotation-table.component.html',
  styleUrls: ['./annotation-table.component.css']
})
export class AnnotationTableComponent implements OnInit, OnChanges {
  @Input() annotationTypeName: string;
  @Input() hideColumns: Array<string>;
  @Input() columnsToShow: Array<string>;
  @Input() annotationTable: Array<Annotation>;

  maxRows = 2000;
  truncatedTable: Array<Annotation> = [];
  config: AnnotationTableConfig = getAnnotationTableConfig();
  typeConfig: any;
  showGenotypes = false;
  annotationTypeDisplayName = null;
  hideColumn = {};
  showColumn = {};

  constructor() { }

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
  }

  ngOnChanges(changes: SimpleChanges) {
    // FIXME
    this.truncatedTable = this.annotationTable.slice(0, this.maxRows);
  }
}
