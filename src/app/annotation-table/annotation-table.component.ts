import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { TermAnnotation, GeneDetails } from '../pombase-api.service';

import { getAnnotationTableConfig, AnnotationTableConfig, AnnotationType,
         SplitByParentsConfig } from '../config';
import { DeployConfigService } from '../deploy-config.service';

@Component({
  selector: 'app-annotation-table',
  templateUrl: './annotation-table.component.html',
  styleUrls: ['./annotation-table.component.css']
})
export class AnnotationTableComponent implements OnInit, OnChanges {
  @Input() tableDisplayName?: string;
  @Input() annotationTypeName: string;
  @Input() hideColumns: Array<string>;
  @Input() featureInFirstColumn = false;
  @Input() annotationTable: Array<TermAnnotation>;
  @Input() geneDetails?: GeneDetails;
  @Input() scope: string; // "gene", "term", "reference" ...

  config: AnnotationTableConfig = getAnnotationTableConfig();
  typeConfig: AnnotationType;
  annotationTypeDisplayName: string;
  splitDataList: { [key: string]: Array<TermAnnotation> } = {};
  splitSummaryList = {};
  split_by_parents: Array<SplitByParentsConfig> = [];
  helpIconTitle = 'Click to view documention';

  constructor(public deployConfigService: DeployConfigService) { }

  maybeDoSplit() {
    if (this.annotationTable && this.typeConfig && this.typeConfig.split_by_parents) {
      this.split_by_parents = this.typeConfig.split_by_parents;
      this.splitDataList = {};
      this.splitSummaryList = {};

      for (let splitByConfig of this.split_by_parents) {
        let seenTerms: {[termid: string]: boolean} = {};
        for (let splitByTermId of splitByConfig.termids) {
          let notFlag = false;

          if (splitByTermId.startsWith('NOT ')) {
            // handling splitting out some terms, eg. MF binding vs NOT binding
            notFlag = true;
            splitByTermId = splitByTermId.substr(4);
          }

          for (let termAnnotation of this.annotationTable) {
            let interestingParentIds = termAnnotation.term.interesting_parent_ids;
            let isInThisSplit =
              termAnnotation.term.termid === splitByTermId ||
              interestingParentIds && (interestingParentIds.indexOf(splitByTermId) !== -1);

            if (notFlag && !isInThisSplit ||
                !notFlag && isInThisSplit) {
              if (!this.splitDataList[splitByConfig.config_name]) {
                this.splitDataList[splitByConfig.config_name] = [];
              }
              let seenTermsKey;
              if (termAnnotation.is_not) {
                // confusing! - this is_not is different from the NOT in the config
                seenTermsKey = 'not-' + termAnnotation.term.termid;
              } else {
                seenTermsKey = termAnnotation.term.termid;
              }
              if (!seenTerms[seenTermsKey]) {
                this.splitDataList[splitByConfig.config_name].push(termAnnotation);
                seenTerms[seenTermsKey] = true;
              }
            }
          }
        }
      }
    }
  }

  ngOnInit() {
  }

  ngOnChanges() {
    this.typeConfig = this.config.getAnnotationType(this.annotationTypeName);

    if (this.tableDisplayName == null) {
      if (this.typeConfig.display_name) {
        this.tableDisplayName = this.typeConfig.display_name;
      } else {
        this.tableDisplayName = this.annotationTypeName;
      }
    }

    if (this.tableDisplayName) {
      this.helpIconTitle = 'Click to view documentation for the ' + this.tableDisplayName +
        ' section';
    } else {
      this.helpIconTitle = 'Click to view documentation';
    }

    this.maybeDoSplit();
  }
}
