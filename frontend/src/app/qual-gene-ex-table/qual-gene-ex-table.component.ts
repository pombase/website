import { Component, OnInit, Input } from '@angular/core';

import { TermAnnotation } from '../pombase-api.service';

@Component({
  selector: 'app-qual-gene-ex-table',
  templateUrl: './qual-gene-ex-table.component.html',
  styleUrls: ['./qual-gene-ex-table.component.css']
})
export class QualGeneExTableComponent implements OnInit {
  @Input() annotationTable: Array<TermAnnotation>;

  trackByTermId(index: number, item: any) {
    return item.term.termid;
  }

  constructor() { }

  ngOnInit() {
  }
}
