import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';

import { TermAnnotation } from '../pombase-api.service';
import { EvidenceFilterConfig } from '../config';
import { AnnotationFilter } from '../filtering/annotation-filter';
import { AnnotationEvidenceFilter } from '../filtering/annotation-evidence-filter';

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
  @Input() config: EvidenceFilterConfig;
  @Output() filterChange = new EventEmitter<AnnotationFilter>();

  selectedCategory: any = null;

  choiceData: Array<SelectData> = [];

  setCategory(event: SelectData): void {
    if (event) {
      this.filterChange.emit(new AnnotationEvidenceFilter(event.evidenceCodes));
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

    let seenEvidence = {};

    for (let termAnnotation of this.annotationTable) {
      for (let annotation of termAnnotation.annotations) {
        for (let configCategory of this.config.categories) {
          for (let configEvidenceCode of configCategory.evidence_codes) {
            if (annotation.evidence === configEvidenceCode) {
              seenEvidence[configEvidenceCode] = true;
            }
          }
        }
      }
    }

    for (let category of this.config.categories) {
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
  }
}
