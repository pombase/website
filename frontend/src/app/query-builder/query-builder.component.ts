import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { GeneQuery, GeneQueryNode, QueryResult, TermShort, TermNode } from '../pombase-query';
import { QueryService } from '../query.service';
import { TimerObservable } from 'rxjs/observable/TimerObservable';

@Component({
  selector: 'app-query-builder',
  templateUrl: './query-builder.component.html',
  styleUrls: ['./query-builder.component.css']
})
export class QueryBuilderComponent implements OnInit {
  query: GeneQuery;
  results: QueryResult = null;
  resultsDescription = '';
  timerSubscription = null;
  showLoading = false;

  resetQuery() {
    this.query = null;
    this.results = null;
    this.resultsDescription = '';
  }

  constructor(private queryService: QueryService,
              private route: ActivatedRoute,
             ) {
    this.resetQuery();
  }

  ngOnInit() {
    this.route.params.forEach((params: Params) => {
      let fromType = params['type'];
      let termId = params['id'];
      let termName = params['name'];
      if (fromType && termId && termName) {
        this.processFromRoute(fromType, termId, termName);
      };
    });
  }

  processFromRoute(fromType: string, termId: string, termName: string) {
    let newQuery = null;

    if (fromType === 'term_subset') {
      let term = new TermShort(termId, termName, null, [], false);
      let topNode = new TermNode(term);
      newQuery = new GeneQuery(topNode);
    }

    if (newQuery) {
      this.newQuery(newQuery);
    }
  }

  doQuery(saveToHistory: boolean) {
    this.results = null;
    this.showLoading = false;
    let timer = TimerObservable.create(400);
    this.timerSubscription = timer.subscribe(t => {
      this.showLoading = true;
    });
    let queryAsString = this.query.toString();
    if (saveToHistory) {
      this.queryService.saveToHistory(this.query);
    }
    this.queryService.postQuery(this.query)
      .subscribe((results) => {
        this.results = results;
        this.resultsDescription = 'Results for: ' + queryAsString;
        this.timerSubscription.unsubscribe();
        this.showLoading = false;
      });
  }

  newQuery(newQuery: GeneQuery) {
    this.query = newQuery;
    this.doQuery(true);
  }

  gotoQuery(query: GeneQuery) {
    this.query = query;
    this.doQuery(false);
  }

  nodeEvent(part: GeneQueryNode) {
    if (part) {
      this.query = new GeneQuery(part);
      this.doQuery(true);
    } else {
      this.query = null;
      this.results = null;
      this.resultsDescription = '';
    }
  }
}
