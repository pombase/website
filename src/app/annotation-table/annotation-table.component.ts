import { Component, Input, OnInit, OnChanges, Output, EventEmitter } from '@angular/core';
import { TermAnnotation, GeneDetails } from '../pombase-api.service';

import { getAnnotationTableConfig, AnnotationTableConfig, AnnotationType,
         SplitByParentsConfig } from '../config';
import { DeployConfigService } from '../deploy-config.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Util } from '../shared/util';
import { AnnotationTableIntersection } from '../annotation-table-intersection-event';

@Component({
    selector: 'app-annotation-table',
    templateUrl: './annotation-table.component.html',
    styleUrls: ['./annotation-table.component.css'],
    standalone: false
})
export class AnnotationTableComponent implements OnInit, OnChanges {
  @Input() tableDisplayName?: string;
  @Input() annotationTypeName: string;
  @Input() hideColumns: Array<string>;
  @Input() featureInFirstColumn = false;
  @Input() annotationTable: Array<TermAnnotation>;
  @Input() geneDetails?: GeneDetails;
  @Input() scope: string; // "gene", "term", "reference" ...
  @Output() annotationTableIntersection = new EventEmitter<AnnotationTableIntersection>();

  config: AnnotationTableConfig = getAnnotationTableConfig();
  typeConfig: AnnotationType;
  annotationTypeDisplayName: string;
  splitDataList: { [key: string]: Array<TermAnnotation> } = {};
  split_by_parents: Array<SplitByParentsConfig> = [];
  helpIconTitle = 'Click to view documention';
  sanitizedFeatureViewURL?: SafeResourceUrl;

  constructor(private sanitizer: DomSanitizer,
              public deployConfigService: DeployConfigService) { }

  maybeDoSplit() {
    const makeKey = (termAnnotation: TermAnnotation) => {
      if (termAnnotation.is_not) {
        // confusing! - this is_not is different from the NOT in the config
        return 'not-' + termAnnotation.term.termid;
      } else {
        return termAnnotation.term.termid;
      }
    }

    if (this.annotationTable && this.typeConfig && this.typeConfig.split_by_parents) {
      this.split_by_parents = [...this.typeConfig.split_by_parents];
      const defaultConfig = {
        config_name: 'other',
        termids: [],
        display_name: 'Other',
      };
      this.split_by_parents.push(defaultConfig);
      this.splitDataList = {};
      let seenTermsAnySplit: { [termid: string]: boolean } = {};

      for (let splitByConfig of this.split_by_parents) {
        let seenTermsThisSplit: {[termid: string]: boolean} = {};
        for (let splitByTermId of splitByConfig.termids) {
          let notFlag = false;

          if (splitByTermId.startsWith('NOT ')) {
            // handling splitting out some terms, eg. MF binding vs NOT binding
            notFlag = true;
            splitByTermId = splitByTermId.substring(4);
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

              let seenTermsKey = makeKey(termAnnotation);

              if (!seenTermsThisSplit[seenTermsKey]) {
                this.splitDataList[splitByConfig.config_name].push(termAnnotation);
                seenTermsThisSplit[seenTermsKey] = true;
                seenTermsAnySplit[seenTermsKey] = true;
              }
            }
          }
        }
      }

      for (let termAnnotation of this.annotationTable) {
        let seenTermsKey = makeKey(termAnnotation);

        if (!seenTermsAnySplit[seenTermsKey]) {
          if (!this.splitDataList['other']) {
            this.splitDataList['other'] = [];
          }
          this.splitDataList['other'].push(termAnnotation);
        }
      }
    }
  }

  getProteinViewerIFrameURL(): SafeResourceUrl | undefined {
    return this.sanitizedFeatureViewURL;
  }

  capitalize(s: string): string {
    return Util.capitalize(s);
  }

  ngOnInit() {
  }

  intersectHandler(subTableName: string, isIntersecting: boolean) {
    this.annotationTableIntersection.emit(new AnnotationTableIntersection(subTableName, isIntersecting));
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

    if (this.geneDetails && this.typeConfig.protein_viewer_type) {
      const rawUrl = 'protein_feature_view/' + this.typeConfig.protein_viewer_type + '/' +
        this.geneDetails.uniquename;
      this.sanitizedFeatureViewURL =
        this.sanitizer.bypassSecurityTrustResourceUrl(rawUrl);
    } else {
      this.sanitizedFeatureViewURL = undefined;
    }

    this.maybeDoSplit();
  }
}
