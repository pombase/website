import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { GeneQuery, QueryResult } from './pombase-query';
import { getReleaseConfig } from './config';

function makeResults(resultsObject: any): QueryResult {
  return new QueryResult('OK', resultsObject.rows);
}

@Injectable()
export class QueryService {
  private apiUrl = getReleaseConfig().baseUrl + '/api/v1/dataset/latest';

  private history: Array<GeneQuery> = [];

  constructor(private http: Http) { }

  postQuery(query: GeneQuery): Observable<QueryResult> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return this.http.post(this.apiUrl + '/query', query.toJSON(), options)
      .map((res) => { return makeResults(res.json()); });
  }

  saveToHistory(query: GeneQuery) {
    this.history.unshift(query);
  }

  getHistory(): Observable<GeneQuery[]> {
    return Observable.of(this.history);
  }
}
