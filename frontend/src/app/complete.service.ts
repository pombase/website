import { Injectable } from '@angular/core';

import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { getAppConfig } from './config';

import * as similarity from 'string-similarity'

export class SolrTermSummary {
  constructor(public termid: string, public name: string, public definition: string) {};
}

@Injectable()
export class CompleteService {

  private completeUrl = '/api/v1/dataset/latest/complete';

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

        const resultTerms = terms.map((term) => {
          let synonymMatch = null;
          if (queryText.length >= 2 && term['close_synonyms']) {
            const nameScore = similarity.compareTwoStrings(term.name, queryText);
            for (const syn of term['close_synonyms'] as Array<string>) {
              const synScore = similarity.compareTwoStrings(syn, queryText);
              if (synScore > nameScore) {
                synonymMatch = syn;
                break;
              }
            }
          }
          return {
            matchName: synonymMatch === null ? term['name'] : synonymMatch,
            isSynonymMatch: synonymMatch !== null,
            termid: term['id'],
            name: term['name'],
            definition: term['definition']
          };
        });

        return resultTerms;
      });
  }
}
