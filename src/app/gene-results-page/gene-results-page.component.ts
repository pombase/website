import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Subscription, timer } from 'rxjs';
import { QueryService } from '../query.service';
import { QueryResult, GeneQuery } from '../pombase-query';
import { getAppConfig } from '../config';

@Component({
    selector: 'app-gene-results-page',
    templateUrl: './gene-results-page.component.html',
    styleUrls: ['./gene-results-page.component.css'],
    standalone: false
})
export class GeneResultsPageComponent implements OnInit, OnDestroy {
  results: QueryResult;
  showLoading = true;
  timerSubscription?: Subscription;
  mode: string;
  err?: string;

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
        const trimmedId = id.replace(/[\.\s]+$/,'');
        if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(trimmedId)) {
           const resultPromise = this.queryService.execById(trimmedId);
           this.handleResults(resultPromise);
        } else {
          this.err = `can't find query for ID ${trimmedId}`
        }
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

  private handleResults(resultPromise: Promise<QueryResult|string>) {
    this.showLoading = false;
    const timer$ = timer(400);
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
    this.timerSubscription = timer$.subscribe(_ => {
      this.showLoading = true;
    });
    this.err = undefined;
    resultPromise
      .then(results => {
        if (results instanceof QueryResult) {
          this.results = results;
        } else {
          this.err = results;
        }
        if (this.timerSubscription) {
          this.timerSubscription.unsubscribe();
          this.timerSubscription = undefined;
        }
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
