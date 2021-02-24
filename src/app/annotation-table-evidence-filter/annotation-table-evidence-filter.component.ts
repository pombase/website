import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';

import { TermAnnotation, AnnotationTable } from '../pombase-api.service';
import { FilterConfig } from '../config';
import { AnnotationEvidenceFilter } from '../filtering/annotation-evidence-filter';
import { Filter } from '../filtering';

class SelectData {
  constructor(public displayName: string,
              // set to true iff there is annotation in the table that has one of these
              // evidence codes
              public active: boolean,
              public evidenceCodes: Array<string>) { }
}

@Component({
  selector: 'app-annotation-table-evidence-filter',
  templateUrl: './annotation-table-evidence-filter.component.html',
  styleUrls: ['./annotation-table-evidence-filter.component.css']
})
export class AnnotationTableEvidenceFilterComponent implements OnInit, OnChanges {
  @Input() annotationTable: Array<TermAnnotation>;
  @Input() config: FilterConfig;
  @Output() filterChange = new EventEmitter<Filter<AnnotationTable>>();

  selectedCategory: any = null;

  choiceData: Array<SelectData> = [];

  reset(): void {
    this.selectedCategory = null;
    this.setCategory(undefined);
  }

  setCategory(event?: SelectData): void {
    if (event) {
      this.filterChange.emit(new AnnotationEvidenceFilter(event.evidenceCodes));
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

    if (!this.config.evidence_categories) {
      return;
    }

    let seenEvidence: { [key: string]: boolean } = {};

    for (let termAnnotation of this.annotationTable) {
      for (let annotation of termAnnotation.annotations) {
        let evidence = annotation.evidence;
        if (evidence) {
          let lcEvidence = evidence.toLowerCase();
          for (let configCategory of this.config.evidence_categories) {
            for (let configEvidenceCode of configCategory.evidence_codes) {
              let lcConfigEvidenceCode = configEvidenceCode.toLowerCase();
              if (lcEvidence === lcConfigEvidenceCode ||
                  lcEvidence === lcConfigEvidenceCode + ' evidence') {
                seenEvidence[configEvidenceCode] = true;
              }
            }
          }
        }
      }
    }

    for (let category of this.config.evidence_categories) {
      let active = false;

      for (let evidence_code of category.evidence_codes) {
        if (seenEvidence[evidence_code]) {
          active = true;
          break;
        }
      }

      let selectData = new SelectData(category.display_name,
                                      active, category.evidence_codes);
      this.choiceData.push(selectData);
    }

    this.choiceData.sort((a, b) => {
      return a.displayName.localeCompare(b.displayName);
    });
  }
}
