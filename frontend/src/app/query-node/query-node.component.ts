import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

import { TermShort, TermNode, GeneQueryNode } from '../common/pombase-query';

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
    let part = new TermNode(term);
    this.newNode.emit(part);
  }
}
