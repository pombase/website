import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { GeneQuery } from '../common/pombase-query';

@Component({
  selector: 'app-query-history',
  templateUrl: './query-history.component.html',
  styleUrls: ['./query-history.component.css']
})
export class QueryHistoryComponent implements OnInit {
  @Input() history: Array<GeneQuery>;
  @Output() selectQuery = new EventEmitter<GeneQuery>();

  constructor() { }

  queryClick(query: GeneQuery) {
    this.selectQuery.emit(query);
  }

  ngOnInit() {
  }
}
