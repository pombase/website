import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';

import { GeneQuery, GeneBoolNode,
         GeneQueryNode } from '../common/pombase-query';

@Component({
  selector: 'app-query-history',
  templateUrl: './query-history.component.html',
  styleUrls: ['./query-history.component.css']
})
export class QueryHistoryComponent implements OnInit, OnChanges {
  @Input() history: Array<GeneQuery>;
  @Output() gotoQuery = new EventEmitter<GeneQuery>();
  @Output() newQuery = new EventEmitter<GeneQuery>();

  selected = {};

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

  orAction() {
    let orQuery = new GeneBoolNode('or', this.getSelectedQueries());
    this.emitNewQuery(new GeneQuery(orQuery));
  }

  andAction() {
    let andQuery = new GeneBoolNode('and', this.getSelectedQueries());
    this.emitNewQuery(new GeneQuery(andQuery));
  }

  queryClick(query: GeneQuery) {
    this.gotoQuery.emit(query);
  }

  ngOnInit() {
  }

  ngOnChanges() {
    this.selected = {};
  }
}
