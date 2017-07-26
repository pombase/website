import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { QueryService } from '../query.service';
import { GeneQuery, GeneBoolNode,
         GeneQueryNode } from '../pombase-query';

@Component({
  selector: 'app-query-history',
  templateUrl: './query-history.component.html',
  styleUrls: ['./query-history.component.css']
})
export class QueryHistoryComponent implements OnInit {
  @Output() gotoQuery = new EventEmitter<GeneQuery>();
  @Output() newQuery = new EventEmitter<GeneQuery>();

  selected = {};
  history = [];

  constructor(private queryService: QueryService) { }

  getSelectedQueries(): Array<GeneQueryNode> {
    let ret = [];
    if (this.history) {
      for (let i of Object.keys(this.selected)) {
        if (this.selected[i]) {
          ret.push(this.history[i].getTopNode());
        }
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
    this.queryService.getHistory()
      .subscribe((history) => {
        this.history = history;
      });
  }
}
