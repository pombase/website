import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { GeneDetails } from './gene-details/gene-details';

import { Observable } from 'rxjs/Rx';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class PombaseAPIService {
  constructor (private http: Http) {}

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }

//    private apiUrl = 'http://localhost:4200/api/v1/dataset/latest';
  private apiUrl = 'http://pombase2.aska.gen.nz/api/v1/dataset/latest';

  getGene(uniquename: string) : Promise<GeneDetails> {
    return this.http.get(this.apiUrl + '/data/gene/' + uniquename)
      .toPromise()
      .then(response => response.json() as GeneDetails)
      .catch(this.handleError);
  }
}
