import { Component, Input, OnInit } from '@angular/core';

import { Annotation } from '../pombase-api.service';

@Component({
  selector: 'app-term-annotation-table',
  templateUrl: './term-annotation-table.component.html',
  styleUrls: ['./term-annotation-table.component.css']
})
export class TermAnnotationTableComponent implements OnInit {
  @Input() annotationTable: Array<Annotation>;

  ngOnInit() {
  }
}
