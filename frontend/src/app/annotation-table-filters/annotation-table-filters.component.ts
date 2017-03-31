import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { TermAnnotation } from '../pombase-api.service';
import { FilterConfig } from '../config';
import { AnnotationFilterCombiner } from '../filtering';
import { AnnotationFilter } from '../filtering/annotation-filter';

@Component({
  selector: 'app-annotation-table-filters',
  templateUrl: './annotation-table-filters.component.html',
  styleUrls: ['./annotation-table-filters.component.css']
})
export class AnnotationTableFiltersComponent implements OnInit {
  @Input() annotationTable: Array<TermAnnotation>;
  @Input() filterConfig: Array<FilterConfig>;
  @Output() filterChange = new EventEmitter<AnnotationFilter>();

  filterChanged(event: AnnotationFilter) {
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
