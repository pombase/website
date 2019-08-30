import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { InteractionAnnotation, GeneShort, GeneDetails, ReferenceShort } from '../pombase-api.service';
import { getAnnotationTableConfig, AnnotationTableConfig, makeGeneExternalUrl, AppConfig, getAppConfig, FilterConfig } from '../config';
import { Util } from '../shared/util';
import { AnnotationFilter, InteractionFilter } from '../filtering';
import { type } from 'os';

interface DisplayAnnotation {
  gene: GeneShort;
  interactor: GeneShort;
  reference: ReferenceShort;
  evidence: string;
  displayLabel: string;
}

@Component({
  selector: 'app-interaction-annotation-table',
  templateUrl: './interaction-annotation-table.component.html',
  styleUrls: ['./interaction-annotation-table.component.css']
})
export class InteractionAnnotationTableComponent implements OnInit, OnChanges {
  @Input() annotationTypeName: string;
  @Input() currentGene: GeneDetails = null;
  @Input() hideColumns: Array<string> = [];
  @Input() annotationTable: Array<InteractionAnnotation>;

  config: AnnotationTableConfig = getAnnotationTableConfig();
  appConfig: AppConfig = getAppConfig();
  siteName = this.appConfig.site_name;

  filteredTable: Array<InteractionAnnotation> = null;

  annotationTypeDisplayName: string = null;
  hideColumn: { [key: string]: boolean } = {};

  displayTable: Array<DisplayAnnotation> = [];
  helpIconTitle = 'View documentation';

  routerLinkUrl: string = null;
  biogridUrl: string = null;
  annotationCount: any;
  filteredAnnotationCount: any;
  tableIsFiltered: boolean;
  filters: Array<FilterConfig> = null;

  constructor() { }

  ngOnInit() {
    this.hideColumns.map(col => {
      this.hideColumn[col] = true;
    });

    let typeConfig = this.config.annotationTypes[this.annotationTypeName];
    this.filters = typeConfig.filters;

    if (typeConfig && typeConfig.display_name) {
      this.annotationTypeDisplayName =
        this.config.annotationTypes[this.annotationTypeName].display_name;
      this.helpIconTitle = 'Click to view documentation for ' + typeConfig.display_name;
    } else {
      this.annotationTypeDisplayName = this.annotationTypeName;
      this.helpIconTitle = 'Click to view documentation';
    }
  }

  updateDisplayTable(): void {
    if (this.filteredTable === null) {
      this.filteredTable = this.annotationTable;
    }

    let interactionType;

    if (this.annotationTypeName === 'physical_interactions') {
      interactionType = 'physical';
    } else {
      interactionType = 'genetic';
    }

    if (this.currentGene) {
      const json = `{"constraints":{"interactors":
       {"gene_uniquename": "${this.currentGene.uniquename}", "interaction_type": "${interactionType}"}},` +
        '"output_options": {"field_names":["gene_uniquename"],"sequence":"none"}}';
      this.routerLinkUrl = `/query/results/from/json/${json}`;

      if (this.currentGene.biogrid_interactor_id) {
        [, this.biogridUrl] = this.appConfig.getExternalGeneLink('BioGRID', this.currentGene);
      }
    }

    this.displayTable =
      this.filteredTable.map(
        (annotation) => {
          let displayAnnotation: DisplayAnnotation = {
            gene: annotation.gene,
            interactor: annotation.interactor,
            reference: annotation.reference,
            evidence: annotation.evidence,
            displayLabel: '',
          };

          let labelConfig = this.config.interactionDirectionalLabels[annotation.evidence];

          if (!labelConfig) {
            return displayAnnotation;
          }

          displayAnnotation.displayLabel = labelConfig.bait;

          if (this.currentGene) {
            if (this.currentGene.uniquename !== annotation.gene.uniquename) {
              // current gene is the prey
              displayAnnotation.displayLabel = labelConfig.prey;
              [displayAnnotation.gene, displayAnnotation.interactor] =
                [displayAnnotation.interactor, displayAnnotation.gene];
            }
          }

          return displayAnnotation;
        });

    this.displayTable.sort((a: DisplayAnnotation, b: DisplayAnnotation) => {
      if (this.currentGene) {
        const geneComp = Util.geneCompare(a.interactor, b.interactor);
        if (geneComp === 0) {
          return a.evidence.localeCompare(b.evidence);
        }
        return geneComp;
      } else {
        let geneComp = Util.geneCompare(a.gene, b.gene);
        if (geneComp === 0) {
          geneComp = Util.geneCompare(a.interactor, b.interactor);
          if (geneComp === 0) {
            return a.evidence.localeCompare(b.evidence);
          }
        }

        return geneComp;
      }
    });
  }

  ngOnChanges() {
    this.updateCurrentFilter(null);
  }

  updateCurrentFilter(filter: InteractionFilter) {
    if (filter) {
      [this.filteredTable, this.annotationCount, this.filteredAnnotationCount] =
        filter.filter(this.annotationTable);
    } else {
      this.filteredTable = this.annotationTable;
    }

    this.tableIsFiltered = !!filter;

    this.updateDisplayTable();
  }
}
