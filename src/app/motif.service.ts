import { Injectable } from '@angular/core';

import { Http, Response } from '@angular/http';
import { Observable, throwError, of } from 'rxjs';
import 'rxjs/add/observable/from';

import { getAppConfig } from './config';
import { catchError, map } from 'rxjs/operators';
import { encodeUriFragment } from '@angular/router/src/url_tree';

export interface MotifPeptideMatch {
  start: number;
  end: number;
  match: string;
  before: string;
  after: string;
}

export interface MotifPeptideResult {
  gene_id: string;
  matches: Array<MotifPeptideMatch>;
  match_count: number;
}

export interface MotifSearchResults {
  status: string;
  gene_matches: Array<MotifPeptideResult>;
}

@Injectable({
  providedIn: 'root'
})
export class MotifService {
  private motifSearchUrl = '/api/v1/dataset/latest/motif_search';

  constructor(private http: Http) { }

  // scope: "all" or a gene systematic ID
  motifSearch(scope: string, motif: string): Observable<MotifSearchResults> {
    motif = motif.trim();
    if (motif.length === 0) {
      return Observable.from([]);
    }

    return this.http.get(this.motifSearchUrl + '/' + scope + '/' + encodeURI(motif))
     .pipe(map((res: Response) => res.json()),
           catchError(err => of({ status: 'ERROR', peptide_matches: []})));
  }
}
