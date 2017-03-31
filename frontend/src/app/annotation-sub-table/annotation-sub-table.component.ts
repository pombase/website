import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { TermAnnotation, TermSummary } from '../pombase-api.service';

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
  @Input() summaries: Array<TermSummary>;

  config: AnnotationTableConfig = getAnnotationTableConfig();
  typeConfig: AnnotationType;
  filterConfig: Array<FilterConfig> = null;
  filteredTable: AnnotationTable = [];
  filteredSummaries: Array<TermSummary> = [];

  showDetails = false;

  updateCurrentFilter(filter: AnnotationFilter) {
    if (filter) {
      this.filteredTable = filter.filter(this.annotationTable) as Array<TermAnnotation>;
      this.filteredSummaries = filter.filter(this.summaries) as Array<TermSummary>;
    } else {
      this.filteredTable = this.annotationTable;
      this.filteredSummaries = this.summaries;
    }
  }

  constructor() { }

  ngOnInit() {
    this.typeConfig = this.config.getAnnotationType(this.annotationTypeName);
    this.filterConfig = this.typeConfig.filters;
  }

  ngOnChanges() {
    // reset when gene changes
    this.showDetails = false;
    this.updateCurrentFilter(null);
  }
}
