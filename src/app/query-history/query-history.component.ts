import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import { QueryService, HistoryEntry } from '../query.service';
import { GeneQuery, GeneBoolNode, GeneQueryNode } from '../pombase-query';
import { QueryDetailsDialogComponent } from '../query-details-dialog/query-details-dialog.component';
import { Subscription } from 'rxjs';
import { saveAs } from 'file-saver';
import { ToastrService } from 'ngx-toastr';

import { DeployConfigService } from '../deploy-config.service';
import { faEdit, faDownload, faUpload } from '@fortawesome/free-solid-svg-icons';
import { NotDirectionSelectDialogComponent } from '../not-direction-select-dialog/not-direction-select-dialog.component';

@Component({
  selector: 'app-query-history',
  templateUrl: './query-history.component.html',
  styleUrls: ['./query-history.component.css']
})
export class QueryHistoryComponent implements OnInit, OnDestroy {
  @Output() gotoResults = new EventEmitter<GeneQuery>();

  historyEntries: Array<HistoryEntry> = [];
  sortedHistoryEntries: Array<HistoryEntry> = [];
  histSubscription: Subscription|undefined = undefined;
  detailsModalRef: BsModalRef|undefined = undefined;
  notDirectionModalRef: BsModalRef|undefined = undefined;
  // only used when the query name isn't set:
  showDetailMap: { [id: string]: boolean } = {};
  // set when we are editing a query name
  _nameEditId: string|undefined = undefined;

  queryNameForEdit: string|undefined = undefined;

  faEdit = faEdit;
  faDownload = faDownload;
  faUpload = faUpload;
  importingFromFile: boolean;

  hasUpdatedCounts = false;

  sortColumn: 'default'|'queryName' = 'default';

  constructor(private modalService: BsModalService,
              private queryService: QueryService,
              private toastr: ToastrService,
              public deployConfigService: DeployConfigService) { }

  getSelectedEntries(): Array<HistoryEntry> {
    return this.sortedHistoryEntries.filter(e => e.checked);
  }

  changeSortOrder(): void {
    if (this.sortColumn === 'default') {
      this.sortColumn = 'queryName';
      this.sortedHistoryEntries = this.historyEntries.slice()
        .sort((histEntryA, histEntryB) => {
          if (!histEntryA.queryName() && !histEntryB.queryName()) {
            return this.getQueryDisplayString(histEntryA)
              .localeCompare(this.getQueryDisplayString(histEntryB));
          }
          const histEntryAQueryName = histEntryA.queryName();
          if (!histEntryAQueryName) {
            return 1;
          }
          const histEntryBQueryName = histEntryB.queryName();
          if (!histEntryBQueryName) {
            return -1;
          }
          return histEntryAQueryName.localeCompare(histEntryBQueryName);
        });
    } else {
      this.sortColumn = 'default';
      this.sortedHistoryEntries = this.historyEntries;
    }
  }

  private actionHelper(selectedQueryNodes: GeneQueryNode[], op: string) {
    let node = new GeneBoolNode(undefined, op, selectedQueryNodes);
    this.sortedHistoryEntries.map((histEntry) => histEntry.checked = false);
    this.queryService.runAndSaveToHistory(new GeneQuery(node));
  }

  action(op: string) {
    if (op === 'not') {
      // ask the user for a direction:
      const selectedQueries = this.getSelectedEntries().map(e => e.getQuery());
      const initialState = {
        selectedQueries,
      };
      this.notDirectionModalRef =
        this.modalService.show(NotDirectionSelectDialogComponent, {
          initialState: initialState
        });

      this.notDirectionModalRef.content.onClose.subscribe((result: string) => {
        if (result === 'cancel') {
          return;
        }
        let selectedNodes = selectedQueries.map(q => q.getTopNode());
        if (result === 'reverse') {
          selectedNodes.reverse();
        }

        this.actionHelper(selectedNodes, op);
      });
    } else {
      const selectedQueryNodes = this.getSelectedEntries().map(e => e.getQuery().getTopNode());
      this.actionHelper(selectedQueryNodes, op);
    }
  }

  nameEditId(): string|undefined {
    return this._nameEditId;
  }

  addOrEditName(histEntry: HistoryEntry): void {
    this._nameEditId = histEntry.getEntryId();
    this.queryNameForEdit = histEntry.queryName() || '';
  }

  storeNameEdit(): void {
    const nameEditId = this.nameEditId();
    if (nameEditId && this.queryNameForEdit) {
      this.queryService.editQueryName(nameEditId, this.queryNameForEdit);
    }
    this._nameEditId = undefined;
    this.queryNameForEdit = undefined;
  }

  cancelNameEdit(): void {
    this._nameEditId = undefined;
    this.queryNameForEdit = undefined;
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

  outOfDateCountTitle(histEntry: HistoryEntry): string {
    let s = '';
    const updatedCount = histEntry.getUpdatedCount();
    if (updatedCount != 1) {
      s = 's';
    }

    return `This query now has ${updatedCount} result${s}, click to view`;
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

  cancelImport(): void {
    this.importingFromFile = false;
  }

  selectAll() {
    this.sortedHistoryEntries.map(e => e.checked = true);
  }

  selectNone() {
    this.sortedHistoryEntries.map(e => e.checked = false);
  }

  checkUpdatedCounts(): void {
    this.hasUpdatedCounts = false;
    for (const histEntry of this.historyEntries) {
      if (histEntry.getUpdatedCount()) {
        this.hasUpdatedCounts = true;
      }
    }
  }

  ngOnInit() {
    this.histSubscription =
      this.queryService.getHistoryChanges()
        .subscribe((newHistory) => {
          this.sortColumn = 'default';
          this.historyEntries = newHistory;
          this.sortedHistoryEntries = newHistory;
          this.checkUpdatedCounts();
        });
  }

  ngOnDestroy(): void {
    if (this.histSubscription) {
      this.histSubscription.unsubscribe();
    }
  }
}
