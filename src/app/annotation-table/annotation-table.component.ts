import { Component, Input, OnInit } from '@angular/core';

import { Annotation } from '../pombase-api.service';

@Component({
  selector: 'app-annotation-table',
  templateUrl: './annotation-table.component.html',
  styleUrls: ['./annotation-table.component.css']
})
export class AnnotationTableComponent implements OnInit {
  @Input() annotationTypeName: string;
  @Input() annotationTable: Array<Annotation>;

  ngOnInit() {
  }
}
