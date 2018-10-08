import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { InteractionAnnotation, GeneShort, GeneDetails } from '../pombase-api.service';
import { getAnnotationTableConfig, AnnotationTableConfig, makeGeneExternalUrl, AppConfig, getAppConfig } from '../config';
import { Util } from '../shared/util';

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

  annotationTypeDisplayName = null;
  hideColumn = {};

  displayTable = [];
  helpIconTitle = 'View documentation';

  routerLinkUrl = null;
  biogridUrl: string = null;

  constructor() { }

  ngOnInit() {
    this.hideColumns.map(col => {
      this.hideColumn[col] = true;
    });

    let typeConfig = this.config.annotationTypes[this.annotationTypeName];
    if (typeConfig && typeConfig.display_name) {
      this.annotationTypeDisplayName =
        this.config.annotationTypes[this.annotationTypeName].display_name;
      this.helpIconTitle = 'Click to view documentation for ' + typeConfig.display_name;
    } else {
      this.annotationTypeDisplayName = this.annotationTypeName;
      this.helpIconTitle = 'Click to view documentation';
    }
  }

  ngOnChanges() {
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
      this.annotationTable.map(
        (annotation) => {
          let displayAnnotation = {
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

    this.displayTable.sort((a: InteractionAnnotation, b: InteractionAnnotation) => {
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
}
