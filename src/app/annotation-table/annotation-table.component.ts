import { Component, Input, OnInit } from '@angular/core';

import { Annotation } from '../pombase-api.service';

import { getGenePageConfig, GenePageConfig } from '../config';

@Component({
  selector: 'app-annotation-table',
  templateUrl: './annotation-table.component.html',
  styleUrls: ['./annotation-table.component.css']
})
export class AnnotationTableComponent implements OnInit {
  @Input() annotationTypeName: string;
  @Input() hideColumns: Array<string>;
  @Input() annotationTable: Array<Annotation>;

  maxRows = 50;
  truncatedTable: Array<Annotation> = [];
  config: GenePageConfig = getGenePageConfig();
  annotationTypeDisplayName = null;
  hideColumn = {};

  constructor() { }

  ngOnInit() {
    let typeConfig = null;
    if (this.annotationTypeName) {
      typeConfig = this.config.annotationTypes[this.annotationTypeName];
    }
    if (typeConfig && typeConfig.displayName) {
      this.annotationTypeDisplayName =
        this.config.annotationTypes[this.annotationTypeName].displayName;
    } else {
      this.annotationTypeDisplayName = this.annotationTypeName;
    }

    for (let columnName of this.hideColumns) {
      console.log(columnName);
      this.hideColumn[columnName] = true;
    }

    // FIXME
    this.truncatedTable = this.annotationTable.slice(0, this.maxRows);
  }
}
