import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import 'rxjs/add/observable/from';
import { catchError, map } from 'rxjs/operators';

export interface TermMatch {
  id: string;
  cv_name: string;
  name: string;
  hl: TermMatchHightlight;
}

export interface DocMatch {
  id: string;
  heading: string;
  hl: DocMatchHightlight;
}

export interface DocMatchHightlight {
  heading?: Array<string>;
  content?: Array<string>;
}

export interface RefMatch {
  id: string;
  authors_abbrev: string;
  citation: string;
  title: string;
  publication_year: number;
  hl: RefMatchHightlight;
}

export interface RefMatchHightlight {
  citation?: Array<string>;
  title?: Array<string>;
  authors?: Array<string>;
  pubmed_abstract?: Array<string>;
}

export interface TermMatchHightlight {
  name: Array<string>;
}

export interface TermMatch {
  id: string;
  cv_name: string;
  name: string;
  hl: TermMatchHightlight;
}

export interface SolrSearchResults {
  status: string;
  term_matches: Array<TermMatch>;
  ref_matches: Array<RefMatch>;
  doc_matches: Array<DocMatch>;
}


@Injectable({
  providedIn: 'root'
})
export class SolrSearchService {
  private solrSearchUrl = '/api/v1/dataset/latest/search/all';

  constructor(private http: HttpClient) { }


  search(query: string): Observable<SolrSearchResults> {
    query = query.trim();
    if (query.length === 0) {
      return Observable.from([]);
    }

    return this.http.get(this.solrSearchUrl + '/' + encodeURI(query))
      .pipe(map((body: HttpResponse<any>) => body as unknown as SolrSearchResults),
        catchError(err => of({ status: 'ERROR', peptide_matches: [] } as unknown as SolrSearchResults)));
  }
}
