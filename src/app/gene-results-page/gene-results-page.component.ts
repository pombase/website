import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { TimerObservable } from 'rxjs/observable/TimerObservable';
import { Subscription } from 'rxjs';

import { QueryService } from '../query.service';
import { QueryResult, GeneQuery } from '../pombase-query';
import { getAppConfig } from '../config';

@Component({
  selector: 'app-gene-results-page',
  templateUrl: './gene-results-page.component.html',
  styleUrls: ['./gene-results-page.component.css']
})
export class GeneResultsPageComponent implements OnInit, OnDestroy {
  results: QueryResult = null;
  showLoading: boolean = true;
  timerSubscription: Subscription = null;
  mode: string;

  constructor(private queryService: QueryService,
              private router: Router,
              private route: ActivatedRoute) { }

  gotoAdvancedSearch(): void {
    this.router.navigate(['/query/']);
  }

  ngOnInit(): void {
    this.route.params.forEach((params: Params) => {

      this.mode = params['mode'];

      const id: string = params['id'];
      if (id !== undefined) {
        const resultPromise = this.queryService.execById(id);
        this.handleResults(resultPromise);
        return;
      };

      const json: string = params['json'];
      if (json !== undefined) {
        const obj = JSON.parse(json);
        const query = GeneQuery.fromJSONString(obj);
        this.handleQuery(query);
        return;
      };

      const predefinedQueryId = params['predefinedQueryId'];
      if (predefinedQueryId !== undefined) {
        const queryJson = getAppConfig().getPredefinedQuery(predefinedQueryId);
        const query = GeneQuery.fromJSONString(queryJson);
        this.handleQuery(query);
        return;
      }
    });
  }

  private handleQuery(query: GeneQuery) {
    const resultPromise = this.queryService.exec(query);
    this.handleResults(resultPromise);
  }

  private handleResults(resultPromise: Promise<QueryResult>) {
    this.showLoading = false;
    const timer = TimerObservable.create(400);
    this.timerSubscription = timer.subscribe(t => {
      this.showLoading = true;
    });
    resultPromise
      .then(results => {
        this.results = results;
        this.timerSubscription.unsubscribe();
        this.timerSubscription = null;
        this.showLoading = false;
      });
  }

  ngOnDestroy() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }
}
