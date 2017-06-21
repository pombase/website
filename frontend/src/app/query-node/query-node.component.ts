import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

import { TermShort, TermNode, GeneQueryNode } from '../common/pombase-query';

@Component({
  selector: 'app-query-node',
  templateUrl: './query-node.component.html',
  styleUrls: ['./query-node.component.css']
})
export class QueryNodeComponent implements OnInit {
  @Input() node: GeneQueryNode;
  @Input() isActive: boolean;
  @Output() nodeEvent = new EventEmitter<GeneQueryNode>();

  nodeConf = [
    {
      id: 'GO',
      displayName: 'GO',
      nodeType: 'ontology',
      ontologyName: 'GO',
    },
    {
      id: 'FYPO',
      displayName: 'phenotype',
      nodeType: 'ontology',
      ontologyName: 'FYPO',
    },
    {
      id: 'PSI-MOD',
      displayName: 'protein modification',
      nodeType: 'ontology',
      ontologyName: 'PSI-MOD',
    },
    {
      id: 'SO-protein',
      displayName: 'protein feature',
      nodeType: 'ontology',
      ontologyName: 'SO-protein',
    },
  ];

  activeNodeConf = null;

  constructor() { }

  ngOnInit() {
  }

  upperCaseIntial(s): string {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  clearQuery(): void {
    this.activeNodeConf = null;
    this.nodeEvent.emit(null);
  }

  clickNode(confId: string) {
    if (!this.activeNodeConf || confId !== this.activeNodeConf.id) {
      for (let conf of this.nodeConf) {
        if (confId === conf.id) {
          this.activeNodeConf = conf;
        }
      }
      // clear the current query and results
      this.nodeEvent.emit(null);
    }
  }

  termMatched(term: TermShort) {
    let part = new TermNode(term);
    this.nodeEvent.emit(part);
  }
}
