import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import { QueryService, HistoryEntry } from '../query.service';
import { GeneQuery, GeneBoolNode } from '../pombase-query';
import { QueryDetailsDialogComponent } from '../query-details-dialog/query-details-dialog.component';
import { Subscription } from 'rxjs';
import { saveAs } from 'file-saver';

import { DeployConfigService } from '../deploy-config.service';
import { faDownload } from '@fortawesome/free-solid-svg-icons';

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

  faDownload = faDownload;

  constructor(private modalService: BsModalService,
              private queryService: QueryService,
              public deployConfigService: DeployConfigService) { }

  getSelectedEntries(): Array<HistoryEntry> {
    return this.historyEntries.filter(e => e.checked);
  }

  action(op: string) {
    let selectedQueryNodes =
      this.getSelectedEntries().map(e => e.getQuery().getTopNode());
    let node = new GeneBoolNode(op, selectedQueryNodes);
    this.historyEntries.map((histEntry) => histEntry.checked = false);
    this.queryService.runAndSaveToHistory(new GeneQuery(null, node));
  }

  getQueryDisplayString(histEntry: HistoryEntry): string {
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

  exportAll(): void {
    let fileName = 'all_queries.json';
    let blob = new Blob([this.queryService.historyAsJson(2)], { type: 'application/json' });
    saveAs(blob, fileName);
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
