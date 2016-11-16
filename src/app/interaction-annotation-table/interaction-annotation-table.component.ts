import { Component, Input, OnInit } from '@angular/core';

import { InteractionAnnotation } from '../pombase-api.service';

import { getAnnotationTableConfig, AnnotationTableConfig } from '../config';

@Component({
  selector: 'app-interaction-annotation-table',
  templateUrl: './interaction-annotation-table.component.html',
  styleUrls: ['./interaction-annotation-table.component.css']
})
export class InteractionAnnotationTableComponent implements OnInit {
  @Input() annotationTypeName: string;
  @Input() annotationTable: Array<InteractionAnnotation>;

  config: AnnotationTableConfig = getAnnotationTableConfig();

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
  }
}
