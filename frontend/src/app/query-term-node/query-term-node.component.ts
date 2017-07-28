import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';

import { TermShort, TermNode, TermAlleleSingleOrMulti } from '../pombase-query';
import { QueryNodeConfig } from '../config';

@Component({
  selector: 'app-query-term-node',
  templateUrl: './query-term-node.component.html',
  styleUrls: ['./query-term-node.component.css']
})
export class QueryTermNodeComponent implements OnInit, OnChanges {
  @Input() termNodeConfig: QueryNodeConfig;
  @Input() placeholder: string;
  @Output() newTermNode = new EventEmitter();

  selectedTerm = null;
  isPhenotypeNode = false;
  singleAllele = true;
  multiAllele = false;

  constructor() { }

  singleMultiChange() {
    if (!this.singleAllele) {
      this.multiAllele = true;
    }
    if (!this.multiAllele) {
      this.singleAllele = true;
    }
  }

  termMatched(term: TermShort) {
    this.selectedTerm = term;
  }

  isValid(): boolean {
    return this.selectedTerm != null;
  }

  submit() {
    if (this.selectedTerm) {
      let singleOrMulti =
        this.isPhenotypeNode ?
        (this.singleAllele ?
         (this.multiAllele ? TermAlleleSingleOrMulti.Both : TermAlleleSingleOrMulti.Single) :
         TermAlleleSingleOrMulti.Multi) :
      null;

      this.newTermNode.emit(new TermNode(this.selectedTerm, singleOrMulti));
    }
  }

  ngOnInit() {
  }

  ngOnChanges() {
    this.isPhenotypeNode =
      this.termNodeConfig.annotationFeatureType &&
      this.termNodeConfig.annotationFeatureType === 'genotype';
  }
}
