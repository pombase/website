import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { QueryNodeConfig } from '../config';
import { GeneQueryNode, NodeEventDetails, SubsetNode } from '../pombase-query';

@Component({
  selector: 'app-query-subset-input',
  templateUrl: './query-subset-input.component.html',
  styleUrls: ['./query-subset-input.component.css']
})
export class QuerySubsetInputComponent implements OnInit {
  @Input() nodeConfig: QueryNodeConfig;
  @Output() nodeEvent = new EventEmitter<NodeEventDetails>();

  subsetName = '';

  constructor() { }

  emitNodeEvent(node: GeneQueryNode): void {
    this.nodeEvent.emit({ node, nodeConf: this.nodeConfig });
  }

  subsetInputSearch(): void {
    let trimmedSubsetName = this.subsetName.trim();
    if (trimmedSubsetName.length > 0) {
      let longName;
      if (this.nodeConfig && this.nodeConfig.subsetPrefix) {
        longName = this.nodeConfig.subsetPrefix + ':' + trimmedSubsetName;
      } else {
        longName = trimmedSubsetName;
      }
      let part = new SubsetNode(undefined, longName);
      this.emitNodeEvent(part);
    }
  }

  clear() {
    this.subsetName = '';
  }

  ngOnInit(): void {
  }

}
