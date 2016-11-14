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

export interface InteractionAnnotation {
  publication: Publication,
  evidence: string,
  gene: GeneShort,
  interactor: GeneShort,
}

export interface InteractionAnnotations {
  [type_name: string]: Array<InteractionAnnotation>
}

export interface OrthologAnnotation {
  publication: Publication,
  ortholog: GeneShort,
}

export interface ParalogAnnotation {
  publication: Publication,
  paralog: GeneShort,
}

export interface ChromosomeLocation {
  chromosome_name: string,
  start_pos: number,
  end_pos: number,
  strand: string,
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

export interface SynonymDetails {
  name: string,
  synonym_type: string,
}

export class GeneDetails {
  uniquename: string;
  name: string;
  feature_type: string;
  characterisation_status: string;
  location: ChromosomeLocation;
  cds_location: ChromosomeLocation;
  synonyms: Array<SynonymDetails>;
  annotations: Annotations;
  interaction_annotations: InteractionAnnotations;
  ortholog_annotations: Array<OrthologAnnotation>;
  paralog_annotations: Array<ParalogAnnotation>;
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
