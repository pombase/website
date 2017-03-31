import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { TermAnnotation, TermSummary } from '../pombase-api.service';

import { getAnnotationTableConfig, AnnotationTableConfig, AnnotationType } from '../config';

@Component({
  selector: 'app-annotation-table',
  templateUrl: './annotation-table.component.html',
  styleUrls: ['./annotation-table.component.css']
})
export class AnnotationTableComponent implements OnInit, OnChanges {
  @Input() tableDisplayName?: string = null;
  @Input() annotationTypeName: string;
  @Input() hideColumns: Array<string>;
  @Input() featureInFirstColumn? = false;
  @Input() annotationTable: Array<TermAnnotation>;
  @Input() summaries: Array<TermSummary>;

  config: AnnotationTableConfig = getAnnotationTableConfig();
  typeConfig: AnnotationType;
  annotationTypeDisplayName = null;
  splitDataList = {};
  splitSummaryList = {};
  split_by_parents = [];

  constructor() { }

  maybeDoSplit() {
    if (this.typeConfig && this.typeConfig.split_by_parents) {
      this.split_by_parents = this.typeConfig.split_by_parents;
      this.splitDataList = {};
      this.splitSummaryList = {};

      for (let splitByConfig of this.split_by_parents) {
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
        for (let summary of this.summaries) {
          let interestingParents = summary.term.interesting_parents;

          if (interestingParents &&
              interestingParents.indexOf(splitByTermId) >= 0) {
            if (!this.splitSummaryList[splitByTermId]) {
              this.splitSummaryList[splitByTermId] = [];
            }
            this.splitSummaryList[splitByTermId].push(summary);
          }
        }
      }
    }
  }

  ngOnInit() {
    if (!this.annotationTable) {
      return;
    }

    this.typeConfig = this.config.getAnnotationType(this.annotationTypeName);

    if (this.tableDisplayName == null) {
      if (this.typeConfig.display_name) {
        this.tableDisplayName = this.typeConfig.display_name;
      } else {
        this.tableDisplayName = this.annotationTypeName;
      }
    }

    this.maybeDoSplit();
  }

  ngOnChanges() {
    this.maybeDoSplit();
  }
}
