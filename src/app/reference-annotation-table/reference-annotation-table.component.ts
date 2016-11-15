import { Component, Input, OnInit } from '@angular/core';

import { Annotation } from '../pombase-api.service';

import { getGenePageConfig, GenePageConfig } from '../config';

@Component({
  selector: 'app-reference-annotation-table',
  templateUrl: './reference-annotation-table.component.html',
  styleUrls: ['./reference-annotation-table.component.css']
})
export class ReferenceAnnotationTableComponent implements OnInit {
  @Input() annotationTypeName: string;
  @Input() annotationTable: Array<Annotation>;

  maxRows = 50;

  truncatedTable: Array<Annotation> = [];

  config: GenePageConfig = getGenePageConfig();

  annotationTypeDisplayName = null;

  constructor() { }

  ngOnInit() {
    let typeConfig = this.config.annotationTypes[this.annotationTypeName];
    if (typeConfig && typeConfig.displayName) {
      this.annotationTypeDisplayName =
        this.config.annotationTypes[this.annotationTypeName].displayName;
    } else {
      this.annotationTypeDisplayName = this.annotationTypeName;
    }

    // FIXME
    this.truncatedTable = this.annotationTable.slice(0, this.maxRows);
  }
}
