import { Component, OnInit } from '@angular/core';
import { GeneQuery, GeneQueryNode, QueryResult } from '../common/pombase-query';
import { PombaseAPIService } from '../pombase-api.service';
import { Subscription } from 'rxjs';
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

  doQuery(saveToHistory: boolean) {
    this.results = null;
    this.showLoading = false;
    let timer = TimerObservable.create(2000, 1000);
    this.timerSubscription = timer.subscribe(t => {
      this.showLoading = true;
    });
    this.pombaseApiService.postQuery(this.query)
      .subscribe((results) => {
        if (saveToHistory) {
          this.history.push(this.query);
        }
        this.results = results;
        this.timerSubscription.unsubscribe();
        this.showLoading = false;
      });
  }

  selectQuery(query: GeneQuery) {
    this.query = query;
    this.doQuery(false);
  }

  newNode(part: GeneQueryNode) {
    this.query = new GeneQuery(part);
    this.doQuery(true);
  }
}
