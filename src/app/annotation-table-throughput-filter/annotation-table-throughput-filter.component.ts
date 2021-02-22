import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { ThroughputType, TermAnnotation, AnnotationTable } from '../pombase-api.service';
import { FilterConfig } from '../config';
import { AnnotationThroughputFilter } from '../filtering/annotation-throughput-filter';
import { Filter } from '../filtering';

class SelectData {
  constructor(public displayName: string,
              // set to true iff there is annotation in the table that has this
              // throughput
              public active: boolean,
              public throughput: ThroughputType) { }
}

@Component({
  selector: 'app-annotation-table-throughput-filter',
  templateUrl: './annotation-table-throughput-filter.component.html',
  styleUrls: ['./annotation-table-throughput-filter.component.css']
})
export class AnnotationTableThroughputFilterComponent implements OnInit, OnChanges {
  @Input() annotationTable: Array<TermAnnotation>;
  @Input() config: FilterConfig;
  @Output() filterChange = new EventEmitter<Filter<AnnotationTable>>();

  selectedCategory: SelectData|null = null;

  choiceData: Array<SelectData> = [];
  reset(): void {
    this.selectedCategory = null;
    this.setCategory(null);
  }

  setCategory(event: SelectData|null): void {
    if (event) {
      this.filterChange.emit(new AnnotationThroughputFilter(event.throughput));
    } else {
      this.filterChange.emit(undefined);
    }
  }

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges() {
    this.selectedCategory = null;

    this.choiceData = [];

    let seenThroughput: { [key: string]: boolean } = {};

    if (this.config.throughput_categories) {
      for (let termAnnotation of this.annotationTable) {
        for (let annotation of termAnnotation.annotations) {
          let annotationThroughput = annotation.throughput;
          if (annotationThroughput) {
            for (let configCategory of this.config.throughput_categories) {
              if (annotationThroughput === configCategory.throughput_type) {
                seenThroughput[configCategory.throughput_type] = true;
              }
            }
          }
        }
      }

      for (let category of this.config.throughput_categories) {
        let active = seenThroughput[category.throughput_type];

        let selectData = new SelectData(category.display_name,
          active, category.throughput_type);
        this.choiceData.push(selectData);
      }
    }

    this.choiceData.sort((a, b) => {
      return a.displayName.localeCompare(b.displayName);
    });
  }
}
