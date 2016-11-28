import { Component, Input, OnInit } from '@angular/core';

import { TermShort, GeneQuery, GeneQueryPart } from '../common/pombase-query';

@Component({
  selector: 'app-query-builder',
  templateUrl: './query-builder.component.html',
  styleUrls: ['./query-builder.component.css']
})
export class QueryBuilderComponent implements OnInit {
//  @Input() query: GeneQuery;

  query: GeneQuery = new GeneQuery();
  parts: GeneQueryPart[] = [];

  constructor() { }

  ngOnInit() {
    this.parts = this.query.getQueryParts();
  }

  partChanged(part: GeneQueryPart) {
    this.parts.push(part);
  }
}
