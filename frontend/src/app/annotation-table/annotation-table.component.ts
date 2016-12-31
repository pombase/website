import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { TermAnnotation } from '../pombase-api.service';

import { getAnnotationTableConfig, AnnotationTableConfig } from '../config';

@Component({
  selector: 'app-annotation-table',
  templateUrl: './annotation-table.component.html',
  styleUrls: ['./annotation-table.component.css']
})
export class AnnotationTableComponent implements OnInit {
  @Input() annotationTypeName: string;
  @Input() hideColumns: Array<string>;
  @Input() annotationTable: Array<TermAnnotation>;

  config: AnnotationTableConfig = getAnnotationTableConfig();
  typeConfig: any;
  annotationTypeDisplayName = null;
  splitDataList = {};
  splitByParents = [];

  constructor() { }

  ngOnInit() {
    if (!this.annotationTable) {
      return;
    }

    this.typeConfig = this.config.getAnnotationType(this.annotationTypeName);
    if (this.typeConfig.displayName) {
      this.annotationTypeDisplayName = this.typeConfig.displayName;
    } else {
      this.annotationTypeDisplayName = this.annotationTypeName;
    }

    if (this.typeConfig.splitByParents) {
      this.splitByParents = this.typeConfig.splitByParents;

      for (let splitByConfig of this.splitByParents) {
        let splitByTermId = splitByConfig.termid;
        for (let termAnnotation of this.annotationTable) {
          let interestingParents = termAnnotation.term.interesting_parents;

          if (interestingParents &&
              interestingParents.indexOf(splitByTermId) >= 0) {
            if (!this.splitDataList[splitByTermId]) {
              this.splitDataList[splitByTermId] = [];
            }
            this.splitDataList[splitByTermId].push(termAnnotation);
          }
        }
      }
    }
  }
}
