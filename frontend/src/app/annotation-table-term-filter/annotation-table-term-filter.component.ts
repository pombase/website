import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';

import { TermAnnotation } from '../pombase-api.service';
import { TermFilterConfig, TermFilterCategory } from '../config';
import { AnnotationFilter } from '../filtering/annotation-filter';
import { AnnotationTermFilter } from '../filtering/annotation-term-filter';

@Component({
  selector: 'app-annotation-table-term-filter',
  templateUrl: './annotation-table-term-filter.component.html',
  styleUrls: ['./annotation-table-term-filter.component.css']
})
export class AnnotationTableTermFilterComponent implements OnInit, OnChanges {
  @Input() annotationTable: Array<TermAnnotation>;
  @Input() config: TermFilterConfig;
  @Output() filterChange = new EventEmitter<AnnotationFilter>();

  selectedCategory: any = null;

  setCategory(event: TermFilterCategory): void {
    let termids = null;

    if (event) {
      termids = event.ancestors.map(ancestor => ancestor.termid);
      this.filterChange.emit(new AnnotationTermFilter(termids));
    } else {
      this.filterChange.emit(null);
    }
  }

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges() {
    this.selectedCategory = null;
  }
}
