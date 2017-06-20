import { Component, OnInit } from '@angular/core';
import { GeneQuery, GeneQueryNode, QueryResult } from '../common/pombase-query';
import { PombaseAPIService } from '../pombase-api.service';
import { TimerObservable } from 'rxjs/observable/TimerObservable';

@Component({
  selector: 'app-query-builder',
  templateUrl: './query-builder.component.html',
  styleUrls: ['./query-builder.component.css']
})
export class QueryBuilderComponent implements OnInit {
  query: GeneQuery;
  results: QueryResult = null;
  history = [];
  timerSubscription = null;
  showLoading = false;

  resetQuery() {
    this.query = null;
    this.results = null;
  }

  constructor(private pombaseApiService: PombaseAPIService) {
    this.resetQuery();
  }

  ngOnInit() {

  }

  saveToHistory(query: GeneQuery) {
    this.history.unshift(query);
  }

  doQuery(saveToHistory: boolean) {
    this.results = null;
    this.showLoading = false;
    let timer = TimerObservable.create(400);
    this.timerSubscription = timer.subscribe(t => {
      this.showLoading = true;
    });
    this.pombaseApiService.postQuery(this.query)
      .subscribe((results) => {
        if (saveToHistory) {
          this.saveToHistory(this.query);
        }
        this.results = results;
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

  newNode(part: GeneQueryNode) {
    this.query = new GeneQuery(part);
    this.doQuery(true);
  }
}
