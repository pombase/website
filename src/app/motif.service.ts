import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable, of, from } from 'rxjs';

import { catchError, map } from 'rxjs/operators';

export interface MotifPeptideMatch {
  start: number;
  end: number;
  match: string;
  before: string;
  after: string;
}

export interface MotifPeptideResult {
  peptide_id: string;
  matches: Array<MotifPeptideMatch>;
  match_count: number;
}

export interface MotifSearchResults {
  status: string;
  peptide_matches: Array<MotifPeptideResult>;
}

@Injectable({
  providedIn: 'root'
})
export class MotifService {
  private motifSearchUrl = '/api/v1/dataset/latest/motif_search';

  constructor(private http: HttpClient) { }

  // scope: "all" or a gene systematic ID
  motifSearch(scope: string, motif: string): Observable<MotifSearchResults> {
    motif = motif.trim();
    if (motif.length === 0) {
      return from([]);
    }

    return this.http.get(this.motifSearchUrl + '/' + scope + '/' + encodeURI(motif))
     .pipe(map((body: any) => body as MotifSearchResults),
           catchError(_ => of({ status: 'ERROR', peptide_matches: []} as unknown as MotifSearchResults)));
  }
}
