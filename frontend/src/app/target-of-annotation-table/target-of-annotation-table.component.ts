import { Component, Input, OnInit, OnChanges } from '@angular/core';

import { TargetOfAnnotation, GeneShort, GenotypeShort, ReferenceShort } from '../pombase-api.service';
import { getAnnotationTableConfig, AnnotationTableConfig } from '../config';
import { Util } from '../shared/util';
import { TableViewState } from '../pombase-types';

interface DisplayRow {
  ontologyLabel: string;
  ext_rel_display_name: string;
  genes: Array<GeneShort>;
  genotype: GenotypeShort;
  reference: ReferenceShort;
}

interface SummaryRow {
  ontologyLabel: string;
  ext_rel_display_name: string;
  genes: Array<GeneShort>;
}

@Component({
  selector: 'app-target-of-annotation-table',
  templateUrl: './target-of-annotation-table.component.html',
  styleUrls: ['./target-of-annotation-table.component.css']
})
export class TargetOfAnnotationTableComponent implements OnInit, OnChanges {

  @Input() annotationTable: Array<TargetOfAnnotation>;

  config: AnnotationTableConfig = getAnnotationTableConfig();
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
      let typeConfig = this.config.getAnnotationType('target_of');
      let ontologyLabels = typeConfig.misc_config['ontologyLabels'];

      let genesToString =
        (genes: Array<GeneShort>) => {
          return genes.map((gene) => gene.uniquename).join(' ');
        };

      this.displayTable = [];
      this.summaryTable = [];

      for (let annotation of this.annotationTable) {
        let ontologyLabel =
          ontologyLabels[annotation.ontology_name] || annotation.ontology_name;
        this.displayTable.push({
          ontologyLabel: ontologyLabel,
          ext_rel_display_name: annotation.ext_rel_display_name,
          genes: annotation.genes as Array<GeneShort>,
          genotype: annotation.genotype,
          reference: annotation.reference,
        });
      }

      let rowComp = (o1: DisplayRow, o2: DisplayRow) => {
        let labelCompare =
          o2.ontologyLabel.localeCompare(o1.ontologyLabel);

        if (labelCompare === 0) {
          let geneCompare = Util.geneCompare(o1.genes[0], o2.genes[0]);
          if (geneCompare === 0) {
            let allGenesCompare =
              genesToString(o1.genes).localeCompare(genesToString(o2.genes));
            if (allGenesCompare === 0) {
              return o1.ext_rel_display_name.localeCompare(o2.ext_rel_display_name);
            } else {
              return allGenesCompare;
            }
          } else {
            return geneCompare;
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
