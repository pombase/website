import { Component, OnInit, Input } from '@angular/core';
import { TermAnnotation } from '../pombase-api.service';

import { getAnnotationTableConfig, AnnotationTableConfig } from '../config';

@Component({
  selector: 'app-annotation-sub-table',
  templateUrl: './annotation-sub-table.component.html',
  styleUrls: ['./annotation-sub-table.component.css']
})
export class AnnotationSubTableComponent implements OnInit {
  @Input() annotationTypeName: string;
  @Input() hideColumns: Array<string>;
  @Input() annotationTable: Array<TermAnnotation>;

  config: AnnotationTableConfig = getAnnotationTableConfig();

  showDetails = false;

  constructor() { }

  ngOnInit() {
  }
}
