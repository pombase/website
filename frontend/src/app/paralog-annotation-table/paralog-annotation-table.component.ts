import { Component, Input, OnInit } from '@angular/core';

import { ParalogAnnotation } from '../pombase-api.service';

import { getAnnotationTableConfig, AnnotationTableConfig } from '../config';

@Component({
  selector: 'app-paralog-annotation-table',
  templateUrl: './paralog-annotation-table.component.html',
  styleUrls: ['./paralog-annotation-table.component.css']
})
export class ParalogAnnotationTableComponent implements OnInit {

  @Input() annotationTable: Array<ParalogAnnotation>;

  config: AnnotationTableConfig = getAnnotationTableConfig();

  annotationTypeDisplayName = null;

  constructor() { }

  ngOnInit() {
    let typeConfig = this.config.annotationTypes['paralogs'];
    this.annotationTypeDisplayName = typeConfig.display_name;
  }
}
