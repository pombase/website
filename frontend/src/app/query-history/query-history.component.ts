import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';

import { QueryService } from '../query.service';
import { GeneQuery, GeneBoolNode } from '../pombase-query';

class HistoryItem {
  query: GeneQuery;
  checked: boolean;
}

@Component({
  selector: 'app-query-history',
  templateUrl: './query-history.component.html',
  styleUrls: ['./query-history.component.css']
})
export class QueryHistoryComponent implements OnInit, OnDestroy {
  @Output() gotoQuery = new EventEmitter<GeneQuery>();
  @Output() newQuery = new EventEmitter<GeneQuery>();

  historyItems: Array<HistoryItem> = [];
  histSubscription = null;

  constructor(private queryService: QueryService) { }

  getSelectedQueries(): Array<GeneQuery> {
    let ret = [];
    for (let histItem of this.historyItems) {
      if (histItem.checked) {
        ret.push(histItem.query);
      }
    }
    return ret;
  }

  emitNewQuery(newQuery: GeneQuery) {
    this.historyItems.map((histItem) => histItem.checked = false);
    this.newQuery.emit(newQuery);
  }

  action(op: string) {
    let selectedQueryNodes =
      this.getSelectedQueries().map((query) => query.getTopNode());
    let query = new GeneBoolNode(op, selectedQueryNodes);
    this.emitNewQuery(new GeneQuery(query));
  }

  deleteQueries() {
    let selected = this.getSelectedQueries();
    this.queryService.removeFromHistory(...selected);
  }

  queryClick(histItem: HistoryItem) {
    this.gotoQuery.emit(histItem.query);
  }

  private toHistoryItems(history: Array<GeneQuery>): Array<HistoryItem> {
    return history.map((histQuery) => {
      return {
        query: histQuery,
        checked: false,
      };
    });
  }

  ngOnInit() {
    this.historyItems = this.toHistoryItems(this.queryService.getHistory());
    this.histSubscription =
      this.queryService.getHistoryChanges()
        .subscribe((history) => {
          this.historyItems = this.toHistoryItems(history);
        });
  }

  ngOnDestroy(): void {
    this.histSubscription.unsubscribe();
  }
}
