import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

import { TermShort, TermIdNode, GeneQueryNode } from '../common/pombase-query';

@Component({
  selector: 'app-query-node',
  templateUrl: './query-node.component.html',
  styleUrls: ['./query-node.component.css']
})
export class QueryNodeComponent implements OnInit {
  @Input() node: GeneQueryNode;
  @Output() newNode = new EventEmitter<GeneQueryNode>();

  cvNames = ['go', 'fypo'];

  constructor() { }

  ngOnInit() {
  }

  termMatched(term: TermShort) {
    let part = new TermIdNode(term.termid);
    this.newNode.emit(part);
  }
}
