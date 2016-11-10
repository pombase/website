import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Rx';

import 'rxjs/add/operator/toPromise';

export interface Term {
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
  term: Term,
}

export interface Annotations {
  [type_name: string]: Array<Annotation>
}

export class GeneDetails {
  uniquename: string;
  name: string;
  annotations: Annotations;
  constructor (geneData: any) {
    this.uniquename = geneData.uniquename;
    this.name = geneData.name;
  }
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
}
