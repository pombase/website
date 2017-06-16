import { Component, OnInit, Input, OnChanges } from '@angular/core';

import { TermAnnotation } from '../pombase-api.service';

@Component({
  selector: 'app-quant-gene-ex-table',
  templateUrl: './quant-gene-ex-table.component.html',
  styleUrls: ['./quant-gene-ex-table.component.css']
})
export class QuantGeneExTableComponent implements OnInit, OnChanges {
  @Input() annotationTable: Array<TermAnnotation>;
  @Input() hideColumns: Array<string>;

  showDetails = false;
  showGene = false;
  showReference = false;

  trackByTermId(index: number, item: any) {
    return item.term.termid;
  }

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges() {
    this.showDetails = false;
    this.showGene = this.hideColumns.indexOf('gene') === -1;
    this.showReference = this.hideColumns.indexOf('reference') === -1;
  }
}
