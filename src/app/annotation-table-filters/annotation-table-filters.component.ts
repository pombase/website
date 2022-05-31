import { Component, OnInit, Input, Output, OnChanges,
         EventEmitter } from '@angular/core';

import { TermAnnotation, AnnotationTable } from '../pombase-api.service';
import { FilterConfig } from '../config';
import { AnnotationFilter, FilterCombiner } from '../filtering';
import { TableViewState } from '../pombase-types';

@Component({
  selector: 'app-annotation-table-filters',
  templateUrl: './annotation-table-filters.component.html',
  styleUrls: ['./annotation-table-filters.component.css']
})
export class AnnotationTableFiltersComponent implements OnInit, OnChanges {
  @Input() annotationTable: Array<TermAnnotation>;
  @Input() filterConfig: Array<FilterConfig>;
  @Input() currentViewState: TableViewState;
  @Input() scope: string; // "gene", "term", "reference" ...
  @Output() filterChange = new EventEmitter<AnnotationFilter>();

  currentFilters: { [key: string]: AnnotationFilter } = {};
  scopeFilterConfig: Array<FilterConfig> = [];

  filterChanged(filterType: string, event: AnnotationFilter) {
    if (event) {
      this.currentFilters[filterType] = event;
    } else {
      delete this.currentFilters[filterType];
    }

    let eventsToEmit = [];

    for (let filterName of Object.keys(this.currentFilters)) {
      eventsToEmit.push(this.currentFilters[filterName]);
    }

    if (eventsToEmit.length === 0) {
      this.filterChange.emit(undefined);
    } else {
      this.filterChange.emit(new FilterCombiner<AnnotationTable>(eventsToEmit));
    }
  }

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges() {
    this.scopeFilterConfig =
      this.filterConfig.filter(conf => {
        return conf.scope.indexOf(this.scope) !== -1 &&
          (this.currentViewState === TableViewState.Details ||
           !conf.detailed_view_only);
      });
  }
}
