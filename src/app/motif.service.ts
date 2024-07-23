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
  motifSearchAll(scope: string, motif: string, genesWithDetails: number): Observable<MotifSearchResults> {
    motif = motif.trim();
    if (motif.length === 0) {
      return from([]);
    }

    let genesWithDetailsParam = genesWithDetails.toString();

    if (genesWithDetails == -1) {
      genesWithDetailsParam = 'all';
    }

    const url = this.motifSearchUrl + '/' + scope + '/' + encodeURI(motif) +
      '/' + genesWithDetailsParam;
    return this.http.get(url)
     .pipe(map((body: any) => body as MotifSearchResults),
           catchError(_ => of({ status: 'ERROR', peptide_matches: []} as unknown as MotifSearchResults)));
  }

  motifSearchSingleGene(geneUniquename: string, motif: string): Observable<MotifSearchResults> {
    // a bit hacky since the third argunment makes no sense for the single gene call
    return this.motifSearchAll(geneUniquename, motif, -1);
  }
}
