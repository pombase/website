import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

import { TermShort, GeneByTerm, GeneQueryPart } from '../common/pombase-query';

@Component({
  selector: 'app-query-part',
  templateUrl: './query-part.component.html',
  styleUrls: ['./query-part.component.css']
})
export class QueryPartComponent implements OnInit {
  @Input() part: GeneQueryPart;
  @Output() changed = new EventEmitter();

  cvNames = ['molecular_function', 'biological_process', 'cellular_component',
             'fission_yeast_phenotype'];

  constructor() { }

  ngOnInit() {
  }

  termMatched(term: TermShort) {
    let part = new GeneQueryPart(term);
    this.changed.emit(part);
  }
}
