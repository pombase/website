import { Component, OnInit, Input, Output, OnChanges, EventEmitter } from '@angular/core';
import { TermAnnotation, ReferenceShort, Annotation } from '../pombase-api.service';

import { getAnnotationTableConfig, AnnotationTableConfig, AnnotationType,
         FilterConfig, AnnotationExternalLinkConfig, getAppConfig,
         AppConfig} from '../config';
import { AnnotationTable } from '../pombase-api.service';
import { TableViewState } from '../pombase-types';
import { TermShort } from '../pombase-query';
import { Filter } from '../filtering';

@Component({
  selector: 'app-annotation-sub-table',
  templateUrl: './annotation-sub-table.component.html',
  styleUrls: ['./annotation-sub-table.component.css']
})
export class AnnotationSubTableComponent implements OnInit, OnChanges {
  @Input() annotationTypeName: string;
  @Input() hideColumns: Array<string>;
  @Input() featureInFirstColumn = false;
  @Input() detailsOnly = false;
  @Input() annotationTable: Array<TermAnnotation>;
  @Input() scope: string;
  @Output() tableViewChangeEmitter = new EventEmitter<TableViewState>();

  // copy to the component for use in template
  TableViewState = TableViewState;

  config: AnnotationTableConfig = getAnnotationTableConfig();
  appConfig: AppConfig = getAppConfig();
  typeConfig: AnnotationType;
  filterConfig: Array<FilterConfig>|undefined = undefined;
  filteredTable: AnnotationTable = [];

  hideColumn = {};
  showColumn: { [key: string]: boolean } = {};
  termNameColSpan = -1;
  compactFirstRows: { [key: string]: boolean } = {};
  detailsView: {[key: string]: boolean} = {};
  currentViewState = TableViewState.Summary;
  tableIsFiltered = false;
  filteredAnnotationCount = 0;
  annotationCount = 0;

  externalLinksConfig: Array<AnnotationExternalLinkConfig> = [];
  allTermIds: Array<string> = [];

  getAllTermIds(): Array<string> {
    if (this.annotationTable) {
      let ret: Array<string> = [];

      this.annotationTable.map((termAnnotation: TermAnnotation) => {
        if (!termAnnotation.is_not) {
          ret.push(termAnnotation.term.termid);
        }
      });

      return ret;
    } else {
      return [];
    }
  }

  updateCurrentFilter(filter: Filter<AnnotationTable>|undefined) {
    if (filter) {
      [this.filteredTable, this.annotationCount, this.filteredAnnotationCount] =
        filter.filter(this.annotationTable);
    } else {
      this.filteredTable = this.annotationTable;
    }

    this.tableIsFiltered = !!filter;
  }

  constructor() { }

  getCountPopoverContext(term: TermShort): { [key: string]: number|string } {
    let termId: string;
    if (this.typeConfig.hide_term_id_prefix) {
      termId = term.termid.replace(/^.*?:/, '');
    } else {
      termId = term.termid;
    }
    return {
      geneCount: term.gene_count,
      termId,
    };
  }

  detailsViewVisible(termAnnotation: TermAnnotation): boolean {
    let key;
    if (termAnnotation.is_not) {
      key = 'NOT:' + termAnnotation.term.termid;
    } else {
      key = termAnnotation.term.termid;
    }

    return this.detailsView[key] || false;
  }

  toggleDetails(termAnnotation: TermAnnotation) {
    let key;
    if (termAnnotation.is_not) {
      key = 'NOT:' + termAnnotation.term.termid;
    } else {
      key = termAnnotation.term.termid;
    }

    this.detailsView[key] = !this.detailsView[key];

    let seenSummarised = false;

    for (let termAnnotation of this.annotationTable) {
      if (termAnnotation.summary) {
        if (!this.detailsViewVisible(termAnnotation)) {
          seenSummarised = true;
        }
      }
    }

    if (seenSummarised) {
      this.currentViewState = TableViewState.Summary;
    } else {
      this.currentViewState = TableViewState.Details;
    }

    this.tableViewChangeEmitter.emit(this.currentViewState);
  }

  allDetailsView() {
    this.currentViewState = TableViewState.Details;
    for (let termAnnotation of this.annotationTable) {
      this.detailsView[termAnnotation.term.termid] = true;
      if (termAnnotation.is_not) {
        this.detailsView['NOT:' + termAnnotation.term.termid] = true;
      }
    }
    this.tableViewChangeEmitter.emit(this.currentViewState);
  }

  allSummaryView() {
    this.currentViewState = TableViewState.Summary;
    for (let termAnnotation of this.annotationTable) {
      this.detailsView[termAnnotation.term.termid] = false;
      if (termAnnotation.is_not) {
        this.detailsView['NOT:' + termAnnotation.term.termid] = false;
      }
    }
    this.tableViewChangeEmitter.emit(this.currentViewState);
  }

  trackByTermId(_: number, item: any) {
    return item.term.termid;
  }

  getTermXrefLink(sourceName: string, id: string, geneUniquename?: string): string {
    if (sourceName && id) {
      const linkConf = this.appConfig.getMiscExternalLink(sourceName, id, geneUniquename);
      if (linkConf) {
        return linkConf.url;
      } else {
        return '';
      }
    } else {
      return '';
    }
  }

  xrefSource(xrefKeyValue: any): string {
    return xrefKeyValue.key as string;
  }

  xrefId(xrefKeyValue: any): string {
    return xrefKeyValue.value.xref_id as string;
  }

  checkCondition(condition: string|undefined, reference: ReferenceShort): boolean {
    if (condition) {
      if (condition.startsWith('reference=')) {
        const condRef = condition.substring(10);
        if (reference && condRef && condRef === reference.uniquename) {
          return true;
        }
      }
    }
    return false;
  }

  showXRef(sourceName: string, reference: ReferenceShort): boolean {
    if (!this.typeConfig.source_config) {
      return false;
    }
    const sourceConfig = this.typeConfig.source_config[sourceName];
    if (sourceConfig) {
      const condition = sourceConfig.condition;
      return this.checkCondition(condition, reference);
    } else {
      return true;
    }
  }

  otherSources(reference: ReferenceShort): Array<string> {
    let sourceConfig = this.typeConfig.source_config;
    if (!sourceConfig) {
      return [];
    }

    let ret = [];

    for (const sourceName of Object.keys(sourceConfig)) {
      const conf = sourceConfig[sourceName];
      if (this.checkCondition(conf.condition, reference) && !conf.id_source) {
        ret.push(sourceName);
      }
    }

    return ret;
  }

  getDisplayTermId(termAnnotation: TermAnnotation) {
    if (this.typeConfig.hide_term_id_prefix) {
      return termAnnotation.term.termid.replace(/^.*?:/, '');
    } else {
      return termAnnotation.term.termid;
    }
  }

  hasQualifiers(): boolean {
    for (let termAnnotation of this.annotationTable) {
      for (let annotation of termAnnotation.annotations) {
        if (annotation['qualifiers'] && annotation['qualifiers'].length > 0) {
          return true;
        }
      }
    }

    return false;
  }

  transcriptDisplay(annotation: Annotation): string {
    if (annotation.transcripts && annotation.transcripts.length > 0) {
      const gene = annotation.transcripts[0].gene!;
      const transcriptCount = gene.transcript_count || 1;
      if (annotation.transcripts.length == transcriptCount) {
        return 'All';
      } else {
        return annotation.transcripts.map(transcriptDetails => transcriptDetails.uniquename).join(', ');
      }
    } else {
      return '';
    }
  }

  init() {
    let typeConfig = this.config.getAnnotationType(this.annotationTypeName);

    if (typeConfig.columns_to_show) {
      for (let columnName of typeConfig.columns_to_show) {
        this.showColumn[columnName] = true;
      }
    }

    if (this.hideColumns) {
      for (let columnName of this.hideColumns) {
        this.showColumn[columnName] = false;
      }
    }

    if (!this.hasQualifiers()) {
      this.showColumn['qualifiers'] = false;
    }

    this.showColumn['transcripts'] = false;

    if (this.annotationTable && this.annotationTable.length > 0 &&
        typeConfig.feature_type == 'gene') {
      const firstTermAnnotation = this.annotationTable[0];
      const firstAnnotation = firstTermAnnotation.annotations[0];

      if (firstAnnotation.genes.length > 0) {
        const firstGene = firstAnnotation.genes[0];
        if (firstGene.transcript_count && firstGene.transcript_count > 1) {
          this.showColumn['transcripts'] = true;
        }
      }
    }

    for (let columnName of Object.keys(this.showColumn)) {
      if (this.showColumn[columnName]) {
        this.termNameColSpan++;
      }
    }

    if (this.featureInFirstColumn) {
      this.termNameColSpan -= 1;
    }

    let foundBackground = false;

    if (this.annotationTable && this.annotationTable.length > 0) {
      for (let termAnnotation of this.annotationTable) {
        this.compactFirstRows[termAnnotation.term.termid] =
          !this.showColumn['extension'] ||
          !termAnnotation.annotations[0].extension ||
          termAnnotation.annotations[0].extension.length === 0;
      }

      FOUND:
      for (let termAnnotation of this.annotationTable) {
        for (let annotation of termAnnotation.annotations) {
          if (annotation.genotype_background) {
            foundBackground = true;
            break FOUND;
          }
        }
      }
    }

    if (!foundBackground) {
      this.showColumn['genotype_background'] = false;
    }

    if (typeConfig.details_only) {
      this.detailsOnly = true;
    }

    if (this.detailsOnly) {
      this.allDetailsView();
    } else {
      this.allSummaryView();
    }

    this.allTermIds = this.getAllTermIds();
  }

  ngOnInit() {
    this.typeConfig = this.config.getAnnotationType(this.annotationTypeName);
    this.filterConfig = this.typeConfig.filters;
    this.externalLinksConfig = this.typeConfig.external_link_config || [];
  }

  ngOnChanges() {
    // reset when gene changes
    this.updateCurrentFilter(undefined);
    this.init();
  }
}
