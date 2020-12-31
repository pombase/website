import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { QueryResult, TermAndName } from '../../pombase-query';

@Component({
  selector: 'app-gene-results',
  templateUrl: './gene-results.component.html',
  styleUrls: ['./gene-results.component.css']
})
export class GeneResultsComponent implements OnInit, OnChanges {
  @Input() mode: string;
  @Input() results: QueryResult;

  description: string = null;

  descriptionParts: Array<({ text?: string; term?: TermAndName; })> = [];
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
      const termidRe = new RegExp('(' + termids.join('|') + ')');

      const descriptionBits = this.description.split(termidRe);
      this.descriptionParts =
        descriptionBits.map(bit => {
          const index = termids.indexOf(bit);
          if (index === -1) {
            return {
              text: bit,
            };
          } else {
            return {
              term: this.termsInQuery[index],
            };
          }
        });
      }
  }
}
