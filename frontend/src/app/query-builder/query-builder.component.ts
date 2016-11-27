import { Component, OnInit } from '@angular/core';
import { TermShort } from '../pombase-api.service';

@Component({
  selector: 'app-query-builder',
  templateUrl: './query-builder.component.html',
  styleUrls: ['./query-builder.component.css']
})
export class QueryBuilderComponent implements OnInit {
  matchedTerm: TermShort;

  constructor() { }

  ngOnInit() {
  }

  termMatched(term: TermShort) {
    this.matchedTerm = term;
  }
}
