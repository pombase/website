import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { TermShort, TermNode } from '../pombase-query';

@Component({
  selector: 'app-query-term-node',
  templateUrl: './query-term-node.component.html',
  styleUrls: ['./query-term-node.component.css']
})
export class QueryTermNodeComponent implements OnInit {
  @Input() cvName: string;
  @Input() placeholder: string;
  @Output() newTermNode = new EventEmitter();

  selectedTerm = null;

  constructor() { }

  termMatched(term: TermShort) {
    this.selectedTerm = term;
    this.newTermNode.emit(new TermNode(term));
  }

  ngOnInit() {

  }
}
