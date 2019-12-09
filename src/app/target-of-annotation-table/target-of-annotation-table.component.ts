import { Component, Input, OnInit, OnChanges } from '@angular/core';

import { TargetOfAnnotation, GeneShort, GenotypeShort, ReferenceShort } from '../pombase-api.service';
import { getAppConfig } from '../config';
import { Util } from '../shared/util';
import { TableViewState } from '../pombase-types';

interface DisplayRow {
  ontologyLabel: string;
  ext_rel_display_name: string;
  gene: GeneShort;
  genotype: GenotypeShort;
  reference: ReferenceShort;
}

interface SummaryRow {
  ontologyLabel: string;
  ext_rel_display_name: string;
  gene: GeneShort;
}

@Component({
  selector: 'app-target-of-annotation-table',
  templateUrl: './target-of-annotation-table.component.html',
  styleUrls: ['./target-of-annotation-table.component.css']
})
export class TargetOfAnnotationTableComponent implements OnInit, OnChanges {

  @Input() annotationTable: Array<TargetOfAnnotation>;

  config = getAppConfig().targetOfConfig;
  displayTable: Array<DisplayRow> = [];
  summaryTable: Array<SummaryRow> = [];

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
      let ontologyLabels = this.config.ontology_labels;

      this.displayTable = [];
      this.summaryTable = [];

      for (let annotation of this.annotationTable) {
        let ontologyLabel =
          ontologyLabels[annotation.ontology_name] || annotation.ontology_name;
        this.displayTable.push({
          ontologyLabel: ontologyLabel,
          ext_rel_display_name: annotation.ext_rel_display_name,
          gene: annotation.gene as GeneShort,
          genotype: annotation.genotype,
          reference: annotation.reference,
        });
      }

      for (let annotation of this.displayTable) {
        let summaryRow = {
          ontologyLabel: annotation.ontologyLabel,
          ext_rel_display_name: annotation.ext_rel_display_name,
          gene: annotation.gene as GeneShort,
        };

        if (this.summaryTable.length === 0) {
          this.summaryTable.push(summaryRow);
        } else {
          let prevSummaryRow = this.summaryTable[this.summaryTable.length - 1];

          if (prevSummaryRow['ontologyLabel'] !== summaryRow['ontologyLabel'] ||
              prevSummaryRow['ext_rel_display_name'] !== summaryRow['ext_rel_display_name'] ||
              prevSummaryRow.gene.uniquename !== summaryRow.gene.uniquename) {
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
