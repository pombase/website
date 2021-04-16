import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';

import { TermShort, TermNode, TermAndName, Ploidiness } from '../pombase-query';
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
  singleLocus = true;
  multiLocus = false;
  haploid = true;
  diploid = false;

  expression?: string;
  phenotypeConditionNamespace?: string;
  phenotypeConditions: Array<TermAndName> = [];
  phenotypeExcludeConditions: Array<TermAndName> = [];
  showConditionSelector = false;
  showExcludeConditionSelector = false;

  constructor(public deployConfigService: DeployConfigService) { }

  singleMultiChange(buttonType: 'single'|'multi') {
    if (buttonType === 'single' && !this.multiLocus) {
      this.multiLocus = true;
    }
    if (buttonType === 'multi' && !this.singleLocus) {
      this.singleLocus = true;
    }

    if (this.multiLocus) {
      this.expression = 'any';
    }
  }

  ploidinessChange(buttonType: 'haploid'|'diploid') {
    if (buttonType === 'haploid' && !this.diploid) {
      this.diploid = true;
    }
    if (buttonType === 'diploid' && !this.haploid) {
      this.haploid = true;
    }

    if (this.diploid) {
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
      let singleOrMulti;
      let ploidiness: Ploidiness|undefined;

      if (this.isPhenotypeNode) {
        if (this.singleLocus) {
          if (this.multiLocus) {
            singleOrMulti = 'both';
          } else {
            singleOrMulti = 'single';
          }
        } else {
          singleOrMulti = 'multi';
        }

        if (this.haploid) {
          if (this.diploid) {
            ploidiness = 'any';
          } else {
            ploidiness = 'haploid';
          }
        } else {
          ploidiness = 'diploid';
        }
      }


      this.newTermNode.emit(new TermNode(undefined, this.selectedTerm.termid, this.selectedTerm.name,
                                         this.selectedTerm.definition, singleOrMulti,
                                         ploidiness,
                                         this.expression, this.phenotypeConditions,
                                         this.phenotypeExcludeConditions));
    }
  }

  ngOnInit() {
  }

  ngOnChanges() {
    this.selectedTerm = undefined;
    this.singleLocus = true;
    this.multiLocus = false;
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
