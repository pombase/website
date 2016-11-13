import { Component, Input, OnInit } from '@angular/core';

import { Annotation } from '../pombase-api.service';

import { getGenePageConfig, GenePageConfig } from '../config';

@Component({
  selector: 'app-gene-annotation-table',
  templateUrl: './gene-annotation-table.component.html',
  styleUrls: ['./gene-annotation-table.component.css']
})
export class GeneAnnotationTableComponent implements OnInit {
  @Input() annotationTypeName: string;
  @Input() annotationTable: Array<Annotation>;

  config: GenePageConfig = getGenePageConfig();

  annotationTypeDisplayName = null;

  ngOnInit() {
    let typeConfig = this.config.annotationTypes[this.annotationTypeName];
    if (typeConfig && typeConfig.displayName) {
      this.annotationTypeDisplayName =
        this.config.annotationTypes[this.annotationTypeName].displayName;
    } else {
      this.annotationTypeDisplayName = this.annotationTypeName;
    }
  }
}
