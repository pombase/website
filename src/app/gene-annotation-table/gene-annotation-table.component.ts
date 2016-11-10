import { Component, Input, OnInit } from '@angular/core';

import { Annotation } from '../pombase-api.service';

@Component({
  selector: 'app-gene-annotation-table',
  templateUrl: './gene-annotation-table.component.html',
  styleUrls: ['./gene-annotation-table.component.css']
})
export class GeneAnnotationTableComponent implements OnInit {
  @Input() annotationTypeName: string;
  @Input() annotationTable: Array<Annotation>;

  ngOnInit() {
  }
}
