import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { QueryResult, TermAndName } from '../../pombase-query';
import { Util, TextOrTermId } from '../util';

@Component({
    selector: 'app-gene-results',
    templateUrl: './gene-results.component.html',
    styleUrls: ['./gene-results.component.css'],
    standalone: false
})
export class GeneResultsComponent implements OnInit, OnChanges {
  @Input() mode: string;
  @Input() results: QueryResult;

  description: string;

  descriptionParts: Array<TextOrTermId> = [];
  termsInQuery: Array<TermAndName> = [];

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges() {
    this.description = '';
    this.descriptionParts = [];
    if (this.results) {
      const query = this.results.getQuery();
      this.description = query.getQueryName() || query.toString();

      this.termsInQuery = this.results.getQuery().referencedTerms();
      const termids = this.termsInQuery.map(term => term.termid);

      this.descriptionParts =
        Util.splitDescription(this.description, termids);
    }
  }
}
