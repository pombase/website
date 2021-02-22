import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';

import { TermShort, TermNode, TermAndName } from '../pombase-query';
import { QueryNodeConfig } from '../config';
import { DeployConfigService } from '../deploy-config.service';

@Component({
  selector: 'app-query-term-node',
  templateUrl: './query-term-node.component.html',
  styleUrls: ['./query-term-node.component.css']
})
export class QueryTermNodeComponent implements OnInit, OnChanges {
  @Input() termNodeConfig: QueryNodeConfig;
  @Input() placeholder: string;
  @Output() newTermNode = new EventEmitter();

  selectedTerm?: TermShort;
  isPhenotypeNode = false;
  singleAllele = true;
  multiAllele = false;
  expression?: string;
  phenotypeConditionNamespace?: string;
  phenotypeConditions: Array<TermAndName> = [];
  phenotypeExcludeConditions: Array<TermAndName> = [];
  showConditionSelector = false;
  showExcludeConditionSelector = false;

  constructor(public deployConfigService: DeployConfigService) { }

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

  phenotypeConditionMatched(term: TermShort) {
    this.phenotypeConditions = [term];
  }

  phenotypeExcludeConditionMatched(term: TermShort) {
    this.phenotypeExcludeConditions = [term];
  }

  conditionSelectorChanged(): void {
    if (!this.showConditionSelector) {
      this.phenotypeConditions = [];
    }
  }

  excludeConditionSelectorChanged(): void {
    if (!this.showExcludeConditionSelector) {
      this.phenotypeExcludeConditions = [];
    }
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
      undefined;

      this.newTermNode.emit(new TermNode(undefined, this.selectedTerm.termid, this.selectedTerm.name,
                                         this.selectedTerm.definition, singleOrMulti,
                                         this.expression, this.phenotypeConditions,
                                         this.phenotypeExcludeConditions));
    }
  }

  ngOnInit() {
  }

  ngOnChanges() {
    this.selectedTerm = undefined;
    this.singleAllele = true;
    this.multiAllele = false;
    this.isPhenotypeNode =
      !!this.termNodeConfig.annotationFeatureType &&
      this.termNodeConfig.annotationFeatureType === 'genotype';
    this.phenotypeConditions = [];
    if (this.isPhenotypeNode) {
      this.expression = 'any';
      this.phenotypeConditionNamespace = this.termNodeConfig.phenotypeConditionNamespace;
    } else {
      this.expression = undefined;
      this.phenotypeConditionNamespace = undefined;
    }
  }
}
