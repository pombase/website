import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable, Subject } from 'rxjs/Rx';
import { GeneQuery, QueryResult } from './pombase-query';
import { getAppConfig, getReleaseConfig } from './config';

function makeResults(resultsObject: any): QueryResult {
  return new QueryResult('OK', resultsObject.rows);
}

const localStorageKey = 'pombase-query-build-history-v1';

@Injectable()
export class QueryService {
  private apiUrl = getReleaseConfig().baseUrl + '/api/v1/dataset/latest';

  private history: Array<GeneQuery> = [];

  private subject: Subject<Array<GeneQuery>> = new Subject();

  constructor(private http: Http) {
    let savedHistoryString = localStorage.getItem(localStorageKey);
    if (savedHistoryString) {
      this.history = JSON.parse(savedHistoryString).map((o) => new GeneQuery(o.constraints));
    }
  }

  private postRaw(query: GeneQuery): Observable<Response> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return this.http.post(this.apiUrl + '/query', query.toJSON(), options);
  }

  postQuery(query: GeneQuery): Observable<QueryResult> {
    return this.postRaw(query)
      .map((res) => { return makeResults(res.json()); });
  }
  postQueryCount(query: GeneQuery): Observable<number> {
    return this.postRaw(query)
      .map((res) => { return res.json().rows.length; });
  }

  postPredefinedQuery(queryName: string): Observable<QueryResult> {
    const query = getAppConfig().getPredefinedQuery(queryName);
    return this.postQuery(query);
  }

  postPredefinedQueryCount(queryName: string): Observable<number> {
    const query = getAppConfig().getPredefinedQuery(queryName);
    return this.postQueryCount(query);
  }

  saveToHistory(query: GeneQuery) {
    this.history.unshift(query);
    this.subject.next(this.history);
    let historyObjects = this.history.map((q) => q.toObject());
    localStorage.setItem(localStorageKey, JSON.stringify(historyObjects));
  }

  getHistory(): Array<GeneQuery> {
    return this.history;
  }

  getHistoryChanges(): Subject<Array<GeneQuery>> {
    return this.subject;
  }

  removeFromHistory(...queries: Array<GeneQuery>) {
    this.history =
      this.history.filter((histQuery: GeneQuery) => {
        return queries.indexOf(histQuery) === -1;
      });
    this.subject.next(this.history);
  }
}
