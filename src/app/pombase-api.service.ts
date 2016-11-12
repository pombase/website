import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Rx';

import 'rxjs/add/operator/toPromise';

export class Metadata {
  db_creation_datetime: Date;
  gene_count: number;
  term_count: number;
}

export interface TermShort {
  termid: string,
  name: string,
  is_obsolete: boolean,
}

export interface Publication {
  title: string,
  uniquename: string,
  citation: string,
}

export interface Annotation {
  publication: Publication,
  evidence: string,
  term: TermShort,
  gene: GeneShort,
}

export interface Annotations {
  [type_name: string]: Array<Annotation>
}

export class GeneShort {
  uniquename: string;
  name: string;
}

export class GeneSummary {
  uniquename: string;
  name: string;
  synonyms: Array<string>;
}

export class GeneDetails {
  uniquename: string;
  name: string;
  feature_type: string;
  annotations: Annotations;
}

export class TermDetails {
  definition: string;
  termid: string;
  cv_name: string;
  name: string;
  is_obsolete: false;
  annotations: Annotations;
}

@Injectable()
export class PombaseAPIService {
  constructor (private http: Http) {}

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }

  private apiUrl = 'http://pombase2.aska.gen.nz/api/v1/dataset/latest';

  getGene(uniquename: string) : Promise<GeneDetails> {
    return this.http.get(this.apiUrl + '/data/gene/' + uniquename)
      .toPromise()
      .then(response => response.json() as GeneDetails)
      .catch(this.handleError);
  }

  getTerm(termid: string) : Promise<TermDetails> {
    return this.http.get(this.apiUrl + '/data/term/' + termid)
      .toPromise()
      .then(response => response.json() as TermDetails)
      .catch(this.handleError);
  }

  getMetadata() : Promise<Metadata> {
    return this.http.get(this.apiUrl + '/data/metadata')
      .toPromise()
      .then(response => response.json() as Metadata)
      .catch(this.handleError);
  }

  getGeneSummaries() : Promise<Array<GeneSummary>> {
    return this.http.get(this.apiUrl + '/data/gene_summaries')
      .toPromise()
      .then(response => response.json() as Array<GeneSummary>)
      .catch(this.handleError);
  }
}
