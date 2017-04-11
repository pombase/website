import { Component, OnInit, Input, Output, EventEmitter,
         ViewChild } from '@angular/core';

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

  filters = ['evidence'];

  tableViewState = TableViewState;

  filterChanged(filterType: string, event: AnnotationFilter) {
    if (event) {
      this.filterChange.emit(new AnnotationFilterCombiner([event]));
    } else {
      this.filterChange.emit(null);
    }
  }

  constructor() { }

  ngOnInit() {
  }
}
