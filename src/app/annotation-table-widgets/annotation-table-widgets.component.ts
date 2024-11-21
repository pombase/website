import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { AnnotationTable, GeneDetails, PombaseAPIService } from '../pombase-api.service';
import { AnnotationType } from '../config';
import { FilterCombiner } from '../filtering';
import { AnnotationExtensionFilter } from '../filtering/annotation-extension-filter';
import { DownstreamGenesNode, GeneQuery, SubstratesNode } from '../pombase-query';
import { HistoryEntry, QueryService } from '../query.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-annotation-table-widgets',
    templateUrl: './annotation-table-widgets.component.html',
    styleUrls: ['./annotation-table-widgets.component.css'],
    standalone: false
})
export class AnnotationTableWidgetsComponent implements OnInit, OnChanges {
  @Input() annotationTable: AnnotationTable;
  @Input() annotationTypeName: string;
  @Input() typeConfig: AnnotationType;
  @Input() geneDetails: GeneDetails;
  @Input() filters?: FilterCombiner<AnnotationTable>;

  duringTermId?: string;
  duringTermName?: string;
  hasSubstrates = false;
  hasDownstreamGenes = false;

  constructor(private router: Router,
              private pombaseApiService: PombaseAPIService,
              private queryService: QueryService) {}

  showWidgets(): boolean {
    return this.hasSubstrates || this.hasDownstreamGenes;
  }

  sendToQueryBuilder(): void {
    let queryName;
    if (this.duringTermId) {
      const duringTermName = this.duringTermName || this.duringTermId;
      queryName = `Substrates of ${this.geneDetails.displayName} during ${duringTermName}`;
    } else {
      queryName = `All substrates of ${this.geneDetails.displayName}`;
    }

    const part = new SubstratesNode(queryName, this.geneDetails.uniquename, this.duringTermId);
    const geneQuery = new GeneQuery(part);
    const callback = (historyEntry: HistoryEntry) => {
      this.router.navigate(['/results/from/id/', historyEntry.getEntryId()]);
    };
    this.queryService.runAndSaveToHistory(geneQuery, callback);
  }

  sendDownstreamGenesToQueryBuilder(): void {
    if (!this.hasDownstreamGenes) {
      return;
    }
    let queryName = `Genes downstream of (affected by) ${this.geneDetails.displayName}`

    const part = new DownstreamGenesNode(queryName, this.geneDetails.uniquename,
                                         this.annotationTypeName);
    const geneQuery = new GeneQuery(part);
    const callback = (historyEntry: HistoryEntry) => {
      this.router.navigate(['/results/from/id/', historyEntry.getEntryId()]);
    };
    this.queryService.runAndSaveToHistory(geneQuery, callback);
  }

  updateSubstratesState() {
    if (this.annotationTypeName !== 'molecular_function') {
      return;
    }
    this.duringTermId = undefined;
    this.hasSubstrates = false;

    if (!this.typeConfig.filters) {
      return;
    }

    let extFilterConf = undefined;

    for (const filterConf of this.typeConfig.filters) {
      if (filterConf.filter_type == "extension" &&
          filterConf.filter_subtype == "during") {
        extFilterConf = filterConf;
        break;
      }
    }

    if (!extFilterConf) {
      return;
    }

    const filterConfRelTypes = extFilterConf.extension_rel_type_names;

    if (!filterConfRelTypes) {
      return;
    }

    if (this.filters) {
      for (let filter of this.filters.getFilters()) {
        if (filter instanceof AnnotationExtensionFilter) {
          const filterTermIds = filter.getFilterTermIds();

          const duringTermId = filterTermIds[0];
          this.duringTermId = duringTermId;
          this.findDuringTermName(duringTermId);
        }
      }
    }

    TERM_ANNOTATIONS:
    for (const termAnnotation of this.annotationTable) {
      for (const annotation of termAnnotation.annotations) {
        for (const extPart of annotation.extension) {
          if (extPart.rel_type_name == 'has_input') {
            this.hasSubstrates = true;
            break TERM_ANNOTATIONS;
          }
        }
      }
    }
  }

  updateDownstreamGenesState() {
    const downstreamRelations = this.typeConfig.downstream_relations;
    if (!this.typeConfig.downstream_query_title || !downstreamRelations) {
      return;
    }
    this.hasDownstreamGenes = false;

    TERM_ANNOTATIONS:
    for (const termAnnotation of this.annotationTable) {
      for (const annotation of termAnnotation.annotations) {
        for (const extPart of annotation.extension) {
          if (downstreamRelations.includes(extPart.rel_type_name)) {
            this.hasDownstreamGenes = true;
            break TERM_ANNOTATIONS;
          }
        }
      }
    }
  }

  findDuringTermName(duringTermId: string) {
    this.pombaseApiService.termSummaryById(duringTermId)
      .then(termSummary => {
        this.duringTermName = termSummary?.name;
      });
  }

  sendSubstratesText(): string {
    if (this.duringTermId) {
      return `Send substrate genes during ${this.duringTermName || this.duringTermId} to Advanced Search ...`;
    } else {
      return 'Send all substrate genes to Advanced Search ...';
    }
  }

  ngOnChanges() {
    this.updateSubstratesState();
    this.updateDownstreamGenesState();
  }

  ngOnInit() {
    this.updateSubstratesState();
    this.updateDownstreamGenesState();
  }
}
