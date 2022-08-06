import { Injectable } from '@angular/core';

import { HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { from } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { HttpRetryService, RetryOptions } from './http-retry.service';
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

export interface SolrTermSummary {
  termid: string;
  name: string;
  cv_name: string;
  definition: string;
  highlighting: { [fieldName: string]: string };
}

type CantoAnnotationStatus =
  'SESSION_CREATED'| 'SESSION_ACCEPTED'| 'CURATION_IN_PROGRESS'| 'CURATION_PAUSED'| 'NEEDS_APPROVAL'| 'APPROVAL_IN_PROGRESS'| 'APPROVED'| 'EXPORTED';

export interface SolrRefSummary {
  pubmedid: string;
  title: string;
  author_and_citation: string;
  citation: string;
  pubmed_abstract: string;
  authors: string;
  authors_abbrev: string;
  pubmed_publication_date: string;
  publication_year: string;
  gene_count: number;
  genotype_count: number;
  annotation_count: number;
  canto_annotation_status: CantoAnnotationStatus;
  canto_curator_name: string;
  canto_curator_role: string;
  highlighting: { [fieldName: string]: string };
}

const retryOptions: RetryOptions = new RetryOptions('json', 600, 4, 3500);

@Injectable()
export class CompleteService {

  private completeUrl = '/api/v1/dataset/latest/complete';
  private cleanRE = new RegExp('[/]', 'g');

  constructor(private httpRetry: HttpRetryService) { }

  completeTermName(cvName: string, queryText: string): Observable<SolrTermSummary[]> {
    const serverCvName = getAppConfig().cvNameMap[cvName] || cvName;

    queryText = queryText.trim();
    if (queryText.length === 0) {
      return from([]);
    }

    queryText = queryText.replace(this.cleanRE, ' ');

    const completeTermUrl = this.completeUrl + '/term/' + serverCvName + '/' + queryText;

    return this.httpRetry.getWithRetry(completeTermUrl, retryOptions)
      .pipe(
        map((body: HttpResponse<any>) => {
        const parsedRes = body as any;
        if (parsedRes['status'] !== 'Ok') {
          return [];
        }

        const terms = parsedRes['matches'];

        const resultTerms: Array<SolrTermSummary> = terms.map((term: any) => {
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
            definition: term['definition'],
            highlighting: term['highlighting'],
          };
        });

        return resultTerms;
      }),
      catchError(e => throwError(() => e)));
  }

  completeRef(queryText: string): Observable<SolrRefSummary[]> {
    queryText = queryText.trim();
    if (queryText.length === 0) {
      return from([]);
    }

    queryText = queryText.replace(this.cleanRE, ' ');

    const completeRefUrl = this.completeUrl + '/ref/' + queryText;

    return this.httpRetry.getWithRetry(completeRefUrl, retryOptions)
      .pipe(
        map((body: HttpResponse<any>) => {
        const parsedRes = body as any;
        if (parsedRes['status'] !== 'Ok') {
          return [];
        }

        const refs = parsedRes['matches'];

        const resultRefs = refs.map((ref: any) => {
          const bits = [ref.authors_abbrev, ref.citation];

          const authorAndCitation =
            bits.filter(v => !!v).join(' ');

          ref['pubmedid'] = ref.id;
          ref['author_and_citation'] = authorAndCitation;

          return ref;
        });

        return resultRefs;
      }));
  }
}
