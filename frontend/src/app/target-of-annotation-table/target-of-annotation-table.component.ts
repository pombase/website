import { Component, Input, OnInit } from '@angular/core';

import { TargetOfAnnotation } from '../pombase-api.service';

@Component({
  selector: 'app-target-of-annotation-table',
  templateUrl: './target-of-annotation-table.component.html',
  styleUrls: ['./target-of-annotation-table.component.css']
})
export class TargetOfAnnotationTableComponent implements OnInit {

  @Input() annotationTable: Array<TargetOfAnnotation>;

  constructor() { }

  ngOnInit() {
  }

}
