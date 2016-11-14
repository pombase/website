import { Component, Input, OnInit } from '@angular/core';

import { ParalogAnnotation } from '../pombase-api.service';

import { getGenePageConfig, GenePageConfig } from '../config';

@Component({
  selector: 'app-paralog-annotation-table',
  templateUrl: './paralog-annotation-table.component.html',
  styleUrls: ['./paralog-annotation-table.component.css']
})
export class ParalogAnnotationTableComponent implements OnInit {

  @Input() annotationTable: Array<ParalogAnnotation>;

  config: GenePageConfig = getGenePageConfig();

  annotationTypeDisplayName = null;

  constructor() { }

  ngOnInit() {
    let typeConfig = this.config.annotationTypes['paralogs'];
    this.annotationTypeDisplayName = typeConfig.displayName;
  }
}
