import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { GeneQuery, GeneQueryNode, QueryResult, TermNode,
         QueryOutputOptions } from '../pombase-query';
import { QueryService } from '../query.service';
import { TimerObservable } from 'rxjs/observable/TimerObservable';
import { getAppConfig } from '../config';

@Component({
  selector: 'app-query-builder',
  templateUrl: './query-builder.component.html',
  styleUrls: ['./query-builder.component.css']
})
export class QueryBuilderComponent implements OnInit, OnDestroy {
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
      if (params['predefinedQueryName']) {
        const query = getAppConfig().getPredefinedQuery(params['predefinedQueryName']);
        this.newQuery(query);
      } else {
        let fromType = params['type'];
        let termId = params['id'];
        let termName = params['name'];
        if (fromType && termId && termName) {
          this.processFromRoute(fromType, termId, termName);
        };
      }
    });
  }

  processFromRoute(fromType: string, termId: string, termName: string) {
    let newQuery = null;

    if (fromType === 'term_subset') {
      let constraints = new TermNode(termId, termName, null, null, null);
      newQuery = new GeneQuery(constraints);
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
    const outputOptions = new QueryOutputOptions(['gene_uniquename'], 'none');
    this.queryService.postQuery(this.query, outputOptions)
      .subscribe((results) => {
        this.results = results;
        this.resultsDescription = 'Results for: ' + queryAsString;
        this.timerSubscription.unsubscribe();
        this.timerSubscription = null;
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

  ngOnDestroy() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }
}
