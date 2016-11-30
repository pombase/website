import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

import { TermShort, GeneByTerm, GeneQueryNode } from '../common/pombase-query';

@Component({
  selector: 'app-query-node',
  templateUrl: './query-node.component.html',
  styleUrls: ['./query-node.component.css']
})
export class QueryNodeComponent implements OnInit {
  @Input() node: GeneQueryNode;
  @Output() newNode = new EventEmitter<GeneQueryNode>();

  cvNames = ['molecular_function', 'biological_process', 'cellular_component',
             'fission_yeast_phenotype'];

  constructor() { }

  ngOnInit() {
  }

  termMatched(term: TermShort) {
    let part = new GeneByTerm(term.termid);
    this.newNode.emit(part);
  }
}
