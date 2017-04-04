import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { TermAnnotation } from '../pombase-api.service';

import { getAnnotationTableConfig, AnnotationTableConfig, AnnotationType,
         FilterConfig } from '../config';
import { AnnotationTable } from '../pombase-api.service';
import { AnnotationFilter } from '../filtering/annotation-filter';

@Component({
  selector: 'app-annotation-sub-table',
  templateUrl: './annotation-sub-table.component.html',
  styleUrls: ['./annotation-sub-table.component.css']
})
export class AnnotationSubTableComponent implements OnInit, OnChanges {
  @Input() annotationTypeName: string;
  @Input() hideColumns: Array<string>;
  @Input() featureInFirstColumn? = false;
  @Input() annotationTable: Array<TermAnnotation>;

  config: AnnotationTableConfig = getAnnotationTableConfig();
  typeConfig: AnnotationType;
  filterConfig: Array<FilterConfig> = null;
  filteredTable: AnnotationTable = [];

  hideColumn = {};
  showColumn = {};
  termNameColSpan = -1;
  compactFirstRows = {};
  detailsView: {[key: string]: boolean} = {};
  currentView = 'summary';

  updateCurrentFilter(filter: AnnotationFilter) {
    if (filter) {
      this.filteredTable = filter.filter(this.annotationTable);
    } else {
      this.filteredTable = this.annotationTable;
    }
  }

  constructor() { }

  toggleDetails(termid: string) {
    this.detailsView[termid] = !this.detailsView[termid];

    let seenSummarised = false;

    for (let termAnnotation of this.annotationTable) {
      if (termAnnotation.summary) {
        if (!this.detailsView[termAnnotation.term.termid]) {
          seenSummarised = true;
        }
      }
    }

    if (seenSummarised) {
      this.currentView = 'summary';
    } else {
      this.currentView = 'details';
    }
  }

  allDetailsView() {
    this.currentView = 'details';
    for (let termAnnotation of this.annotationTable) {
      this.detailsView[termAnnotation.term.termid] = true;
    }
  }

  allSummaryView() {
    this.currentView = 'summary';
    for (let termAnnotation of this.annotationTable) {
      this.detailsView[termAnnotation.term.termid] = false;
    }
  }

  trackByTermId(index: number, item: any) {
    return item.term.termid;
  }

  hasQualifiers(): boolean {
    for (let termAnnotation of this.annotationTable) {
      for (let annotation of termAnnotation.annotations) {
        if (annotation['qualifiers'] && annotation['qualifiers'].length > 0) {
          return true;
        }
      }
    }

    return false;
  }

  init() {
    let typeConfig = this.config.getAnnotationType(this.annotationTypeName);

    for (let columnName of typeConfig.columns_to_show) {
      this.showColumn[columnName] = true;
    }

    if (this.hideColumns) {
      for (let columnName of this.hideColumns) {
        this.showColumn[columnName] = false;
      }
    }

    if (!this.hasQualifiers()) {
      this.showColumn['qualifiers'] = false;
    }

    for (let columnName of Object.keys(this.showColumn)) {
      if (this.showColumn[columnName]) {
        this.termNameColSpan++;
      }
    }

    if (this.featureInFirstColumn) {
      this.termNameColSpan -= 1;
    }

    if (this.annotationTable && this.annotationTable.length > 0) {
      for (let termAnnotation of this.annotationTable) {
        this.compactFirstRows[termAnnotation.term.termid] =
          !this.showColumn['extension'] ||
          !termAnnotation.annotations[0].extension ||
          termAnnotation.annotations[0].extension.length === 0;
      }
    }

    this.allSummaryView();
  }

  ngOnInit() {
    this.typeConfig = this.config.getAnnotationType(this.annotationTypeName);
    this.filterConfig = this.typeConfig.filters;
  }

  ngOnChanges() {
    // reset when gene changes
    this.updateCurrentFilter(null);
    this.init();
  }
}
