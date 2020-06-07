import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import { QueryService, HistoryEntry } from '../query.service';
import { GeneQuery, GeneBoolNode } from '../pombase-query';
import { QueryDetailsDialogComponent } from '../query-details-dialog/query-details-dialog.component';
import { Subscription } from 'rxjs';
import { saveAs } from 'file-saver';
import { ToastrService } from 'ngx-toastr';

import { DeployConfigService } from '../deploy-config.service';
import { faEdit, faDownload, faUpload } from '@fortawesome/free-solid-svg-icons';

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
  // only used when the query name isn't set:
  showDetailMap: { [id: string]: boolean } = {};
  // set when we are editing a query name
  _nameEditId: string = null;

  queryNameForEdit: string = null;

  faEdit = faEdit;
  faDownload = faDownload;
  faUpload = faUpload;
  importingFromFile: boolean;

  constructor(private modalService: BsModalService,
              private queryService: QueryService,
              private toastr: ToastrService,
              public deployConfigService: DeployConfigService) { }

  getSelectedEntries(): Array<HistoryEntry> {
    return this.historyEntries.filter(e => e.checked);
  }

  action(op: string) {
    let selectedQueryNodes =
      this.getSelectedEntries().map(e => e.getQuery().getTopNode());
    let node = new GeneBoolNode(null, op, selectedQueryNodes);
    this.historyEntries.map((histEntry) => histEntry.checked = false);
    this.queryService.runAndSaveToHistory(new GeneQuery(node));
  }

  nameEditId(): string {
    return this._nameEditId;
  }

  addOrEditName(histEntry: HistoryEntry): void {
    this._nameEditId = histEntry.getEntryId();
    this.queryNameForEdit = histEntry.queryName() || '';
  }

  storeNameEdit(): void {
    this.queryService.editQueryName(this.nameEditId(), this.queryNameForEdit);
    this._nameEditId = null;
    this.queryNameForEdit = null;
  }

  cancelNameEdit(): void {
    this._nameEditId = null;
    this.queryNameForEdit = null;
  }

  toggleDetails(histEntry: HistoryEntry): void {
    this.showDetailMap[histEntry.getEntryId()] = !this.showDetailMap[histEntry.getEntryId()];
  }

  showDetails(histEntry: HistoryEntry): boolean {
    return !histEntry.getQuery().getQueryName() || this.showDetailMap[histEntry.getEntryId()];
  }

  needsDetailsButton(histEntry: HistoryEntry): boolean {
    return histEntry.hasEditedName();
  }

  removeTags(input: string): string {
    // remove <i>...</i> from organism names
    return input.replace(/<([^>]+)>([^<]*)<\/\1>/g, '$2');
  }

  getQueryDisplayString(histEntry: HistoryEntry): string {
    return this.removeTags(histEntry.getQuery().toString());
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

  importQueries(): void {
    this.importingFromFile = true;
  }

  importFile($event: Event): void {
    let inputValue = $event.target as any;
    let file = inputValue.files[0];
    let fileReader = new FileReader();

    fileReader.onloadend = (e) => {
      const errorString = this.queryService.saveImportedQueries(fileReader.result as string);
      if (errorString) {
        this.toastr.error(errorString);
      }
      this.importingFromFile = false;
    };

    fileReader.readAsText(file);
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
