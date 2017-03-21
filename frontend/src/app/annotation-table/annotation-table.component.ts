import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { TermAnnotation, TermSummary } from '../pombase-api.service';

import { getAnnotationTableConfig, AnnotationTableConfig } from '../config';

@Component({
  selector: 'app-annotation-table',
  templateUrl: './annotation-table.component.html',
  styleUrls: ['./annotation-table.component.css']
})
export class AnnotationTableComponent implements OnInit, OnChanges {
  @Input() tableDisplayName?: string = null;
  @Input() annotationTypeName: string;
  @Input() hideColumns: Array<string>;
  @Input() featureInFirstColumn?: boolean = false;
  @Input() annotationTable: Array<TermAnnotation>;
  @Input() summaries: Array<TermSummary>;

  config: AnnotationTableConfig = getAnnotationTableConfig();
  typeConfig: any;
  annotationTypeDisplayName = null;
  splitDataList = {};
  splitSummaryList = {};
  splitByParents = [];

  constructor() { }

  maybeDoSplit() {
    if (this.typeConfig && this.typeConfig.splitByParents) {
      this.splitByParents = this.typeConfig.splitByParents;
      this.splitDataList = {};
      this.splitSummaryList = {};

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
      if (this.typeConfig.displayName) {
        this.tableDisplayName = this.typeConfig.displayName;
      } else {
        this.tableDisplayName = this.annotationTypeName;
      }
    }
  }

  ngOnChanges() {
    this.maybeDoSplit();
  }
}
