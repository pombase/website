import { Component, OnInit, DoCheck, Input, Output, EventEmitter } from '@angular/core';

import { GeneQuery, GeneBoolNode,
         GeneQueryNode } from '../pombase-query';

@Component({
  selector: 'app-query-history',
  templateUrl: './query-history.component.html',
  styleUrls: ['./query-history.component.css']
})
export class QueryHistoryComponent implements OnInit, DoCheck {
  @Input() history: Array<GeneQuery>;
  @Output() gotoQuery = new EventEmitter<GeneQuery>();
  @Output() newQuery = new EventEmitter<GeneQuery>();

  selected = {};
  // used for change detection
  prevHistoryLength = -1;

  constructor() { }

  getSelectedQueries(): Array<GeneQueryNode> {
    let ret = [];
    for (let i of Object.keys(this.selected)) {
      if (this.selected[i]) {
        ret.push(this.history[i].getTopNode());
      }
    }

    return ret;
  }

  emitNewQuery(newQuery: GeneQuery) {
    this.selected = {};
    this.newQuery.emit(newQuery);
  }

  action(op: string) {
    let query = new GeneBoolNode(op, this.getSelectedQueries());
    this.emitNewQuery(new GeneQuery(query));
  }

  queryClick(query: GeneQuery) {
    this.gotoQuery.emit(query);
  }

  ngOnInit() {
  }

  ngDoCheck() {
    if (this.prevHistoryLength !== this.history.length) {
      this.selected = {};
      this.prevHistoryLength = this.history.length;
    }
  }
}
