import { Injectable } from '@angular/core';

import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { getAppConfig, getReleaseConfig } from './config';

export class SolrTermSummary {
  constructor(id: string, name: string, definition: string) {};
}

@Injectable()
export class CompleteService {

  private completeUrl = getReleaseConfig().baseUrl + '/api/v1/dataset/latest/complete';

  constructor(private http: Http) { }

  completeTermName(cvName: string, queryText: string): Observable<SolrTermSummary[]> {
    const serverCvName = getAppConfig().cvNameMap[cvName] || cvName;

    queryText = queryText.trim();
    if (queryText.length === 0) {
      return Observable.from([]);
    }

    return this.http.get(this.completeUrl + '/' + serverCvName + '/' + queryText)
      .map((res: Response) => {
        const parsedRes = res.json();
        if (parsedRes['status'] !== 'Ok') {
          return [];
        }

        const terms = parsedRes['matches'];

        return terms.map((term) => {
          return {
            termid: term['id'],
            name: term['name'],
            definition: term['definition']
          };
        });
      });
  }
}
