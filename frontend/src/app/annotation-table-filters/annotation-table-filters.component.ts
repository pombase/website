import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { TermAnnotation } from '../pombase-api.service';
import { FilterConfig } from '../config';
import { AnnotationFilterCombiner } from '../filtering';
import { AnnotationFilter } from '../filtering/annotation-filter';
import { TableViewState } from '../pombase-types';

@Component({
  selector: 'app-annotation-table-filters',
  templateUrl: './annotation-table-filters.component.html',
  styleUrls: ['./annotation-table-filters.component.css']
})
export class AnnotationTableFiltersComponent implements OnInit {
  @Input() annotationTable: Array<TermAnnotation>;
  @Input() filterConfig: Array<FilterConfig>;
  @Input() currentViewState: TableViewState;
  @Output() filterChange = new EventEmitter<AnnotationFilter>();

  tableViewState = TableViewState;

  currentFilters = {};

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
      this.filterChange.emit(null);
    } else {
      this.filterChange.emit(new AnnotationFilterCombiner(eventsToEmit));
    }
  }

  constructor() { }

  ngOnInit() {
  }
}
