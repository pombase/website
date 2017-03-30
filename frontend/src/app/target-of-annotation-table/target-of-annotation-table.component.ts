import { Component, Input, OnInit, OnChanges } from '@angular/core';

import { TargetOfAnnotation } from '../pombase-api.service';
import { getAnnotationTableConfig, AnnotationTableConfig } from '../config';
import { Util } from '../util';

@Component({
  selector: 'app-target-of-annotation-table',
  templateUrl: './target-of-annotation-table.component.html',
  styleUrls: ['./target-of-annotation-table.component.css']
})
export class TargetOfAnnotationTableComponent implements OnInit, OnChanges {

  @Input() annotationTable: Array<TargetOfAnnotation>;

  config: AnnotationTableConfig = getAnnotationTableConfig();
  displayTable = [];

  constructor() {
  }

  makeDisplayTable(): void {
    if (this.annotationTable) {
      let typeConfig = this.config.getAnnotationType('target_of');
      let ontologyLabels = typeConfig.misc_config['ontologyLabels'];

      this.displayTable =
        this.annotationTable.map(annotation => {
          let ontologyLabel =
            ontologyLabels[annotation.ontology_name] || annotation.ontology_name;
          return {
            ontologyLabel: ontologyLabel,
            ext_rel_display_name: annotation.ext_rel_display_name,
            gene: annotation.gene,
            genotype: annotation.genotype,
            reference: annotation.reference,
          };
        })
      this.displayTable
        .sort((o1, o2) => {
          let labelCompare =
            o2.ontologyLabel.localeCompare(o1.ontologyLabel);

          if (labelCompare == 0) {
            if (o1.gene && o2.gene) {
              return Util.geneCompare(o1.gene, o2.gene);
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
        });
    } else {
      this.displayTable = [];
    }
  }

  ngOnInit() {
    this.makeDisplayTable();
  }

  ngOnChanges() {
    this.makeDisplayTable();
  }
}
