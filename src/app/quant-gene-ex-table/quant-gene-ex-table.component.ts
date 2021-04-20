import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';

import { TermAnnotation, AnnotationTable, GeneDetails } from '../pombase-api.service';
import { TableViewState } from '../pombase-types';
import { AnnotationTableConfig, getAnnotationTableConfig, AnnotationType, FilterConfig } from '../config';
import { Filter } from '../filtering';

@Component({
  selector: 'app-quant-gene-ex-table',
  templateUrl: './quant-gene-ex-table.component.html',
  styleUrls: ['./quant-gene-ex-table.component.css']
})
export class QuantGeneExTableComponent implements OnInit, OnChanges {
  @Input() annotationTable: Array<TermAnnotation>;
  @Input() hideColumns: Array<string>;
  @Input() scope: string;
  @Input() geneDetails: GeneDetails|undefined = undefined;
  @Output() tableViewChangeEmitter = new EventEmitter<TableViewState>();

  showDetails = false;
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

  filterConfig?: Array<FilterConfig>;
  filteredTable: AnnotationTable = [];

  plotVisible = false;

  trackByTermId(index: number, item: any) {
    return item.term.termid;
  }

  constructor() { }

  updateCurrentFilter(filter?: Filter<AnnotationTable>) {
    if (filter) {
      [this.filteredTable, this.annotationCount, this.filteredAnnotationCount] =
        filter.filter(this.annotationTable);
    } else {
      this.filteredTable = this.annotationTable;
    }

    this.tableIsFiltered = !!filter;
  }

  detailsMode(): boolean {
    return this.currentViewState === TableViewState.Details;
  }

  setDetailsView() {
    this.currentViewState = TableViewState.Details;
    this.tableViewChangeEmitter.emit(this.currentViewState);
  }

  setSummaryView() {
    this.currentViewState = TableViewState.Summary;
    this.updateCurrentFilter(undefined);
    this.tableViewChangeEmitter.emit(this.currentViewState);
  }

  showPlot(): void {
    this.plotVisible = true;
  }

  ngOnInit() {
    this.typeConfig = this.config.getAnnotationType('quantitative_gene_expression');
    this.filterConfig = this.typeConfig.filters;
  }

  ngOnChanges() {
    this.showGene = this.hideColumns.indexOf('gene') === -1;
    this.showReference = this.hideColumns.indexOf('reference') === -1;

    this.setSummaryView();
  }
}
