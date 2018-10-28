import { Injectable } from '@angular/core';

import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/from';

import { getAppConfig } from './config';

import * as similarity from 'string-similarity'

export class SolrTermSummary {
  constructor(public termid: string, public name: string, public definition: string) {};
}

export class SolrRefSummary {
  constructor(public pubmedid: string, public title: string, public citation: string) {};
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

    return this.http.get(this.completeUrl + '/term/' + serverCvName + '/' + queryText)
      .map((res: Response) => {
        const parsedRes = res.json();
        if (parsedRes['status'] !== 'Ok') {
          return [];
        }

        const terms = parsedRes['matches'];

        const resultTerms = terms.map((term: any) => {
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

  completeRef(queryText: string): Observable<SolrRefSummary[]> {
    queryText = queryText.trim();
    if (queryText.length === 0) {
      return Observable.from([]);
    }

    return this.http.get(this.completeUrl + '/ref/' + queryText)
      .map((res: Response) => {
        const parsedRes = res.json();
        if (parsedRes['status'] !== 'Ok') {
          return [];
        }

        const refs = parsedRes['matches'];

        const resultRefs = refs.map((ref: any) => {
          const bits = [ref.authors_abbrev, ref.citation];

          const authorAndCitation =
            bits.filter(v => !!v).join(' ');

          return {
            pubmedid: ref.id,
            title: ref.title,
            citation: authorAndCitation,
          };
        });

        return resultRefs;
      });
  }
}
