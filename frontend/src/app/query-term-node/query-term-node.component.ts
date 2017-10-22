import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';

import { TermShort, TermNode } from '../pombase-query';
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

  selectedTerm: TermShort = null;
  isPhenotypeNode = false;
  singleAllele = true;
  multiAllele = false;
  expression = null;

  constructor() { }

  singleMultiChange(buttonType: string) {
    if (buttonType === 'single' && !this.multiAllele) {
      this.multiAllele = true;
    }
    if (buttonType === 'multi' && !this.singleAllele) {
      this.singleAllele = true;
    }

    if (this.multiAllele) {
      this.expression = 'any';
    }
  }

  termMatched(term: TermShort) {
    this.selectedTerm = term;
  }

  submitTitle(): string {
    if (this.selectedTerm) {
      return '';
    } else {
      return 'Start typing to select a term';
    }
  }

  isValid(): boolean {
    return this.selectedTerm != null;
  }

  submit() {
    if (this.selectedTerm) {
      let singleOrMulti =
        this.isPhenotypeNode ?
        (this.singleAllele ? (this.multiAllele ? 'both' : 'single') : 'multi') :
      null;

      this.newTermNode.emit(new TermNode(this.selectedTerm.termid, this.selectedTerm.name,
                                         this.selectedTerm.definition, singleOrMulti,
                                         this.expression));
    }
  }

  ngOnInit() {
  }

  ngOnChanges() {
    this.selectedTerm = null;
    this.singleAllele = true;
    this.multiAllele = false;
    this.isPhenotypeNode =
      this.termNodeConfig.annotationFeatureType &&
      this.termNodeConfig.annotationFeatureType === 'genotype';
    if (this.isPhenotypeNode) {
      this.expression = 'any';
    } else {
      this.expression = null;
    }
  }
}
