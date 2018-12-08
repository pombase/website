import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { TermAnnotation } from '../pombase-api.service';
import { FilterConfig } from '../config';
import { AnnotationFilter } from '../filtering/annotation-filter';
import { AnnotationExtensionFilter } from '../filtering/annotation-extension-filter';

class SelectData {
  constructor(public displayName: string,
              // set to true iff there is annotation in the table that has an extension
              // with one of these ancestors
              public active: boolean,
              public ancestors: Array<string>) { }
}

@Component({
  selector: 'app-annotation-table-extension-filter',
  templateUrl: './annotation-table-extension-filter.component.html',
  styleUrls: ['./annotation-table-extension-filter.component.css']
})
export class AnnotationTableExtensionFilterComponent implements OnInit, OnChanges {
  @Input() annotationTable: Array<TermAnnotation>;
  @Input() config: FilterConfig;
  @Output() filterChange = new EventEmitter<AnnotationFilter>();
  @Output() availableChoiceChange = new EventEmitter<number>();

  selectedCategory: any = null;

  choiceData: Array<SelectData> = [];
  availableChoices: number = 0;

  reset(): void {
    this.selectedCategory = null;
    this.setCategory(null);
  }

  setCategory(event: SelectData): void {
    if (event) {
      this.filterChange.emit(new AnnotationExtensionFilter(event.ancestors));
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

    let seenAncestors: { [key: string]: boolean } = {};

    for (let termAnnotation of this.annotationTable) {
      for (let annotation of termAnnotation.annotations) {
        const extension = annotation.extension;
        if (extension) {
          for (let extPart of extension) {
            if (extPart.ext_range['term']) {
              const interestingParents = extPart.ext_range['term'].interesting_parents;
              if (interestingParents) {
                for (let ancestor of interestingParents) {
                  seenAncestors[ancestor] = true;
                }
              }
            }
          }
        }
      }
    }

    this.availableChoices = 0;

    for (let category of this.config.extension_categories) {
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

      if (active) {
        this.availableChoices += 1;
      }
    }

    this.availableChoiceChange.emit(this.availableChoices);
  }
}
