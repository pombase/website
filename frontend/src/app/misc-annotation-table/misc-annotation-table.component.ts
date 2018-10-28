import { Component, OnInit, Input } from '@angular/core';

import { getAnnotationTableConfig, AnnotationTableConfig, AnnotationType } from '../config';

import { GeneDetails } from '../pombase-api.service';

@Component({
  selector: 'app-misc-annotation-table',
  templateUrl: './misc-annotation-table.component.html',
  styleUrls: ['./misc-annotation-table.component.css']
})
export class MiscAnnotationTableComponent implements OnInit {
  @Input() geneDetails: GeneDetails;
  @Input() annotationTypeNames: Array<string>;

  config: AnnotationTableConfig = getAnnotationTableConfig();

  typeConfigs: { [key: string]: AnnotationType } = {};

  constructor() { }

  ngOnInit() {
    this.typeConfigs = {};

    this.annotationTypeNames.map(annotationTypeName => {
      this.typeConfigs[annotationTypeName] =
        this.config.getAnnotationType(annotationTypeName);
    });
  }
}
