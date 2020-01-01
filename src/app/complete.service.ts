import { Injectable } from '@angular/core';

import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/from';

import { getAppConfig } from './config';

// Code from: https://github.com/aceakash/string-similarity
// Copyright (c) 2018 Akash Kurdekar
function compareTwoStrings(first: string, second: string) {
  first = first.replace(/\s+/g, '')
  second = second.replace(/\s+/g, '')

  if (!first.length && !second.length) { return 1; }                   // if both are empty strings
  if (!first.length || !second.length) { return 0; }                   // if only one is empty string
  if (first === second) { return 1; }       							 // identical
  if (first.length === 1 && second.length === 1) { return 0; }         // both are 1-letter strings
  if (first.length < 2 || second.length < 2) { return 0; }			 // if either is a 1-letter string

  let firstBigrams = new Map();
  for (let i = 0; i < first.length - 1; i++) {
    const bigram = first.substr(i, 2);
    const count = firstBigrams.has(bigram)
      ? firstBigrams.get(bigram) + 1
      : 1;

    firstBigrams.set(bigram, count);
  };

  let intersectionSize = 0;
  for (let i = 0; i < second.length - 1; i++) {
    const bigram = second.substr(i, 2);
    const count = firstBigrams.has(bigram)
      ? firstBigrams.get(bigram)
      : 0;

    if (count > 0) {
      firstBigrams.set(bigram, count - 1);
      intersectionSize++;
    }
  }

  return (2.0 * intersectionSize) / (first.length + second.length - 2);
}

export class SolrTermSummary {
  constructor(public termid: string, public name: string, public definition: string) {};
}

export class SolrRefSummary {
  constructor(public pubmedid: string, public title: string, public citation: string) {};
}

@Injectable()
export class CompleteService {

  private completeUrl = '/api/v1/dataset/latest/complete';
  private cleanRE = new RegExp('[/]', 'g');

  constructor(private http: Http) { }

  completeTermName(cvName: string, queryText: string): Observable<SolrTermSummary[]> {
    const serverCvName = getAppConfig().cvNameMap[cvName] || cvName;

    queryText = queryText.trim();
    if (queryText.length === 0) {
      return Observable.from([]);
    }

    queryText = queryText.replace(this.cleanRE, ' ');

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
            const nameScore = compareTwoStrings(term.name, queryText);
            for (const syn of term['close_synonyms'] as Array<string>) {
              const synScore = compareTwoStrings(syn, queryText);
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

    queryText = queryText.replace(this.cleanRE, ' ');

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
