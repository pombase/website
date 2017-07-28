import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

import { TermShort, GeneListNode, TermNode, SubsetNode, IntRangeNode, FloatRangeNode,
         GeneQueryNode, GeneUniquename } from '../pombase-query';

import { getAppConfig, QueryNodeConfig } from '../config';

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
  activeConf: QueryNodeConfig = null;
  selectedTerm = null;
  selectedSubset = null;
  subsetName = '';
  rangeStart: number = null;
  rangeEnd: number = null;

  constructor() { }

  ngOnInit() {
  }

  upperCaseIntial(s): string {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  removePrefix(s: string): string {
    let firstColon = s.indexOf(':');
    return s.slice(firstColon + 1);
  }

  clearQuery(): void {
    this.selectedTerm = null;
    this.selectedSubset = null;
    this.subsetName = '';
    this.rangeStart = null;
    this.rangeEnd = null;
    this.activeConf = null;
    // clear the current query and results
    this.nodeEvent.emit(null);
  }

  clickNode(confId: string) {
    if (!this.activeConf || confId !== this.activeConf.id) {
      this.clearQuery();
      for (let conf of this.nodeTypes) {
        if (confId === conf.id) {
          this.activeConf = conf;
        }
      }
    }
  }

  newTermNode(newNode: TermNode) {
    this.selectedTerm = newNode.getTerm();
    this.nodeEvent.emit(newNode);
  }

  genesFound(genes: Array<GeneUniquename>) {
    let part = new GeneListNode(genes);
    this.nodeEvent.emit(part);
  }

  smallOntologyChange(): void {
    if (this.selectedTerm) {
      let termShort = {
        name: this.selectedTerm.name,
        termid: this.selectedTerm.termid,
        interesting_parents: [],
        is_obsolete: false,
      } as TermShort;
      let part = new TermNode(termShort, null);
      this.nodeEvent.emit(part);
    }
  }

  subsetChange(): void {
    if (this.selectedSubset) {
      let part = new SubsetNode(this.selectedSubset.name, this.selectedSubset.displayName);
      this.nodeEvent.emit(part);
    }
  }

  subsetInputSearch(): void {
    let trimmedSubsetName = this.subsetName.trim();
    if (trimmedSubsetName.length > 0) {
      let longName;
      if (this.activeConf.subsetPrefix) {
        longName = this.activeConf.subsetPrefix + ':' + trimmedSubsetName;
      } else {
        longName = trimmedSubsetName;
      }
      let part = new SubsetNode(longName, longName);
      this.nodeEvent.emit(part);
    }
  }

  validRange(): boolean {
    return (this.rangeStart !== null ||
            this.rangeEnd !== null) &&
      (this.rangeStart === null ||
       this.rangeEnd === null ||
       this.rangeStart <= this.rangeEnd);
  }

  intRangeSearch(): void {
    let part = new IntRangeNode(this.activeConf.id,
                                this.rangeStart, this.rangeEnd);
    this.nodeEvent.emit(part);
  }

  floatRangeSearch(): void {
    let part = new FloatRangeNode(this.activeConf.id,
                                  this.rangeStart, this.rangeEnd);
    this.nodeEvent.emit(part);
  }
}
