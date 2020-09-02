import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Subscription, timer } from 'rxjs';
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
  showLoading = true;
  timerSubscription: Subscription = null;
  mode: string;
  err: string = null;

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
    const timer$ = timer(400);
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
    this.timerSubscription = timer$.subscribe(_ => {
      this.showLoading = true;
    });
    this.err = null;
    resultPromise
      .then(results => {
        this.results = results;
        this.timerSubscription.unsubscribe();
        this.timerSubscription = null;
        this.showLoading = false;
      })
      .catch(err => this.err = err);
  }

  ngOnDestroy() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }
}
