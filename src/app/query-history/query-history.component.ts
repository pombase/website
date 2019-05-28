import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import { QueryService, HistoryEntry } from '../query.service';
import { GeneQuery, GeneBoolNode } from '../pombase-query';
import { QueryDetailsDialogComponent } from '../query-details-dialog/query-details-dialog.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-query-history',
  templateUrl: './query-history.component.html',
  styleUrls: ['./query-history.component.css']
})
export class QueryHistoryComponent implements OnInit, OnDestroy {
  @Output() gotoResults = new EventEmitter<GeneQuery>();

  historyEntries: Array<HistoryEntry> = [];
  histSubscription: Subscription = null;
  detailsModalRef: BsModalRef = null;

  constructor(private modalService: BsModalService,
              private queryService: QueryService) { }

  getSelectedEntries(): Array<HistoryEntry> {
    return this.historyEntries.filter(e => e.checked);
  }

  action(op: string) {
    let selectedQueryNodes =
      this.getSelectedEntries().map(e => e.getQuery().getTopNode());
    let node = new GeneBoolNode(op, selectedQueryNodes);
    this.historyEntries.map((histEntry) => histEntry.checked = false);
    this.queryService.saveToHistory(new GeneQuery(null, node));
  }

  getEntryDisplayString(histEntry: HistoryEntry): string {
    return histEntry.getQuery().toString();
  }

  deleteQueries() {
    let selected = this.getSelectedEntries();
    this.queryService.removeFromHistory(...selected);
  }

  queryClick(histEntry: HistoryEntry) {
    this.gotoResults.emit(histEntry.getQuery());
  }

  showQueryDetails(histEntry: HistoryEntry) {
    this.detailsModalRef = this.modalService.show(QueryDetailsDialogComponent);
    this.detailsModalRef.content.query = histEntry.getQuery();
  }

  setAllCounts() {
    this.queryService.setAllCounts();
  }

  selectAll() {
    this.historyEntries.map(e => e.checked = true);
  }

  selectNone() {
    this.historyEntries.map(e => e.checked = false);
  }

  ngOnInit() {
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
