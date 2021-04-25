import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';

import { TermAnnotation, AnnotationTable } from '../pombase-api.service';
import { FilterConfig } from '../config';
import { AnnotationPloidinessFilter } from '../filtering/annotation-ploidiness-filter';
import { Filter } from '../filtering';
import { Ploidiness } from '../pombase-query';

class SelectData {
  constructor(public name: Ploidiness,
              public displayName: string,
              public active: boolean) { }
}

@Component({
  selector: 'app-annotation-table-ploidiness-filter',
  templateUrl: './annotation-table-ploidiness-filter.component.html',
  styleUrls: ['./annotation-table-ploidiness-filter.component.css']
})
export class AnnotationTablePloidinessFilterComponent implements OnInit, OnChanges {
  @Input() annotationTable: Array<TermAnnotation>;
  @Input() config: FilterConfig;
  @Output() filterChange = new EventEmitter<Filter<AnnotationTable>>();

  anySelectData = new SelectData('any', 'Any (default)', true);
  selectedCategory: SelectData = this.anySelectData;

  haploidSelectData = new SelectData('haploid', 'Haploid', false);
  diploidSelectData = new SelectData('diploid', 'Diploid', false);

  reset(): void {
    this.selectedCategory = this.anySelectData;
    this.setCategory(undefined);
  }

  setCategory(event?: SelectData): void {
    if (event) {
      this.filterChange.emit(new AnnotationPloidinessFilter(event.name));
    } else {
      this.filterChange.emit(undefined);
    }
  }

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges() {
    this.selectedCategory = this.anySelectData;

    let seenHaploid = false;
    let seenDiploid = false;

    TERM_ANNOTATION: for (let termAnnotation of this.annotationTable) {
      for (let annotation of termAnnotation.annotations) {
        for (const locus of annotation.genotype.loci) {
          if (locus.expressed_alleles.length == 1) {
            seenHaploid = true;
          } else {
            seenDiploid = true;
          }

          if (seenHaploid && seenDiploid) {
            break TERM_ANNOTATION;
          }
        }
      }
    }

    this.haploidSelectData.active = seenHaploid;
    this.diploidSelectData.active = seenDiploid;
  }
}
