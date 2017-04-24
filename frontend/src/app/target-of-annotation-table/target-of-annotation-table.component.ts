import { Component, Input, OnInit, OnChanges } from '@angular/core';

import { TargetOfAnnotation, GeneShort } from '../pombase-api.service';
import { getAnnotationTableConfig, AnnotationTableConfig } from '../config';
import { Util } from '../util';
import { TableViewState } from '../pombase-types';

@Component({
  selector: 'app-target-of-annotation-table',
  templateUrl: './target-of-annotation-table.component.html',
  styleUrls: ['./target-of-annotation-table.component.css']
})
export class TargetOfAnnotationTableComponent implements OnInit, OnChanges {

  @Input() annotationTable: Array<TargetOfAnnotation>;

  config: AnnotationTableConfig = getAnnotationTableConfig();
  displayTable = [];
  summaryTable = [];

  // copy to the component for use in template
  TableViewState = TableViewState;

  currentViewState = TableViewState.Summary;

  constructor() {
  }

  showDetails() {
    this.currentViewState = TableViewState.Details;
  }

  showSummary() {
    this.currentViewState = TableViewState.Summary;
  }

  makeTables(): void {
    if (this.annotationTable) {
      let typeConfig = this.config.getAnnotationType('target_of');
      let ontologyLabels = typeConfig.misc_config['ontologyLabels'];

      this.displayTable = [];
      this.summaryTable = [];

      for (let annotation of this.annotationTable) {
        let ontologyLabel =
          ontologyLabels[annotation.ontology_name] || annotation.ontology_name;
        this.displayTable.push({
          ontologyLabel: ontologyLabel,
          ext_rel_display_name: annotation.ext_rel_display_name,
          genes: annotation.genes,
          genotype: annotation.genotype,
          reference: annotation.reference,
        });
      }

      let rowComp = (o1, o2) => {
        let labelCompare =
          o2.ontologyLabel.localeCompare(o1.ontologyLabel);

        if (labelCompare === 0) {
          if (o1.genes.length > 0 && o2.genes.length > 0) {
            return Util.geneCompare(o1.genes[0], o2.genes[0]);
          } else {
            if (o1.genotype && o2.genotype) {
              return Util.genotypeCompare(o1.genotype, o2.genotype);
            } else {
              return 0;
            }
          }
        } else {
          return labelCompare;
        }
      };

      this.displayTable.sort(rowComp);

      for (let annotation of this.displayTable) {
        let summaryRow = {
          ontologyLabel: annotation.ontologyLabel,
          ext_rel_display_name: annotation.ext_rel_display_name,
          genes: annotation.genes as Array<GeneShort>,
        };

        if (this.summaryTable.length === 0) {
          this.summaryTable.push(summaryRow);
        } else {
          let prevSummaryRow = this.summaryTable[this.summaryTable.length - 1];

          let genesToString =
            (genes) => {
              return genes.map((gene) => gene.uniquename).join(' ');
            };

          if (prevSummaryRow['ontologyLabel'] !== summaryRow['ontologyLabel'] ||
              prevSummaryRow['ext_rel_display_name'] !== summaryRow['ext_rel_display_name'] ||
              genesToString(prevSummaryRow.genes) !== genesToString(summaryRow.genes)) {
            this.summaryTable.push(summaryRow);
          }
        }
      }
    } else {
      this.displayTable = [];
    }
  }

  ngOnInit() {
    this.makeTables();
  }

  ngOnChanges() {
    this.makeTables();
  }
}
