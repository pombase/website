import { Component, Input, OnInit } from '@angular/core';

import { OrthologAnnotation } from '../pombase-api.service';

import { getAnnotationTableConfig, AnnotationTableConfig } from '../config';

@Component({
  selector: 'app-ortholog-annotation-table',
  templateUrl: './ortholog-annotation-table.component.html',
  styleUrls: ['./ortholog-annotation-table.component.css']
})
export class OrthologAnnotationTableComponent implements OnInit {

  @Input() annotationTable: Array<OrthologAnnotation>;

  config: AnnotationTableConfig = getAnnotationTableConfig();

  annotationTypeDisplayName = null;

  constructor() { }

  ngOnInit() {
    let typeConfig = this.config.annotationTypes['orthologs'];
    this.annotationTypeDisplayName = typeConfig.displayName;
  }
}
