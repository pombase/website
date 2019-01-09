import { Injectable } from '@angular/core';

import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/from';

import { getAppConfig } from './config';

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

  constructor(private http: Http) { }

  motifSearch(motif: string): Observable<MotifSearchResults> {
    motif = motif.trim();
    if (motif.length === 0) {
      return Observable.from([]);
    }

    return this.http.get(this.motifSearchUrl + '/' + motif)
      .map((res: Response) => res.json())
  }
}
