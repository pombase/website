import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { TermAnnotation, GeneDetails } from '../pombase-api.service';

import { getAnnotationTableConfig, AnnotationTableConfig, AnnotationType,
         SplitByParentsConfig } from '../config';

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
  @Input() geneDetails?: GeneDetails = null;
  @Input() scope: string; // "gene", "term", "reference" ...

  config: AnnotationTableConfig = getAnnotationTableConfig();
  typeConfig: AnnotationType;
  annotationTypeDisplayName = null;
  splitDataList = {};
  splitSummaryList = {};
  split_by_parents: Array<SplitByParentsConfig> = [];
  externalLinksConfig = [];
  helpIconTitle = 'View documention';

  allTermIds = [];

  constructor() { }

  maybeDoSplit() {
    if (this.typeConfig && this.typeConfig.split_by_parents) {
      this.split_by_parents = this.typeConfig.split_by_parents;
      this.splitDataList = {};
      this.splitSummaryList = {};

      for (let splitByConfig of this.split_by_parents) {
        let seenTerms: {[termid: string]: boolean} = {};
        for (let splitByTermId of splitByConfig.termids) {
          let notFlag = false;

          if (splitByTermId.startsWith('NOT ')) {
            notFlag = true;
            splitByTermId = splitByTermId.substr(4);
          }

          for (let termAnnotation of this.annotationTable) {
            let interestingParents = termAnnotation.term.interesting_parents;
            let hasInterestingParent = interestingParents && (interestingParents.indexOf(splitByTermId) !== -1);

            if (notFlag && !hasInterestingParent ||
                !notFlag && hasInterestingParent) {
              if (!this.splitDataList[splitByConfig.config_name]) {
                this.splitDataList[splitByConfig.config_name] = [];
              }
              if (!seenTerms[termAnnotation.term.termid]) {
                this.splitDataList[splitByConfig.config_name].push(termAnnotation);
                seenTerms[termAnnotation.term.termid] = true;
              }
            }
          }
        }
      }
    }
  }

  getAllTermIds(): string[] {
    if (this.annotationTable) {
      return this.annotationTable.map((termAnnotation) => termAnnotation.term.termid);
    } else {
      return [];
    }
  }

  ngOnInit() {
    if (!this.annotationTable) {
      return;
    }

    this.typeConfig = this.config.getAnnotationType(this.annotationTypeName);

    this.externalLinksConfig = this.typeConfig.external_link_config || [];

    if (this.tableDisplayName == null) {
      if (this.typeConfig.display_name) {
        this.tableDisplayName = this.typeConfig.display_name;
      } else {
        this.tableDisplayName = this.annotationTypeName;
      }
    }

    if (this.tableDisplayName) {
      this.helpIconTitle = 'View documentation for the ' + this.tableDisplayName +
        ' section';
    } else {
      this.helpIconTitle = 'View documentation';
    }

    this.maybeDoSplit();
  }

  ngOnChanges() {
    this.allTermIds = this.getAllTermIds();

    this.maybeDoSplit();
  }
}
