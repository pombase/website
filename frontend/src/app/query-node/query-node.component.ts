import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

import { TermShort, GeneListNode, TermNode,
         GeneQueryNode, GeneUniquename } from '../pombase-query';

import { getAppConfig } from '../config';

@Component({
  selector: 'app-query-node',
  templateUrl: './query-node.component.html',
  styleUrls: ['./query-node.component.css']
})
export class QueryNodeComponent implements OnInit {
  @Input() node: GeneQueryNode;
  @Input() isActive: boolean;
  @Output() nodeEvent = new EventEmitter<GeneQueryNode>();

  nodeTypes = getAppConfig().queryBuilder.nodeTypes;
  activeNodeConf = null;
  smallOntologyTerms = [];
  selectedSmallOntologyTerm = null;

  constructor() { }

  ngOnInit() {
    console.log(this.nodeTypes);
  }

  upperCaseIntial(s): string {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  clearQuery(): void {
    this.smallOntologyTerms = [];
    this.selectedSmallOntologyTerm = null;
    this.activeNodeConf = null;
    // clear the current query and results
    this.nodeEvent.emit(null);
  }

  clickNode(confId: string) {
    if (!this.activeNodeConf || confId !== this.activeNodeConf.id) {
      this.clearQuery();
      for (let conf of this.nodeTypes) {
        if (confId === conf.id) {
          this.activeNodeConf = conf;
          if (conf.nodeType === 'small-ontology') {
            this.smallOntologyTerms = conf.terms;
          }
        }
      }
    }
  }

  termMatched(term: TermShort) {
    let part = new TermNode(term);
    this.nodeEvent.emit(part);
  }

  genesFound(genes: Array<GeneUniquename>) {
    let part = new GeneListNode(genes);
    this.nodeEvent.emit(part);
  }

  smallOntologyChange(): void {
    if (this.selectedSmallOntologyTerm) {
      let termShort = {
        name: this.selectedSmallOntologyTerm.name,
        termid: this.selectedSmallOntologyTerm.termid,
        interesting_parents: [],
        is_obsolete: false,
      } as TermShort;
      let part = new TermNode(termShort);
      this.nodeEvent.emit(part);
    }
  }
}
