import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { GeneticInteractionGroup, GeneShort, GeneDetails, ReferenceShort, GenotypeShort, ThroughputType } from '../pombase-api.service';
import { getAnnotationTableConfig, AnnotationTableConfig, AppConfig, getAppConfig, FilterConfig } from '../config';
import { Util } from '../shared/util';
import { GeneticInteractionFilter } from '../filtering';
import { TermShort } from '../pombase-query';

interface DisplayDetail {
  reference: ReferenceShort;
  genotype_a_uniquename?: string;
  genotype_b_uniquename?: string;
  double_mutant_phenotype?: TermShort;
  double_mutant_genotype?: GenotypeShort;
  rescued_phenotype?: TermShort;
  throughput: ThroughputType;
  interaction_note?: string;
}

interface DisplayAnnotation {
  gene_a: GeneShort;
  gene_b: GeneShort;
  interaction_type: string;
  displayLabel: string;
  details: Array<DisplayDetail>;
  showColumn: Set<string>,
}

@Component({
  selector: 'app-genetic-interaction-annotation-table',
  templateUrl: './genetic-interaction-annotation-table.component.html',
  styleUrls: ['./genetic-interaction-annotation-table.component.css']
})
export class GeneticInteractionAnnotationTableComponent implements OnInit, OnChanges {
  @Input() annotationTypeName: string;
  @Input() currentGene: GeneDetails;
  @Input() hideColumns: Array<string> = [];
  @Input() annotationTable: Array<GeneticInteractionGroup>;

  config: AnnotationTableConfig = getAnnotationTableConfig();
  appConfig: AppConfig = getAppConfig();
  siteName = this.appConfig.site_name;

  filteredTable: Array<GeneticInteractionGroup>;

  annotationTypeDisplayName: string;
  hideColumn: { [key: string]: boolean } = {};

  displayTable: Array<DisplayAnnotation> = [];
  helpIconTitle = 'View documentation';

  queryLinkUrl: string;
  biogridUrl: string;
  annotationCount: any;
  filteredAnnotationCount: any;
  tableIsFiltered: boolean;
  filters?: Array<FilterConfig>;
  interactionNoteRef: any;

  interactionSources = this.appConfig.data_sources.interactions;

  constructor() { }

  ngOnInit() {
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
    this.hideColumns.map(col => {
      this.hideColumn[col] = true;
    });

    this.hideColumn['interactionNote'] = true;

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
      this.queryLinkUrl = `/results/from/json/${json}`;

      if (this.currentGene.biogrid_interactor_id) {
        const linkResult =
          this.appConfig.getExternalGeneLink('BioGRID', this.currentGene.taxonid,
                                             this.currentGene);
        if (linkResult) {
          [, this.biogridUrl] = linkResult;
        }
      }
    }

    this.displayTable =
      this.filteredTable.map(
        (interactionGroup) => {
          let displayAnnotation: DisplayAnnotation = {
            gene_a: interactionGroup.gene_a,
            gene_b: interactionGroup.gene_b,
            interaction_type: interactionGroup.interaction_type,
            displayLabel: '',
            details: interactionGroup.details,
            showColumn: new Set(),
          };

          let labelConfig = this.config.interactionConfig[interactionGroup.interaction_type];

          if (!labelConfig) {
            return displayAnnotation;
          }

          let displayDetails: Array<DisplayDetail> = [];

          interactionGroup.details.map(detail => {
            const newDetail: DisplayDetail = Object.assign({}, detail);

            if (newDetail.reference) {
              displayAnnotation.showColumn.add('reference');
            }

            if (newDetail.double_mutant_phenotype) {
              displayAnnotation.showColumn.add('double_mutant_phenotype');
            }
            if (newDetail.double_mutant_genotype) {
              displayAnnotation.showColumn.add('double_mutant_genotype');
            }
            if (newDetail.rescued_phenotype) {
              displayAnnotation.showColumn.add('rescued_phenotype');
            }

            displayDetails.push(newDetail);
          });

          displayAnnotation.details = displayDetails;

          displayAnnotation.displayLabel = labelConfig.baitLabel;

          if (this.currentGene) {
            if (this.currentGene.uniquename !== interactionGroup.gene_a.uniquename) {
              // current gene is the prey
              displayAnnotation.displayLabel = labelConfig.preyLabel;
              [displayAnnotation.gene_a, displayAnnotation.gene_b] =
                [displayAnnotation.gene_b, displayAnnotation.gene_a];
            }
          }

          return displayAnnotation;
        });

    this.displayTable.sort((a: DisplayAnnotation, b: DisplayAnnotation) => {
      if (this.currentGene) {
        const geneComp = Util.geneCompare(a.gene_b, b.gene_b);
        if (geneComp === 0) {
          return a.interaction_type.localeCompare(b.interaction_type);
        }
        return geneComp;
      } else {
        let geneComp = Util.geneCompare(a.gene_a, b.gene_a);
        if (geneComp === 0) {
          geneComp = Util.geneCompare(a.gene_b, b.gene_b);
          if (geneComp === 0) {
            return a.interaction_type.localeCompare(b.interaction_type);
          }
        }

        return geneComp;
      }
    });
  }

  showDetailsOf(displayAnnotation: DisplayAnnotation): boolean {
    return displayAnnotation.showColumn.size > 0;
  }

  ngOnChanges() {
    this.updateCurrentFilter(undefined);
  }

  updateCurrentFilter(filter?: GeneticInteractionFilter) {
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
