import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';

import { BsModalService } from 'ngx-bootstrap/modal';

import { QueryService, HistoryEntry } from '../query.service';
import { GeneQuery, GeneBoolNode } from '../pombase-query';
import { QueryDetailsDialogComponent } from '../query-details-dialog/query-details-dialog.component';
import { PombaseAPIService } from '../pombase-api.service';

@Component({
  selector: 'app-query-history',
  templateUrl: './query-history.component.html',
  styleUrls: ['./query-history.component.css']
})
export class QueryHistoryComponent implements OnInit, OnDestroy {
  @Output() gotoResults = new EventEmitter<GeneQuery>();

  historyEntries: Array<HistoryEntry> = [];
  histSubscription = null;
  detailsModalRef = null;

  constructor(private modalService: BsModalService,
              private queryService: QueryService,
              private pombaseApiService: PombaseAPIService) { }

  getSelectedEntries(): Array<HistoryEntry> {
    return this.historyEntries.filter(e => e.checked);
  }

  action(op: string) {
    let selectedQueryNodes =
      this.getSelectedEntries().map(e => e.getQuery().getTopNode());
    let node = new GeneBoolNode(op, selectedQueryNodes);
    this.historyEntries.map((histEntry) => histEntry.checked = false);
    this.queryService.saveToHistory(new GeneQuery(node));
  }

  getEntryDisplayString(histEntry: HistoryEntry): string {
    const geneSummaryMap = this.pombaseApiService.getGeneSummaryMap();
    return histEntry.getQuery().toDisplayString(geneSummaryMap);
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
