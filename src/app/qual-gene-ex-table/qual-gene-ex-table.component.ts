import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';

import { TermAnnotation, AnnotationTable } from '../pombase-api.service';
import { FilterConfig, AnnotationTableConfig, getAnnotationTableConfig, AnnotationType } from '../config';
import { AnnotationFilter } from '../filtering/annotation-filter';
import { TableViewState } from '../pombase-types';

@Component({
  selector: 'app-qual-gene-ex-table',
  templateUrl: './qual-gene-ex-table.component.html',
  styleUrls: ['./qual-gene-ex-table.component.css']
})
export class QualGeneExTableComponent implements OnInit, OnChanges {
  @Input() annotationTable: Array<TermAnnotation>;
  @Input() hideColumns: Array<string>;
  @Input() scope: string;
  @Output() tableViewChangeEmitter = new EventEmitter<TableViewState>();

  showGene = false;
  showReference = false;

  // copy to the component for use in template
  TableViewState = TableViewState;
  currentViewState = TableViewState.Summary;

  config: AnnotationTableConfig = getAnnotationTableConfig();
  typeConfig: AnnotationType;

  tableIsFiltered = false;
  filteredAnnotationCount = 0;
  annotationCount = 0;

  filterConfig: Array<FilterConfig> = null;
  filteredTable: AnnotationTable = [];

  trackByTermId(index: number, item: any) {
    return item.term.termid;
  }

  constructor() { }

  updateCurrentFilter(filter: AnnotationFilter) {
    if (filter) {
      [this.filteredTable, this.annotationCount, this.filteredAnnotationCount] =
        filter.filter(this.annotationTable);
    } else {
      this.filteredTable = this.annotationTable;
    }

    this.tableIsFiltered = !!filter;
  }

  detailsMode(): boolean {
    return this.currentViewState == TableViewState.Details;
  }

  setDetailsView() {
    this.currentViewState = TableViewState.Details;
    this.tableViewChangeEmitter.emit(this.currentViewState);
  }

  setSummaryView() {
    this.currentViewState = TableViewState.Summary;
    this.updateCurrentFilter(null);
    this.tableViewChangeEmitter.emit(this.currentViewState);
  }

  ngOnInit() {
    this.typeConfig = this.config.getAnnotationType('qualitative_gene_expression');
    this.filterConfig = this.typeConfig.filters;
  }

  ngOnChanges() {
    this.showGene = this.hideColumns.indexOf('gene') === -1;
    this.showReference = this.hideColumns.indexOf('reference') === -1;

    this.setSummaryView();
  }
}
