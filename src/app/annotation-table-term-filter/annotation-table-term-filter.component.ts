import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';

import { TermAnnotation, AnnotationTable, PombaseAPIService, TermSubsets } from '../pombase-api.service';
import { FilterConfig, TermFilterCategory } from '../config';
import { AnnotationTermFilter } from '../filtering/annotation-term-filter';
import { Filter } from '../filtering';

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
  @Output() filterChange = new EventEmitter<Filter<AnnotationTable>>();

  subsetPromise: Promise<TermSubsets>;

  selectedCategory: any = null;

  choiceData: Array<SelectData> = [];

  reset(): void {
    this.selectedCategory = null;
    this.setCategory(undefined);
  }

  setCategory(event?: SelectData): void {
    if (event) {
      this.filterChange.emit(new AnnotationTermFilter(event.ancestors));
    } else {
      this.filterChange.emit(undefined);
    }
  }

  constructor(pombaseApiService: PombaseAPIService) {
    this.subsetPromise = pombaseApiService.getTermSubsets();
  }

  ngOnInit() {
  }

  processChanges(termCategories: Array<TermFilterCategory>): void {
    this.choiceData = [];

    let seenAncestors: { [key: string]: boolean } = {};

    for (let termAnnotation of this.annotationTable) {
      if (termAnnotation.term.interesting_parent_ids) {
        for (let ancestor of termAnnotation.term.interesting_parent_ids) {
          seenAncestors[ancestor] = true;
        }
      }
    }

    for (let category of termCategories) {
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

  getAllAncestors(): Set<string> {
    let ret = new Set<string>();
    for (let term_annotations of this.annotationTable) {
      let term = term_annotations.term;

      if (term_annotations.is_not) {
        continue;
      }

      ret.add(term.termid);

      if (term.interesting_parent_ids) {
        for (let ancestor of term.interesting_parent_ids) {
          ret.add(ancestor);
        }
      }
    }

    return ret;
  }

  processChangesForSlim(): void {
    this.subsetPromise.then((subsets) => {
      let termCategories = [];
      let allAncestors = this.getAllAncestors();
      const subset = subsets[this.config.slim_name!];
      for (const termid of Object.keys(subset.elements)) {
        if (allAncestors.has(termid)) {
          const element = subset.elements[termid];
          const termCategory = {
            display_name: element.name,
            ancestors: [termid],
          };
          termCategories.push(termCategory);
        }
      }
      this.processChanges(termCategories);
    });
  }

  ngOnChanges() {
    this.selectedCategory = null;

    this.choiceData = [];

    if (this.config.term_categories) {
      this.processChanges(this.config.term_categories);
    } else {
      if (this.config.slim_name) {
        this.processChangesForSlim();
      }
    }
  }
}
