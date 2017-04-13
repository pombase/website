import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';

import { TermAnnotation } from '../pombase-api.service';
import { FilterConfig } from '../config';
import { AnnotationFilter } from '../filtering/annotation-filter';
import { AnnotationTermFilter } from '../filtering/annotation-term-filter';

class SelectData {
  constructor(public displayName: string,
              // set to true iff there is annotation in the table that has one of these
              // ancestors
              public active: boolean,
              public ancestors: Array<string>) { }
}

@Component({
  selector: 'app-annotation-table-term-filter',
  templateUrl: './annotation-table-term-filter.component.html',
  styleUrls: ['./annotation-table-term-filter.component.css']
})
export class AnnotationTableTermFilterComponent implements OnInit, OnChanges {
  @Input() annotationTable: Array<TermAnnotation>;
  @Input() config: FilterConfig;
  @Output() filterChange = new EventEmitter<AnnotationFilter>();

  selectedCategory: any = null;

  choiceData: Array<SelectData> = [];

  reset(): void {
    this.selectedCategory = null;
    this.setCategory(null);
  }

  setCategory(event: SelectData): void {
    if (event) {
      this.filterChange.emit(new AnnotationTermFilter(event.ancestors));
    } else {
      this.filterChange.emit(null);
    }
  }

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges() {
    this.selectedCategory = null;

    this.choiceData = [];

    let seenAncestors = {};

    for (let termAnnotation of this.annotationTable) {
      if (termAnnotation.term.interesting_parents) {
        for (let ancestor of termAnnotation.term.interesting_parents) {
          seenAncestors[ancestor] = true;
        }
      }
    }

    for (let category of this.config.term_categories) {
      let active = false;

      for (let ancestor of category.ancestors) {
        if (seenAncestors[ancestor]) {
          active = true;
          break;
        }
      }

      let selectData = new SelectData(category.display_name,
                                      active, category.ancestors);
      this.choiceData.push(selectData);
    }

    this.choiceData.sort((a, b) => {
      return a.displayName.localeCompare(b.displayName);
    });
  }
}
