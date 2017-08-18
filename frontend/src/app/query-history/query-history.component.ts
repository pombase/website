import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';

import { QueryService, HistoryEntry } from '../query.service';
import { GeneQuery, GeneBoolNode } from '../pombase-query';

@Component({
  selector: 'app-query-history',
  templateUrl: './query-history.component.html',
  styleUrls: ['./query-history.component.css']
})
export class QueryHistoryComponent implements OnInit, OnDestroy {
  @Output() gotoQuery = new EventEmitter<GeneQuery>();
  @Output() newQuery = new EventEmitter<GeneQuery>();

  historyEntries: Array<HistoryEntry> = [];
  histSubscription = null;

  constructor(private queryService: QueryService) { }

  getSelectedEntries(): Array<HistoryEntry> {
    return this.historyEntries.filter(e => e.checked);
  }

  emitNewQuery(newQuery: GeneQuery) {
    this.historyEntries.map((histEntry) => histEntry.checked = false);
    this.newQuery.emit(newQuery);
  }

  action(op: string) {
    let selectedQueryNodes =
      this.getSelectedEntries().map(e => e.getQuery().getTopNode());
    let query = new GeneBoolNode(op, selectedQueryNodes);
    this.emitNewQuery(new GeneQuery(query));
  }

  deleteQueries() {
    let selected = this.getSelectedEntries();
    this.queryService.removeFromHistory(...selected);
  }

  queryClick(histEntry: HistoryEntry) {
    this.gotoQuery.emit(histEntry.getQuery());
  }

  ngOnInit() {
    this.historyEntries = this.queryService.getHistory();
    this.histSubscription =
      this.queryService.getHistoryChanges()
        .subscribe((newHistory) => {
          this.historyEntries = newHistory;
        });
  }

  ngOnDestroy(): void {
    this.histSubscription.unsubscribe();
  }
}
