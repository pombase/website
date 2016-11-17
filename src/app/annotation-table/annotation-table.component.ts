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
  @Input() annotationTable: Array<Annotation>;

  maxRows = 50;
  truncatedTable: Array<Annotation> = [];
  config: AnnotationTableConfig = getAnnotationTableConfig();
  typeConfig: any;
  showGenotypes = false;
  annotationTypeDisplayName = null;
  hideColumn = {};

  constructor() { }

  ngOnInit() {
    this.typeConfig = null;
    if (this.annotationTypeName) {
      this.typeConfig = this.config.annotationTypes[this.annotationTypeName];
    }
    if (this.typeConfig && this.typeConfig.displayName) {
      this.annotationTypeDisplayName =
        this.config.annotationTypes[this.annotationTypeName].displayName;
    } else {
      this.annotationTypeDisplayName = this.annotationTypeName;
    }

    if (this.typeConfig && this.typeConfig.extraColumns &&
        this.typeConfig.extraColumns.includes('genotype')) {
      this.showGenotypes = true;
    }

    for (let columnName of this.hideColumns) {
      this.hideColumn[columnName] = true;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    // FIXME
    this.truncatedTable = this.annotationTable.slice(0, this.maxRows);
  }
}
