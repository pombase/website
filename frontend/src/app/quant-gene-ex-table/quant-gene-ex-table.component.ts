import { Component, OnInit, Input } from '@angular/core';

import { TermAnnotation } from '../pombase-api.service';

@Component({
  selector: 'app-quant-gene-ex-table',
  templateUrl: './quant-gene-ex-table.component.html',
  styleUrls: ['./quant-gene-ex-table.component.css']
})
export class QuantGeneExTableComponent implements OnInit {
  @Input() annotationTable: Array<TermAnnotation>;

  trackByTermId(index: number, item: any) {
    return item.term.termid;
  }

  constructor() { }

  ngOnInit() {
  }
}
