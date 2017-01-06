import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Rx';

import 'rxjs/add/operator/toPromise';

import { TermShort, GeneSummary, GeneQuery, PomBaseResults,
         QueryResultHeader } from './common/pombase-query';

export class Metadata {
  db_creation_datetime: Date;
  gene_count: number;
  term_count: number;
}

export interface ReferenceShort {
  title: string;
  uniquename: string;
  pubmed_id?: string;
  citation: string;
  journal?: string;
  citation_date_pages?: string;
  authors_abbrev: string;
  publication_year: string;
}

export interface ExpressedAllele {
  allele: AlleleShort;
  allele_uniquename: string;
  expression: string;
}

export interface AlleleShort {
  gene_uniquename?: string;
  gene?: GeneShort;
  uniquename: string;
  name: string;
  allele_type: string;
  description: string;
}

export interface GenotypeShort {
  uniquename: string;
  name: string;
  background: string;
  expressed_alleles: Array<ExpressedAllele>;
}

export interface Annotation {
  descDist: number;
  descRelName: string;
  reference?: ReferenceShort;
  reference_uniquename?: string;
  evidence?: string;
  conditions: Array<TermShort|string>;
  with?: string;
  residue?: string;
  qualifiers: Array<TermShort>;
  gene?: GeneShort;
  gene_uniquename?: string;
  genotype?: GenotypeShort;
  extension: Array<any>;
  is_not: boolean;
}
export interface TermAnnotation {
  term: TermShort,
  annotations: Array<Annotation>,
}
export interface RelAnnotation {
  term: TermShort,
  rel_names: Array<string>,
  annotations: Array<Annotation>,
}

export interface CvAnnotations {
  [type_name: string]: Array<TermAnnotation>;
}

export interface InteractionAnnotation {
  reference: ReferenceShort;
  reference_uniquename: string;
  evidence: string;
  gene: GeneShort;
  gene_uniquename: string;
  interactor: GeneShort;
  interactor_uniquename: string;
}

export interface InteractionAnnotations {
  [type_name: string]: Array<InteractionAnnotation>;
}

export interface OrthologAnnotation {
  reference: ReferenceShort;
  reference_uniquename: string;
  ortholog: GeneShort;
  ortholog_uniquename: string;
}

export interface ParalogAnnotation {
  reference: ReferenceShort;
  reference_uniquename: string;
  paralog: GeneShort;
  paralog_uniquename: string;
}

export interface TargetOfAnnotation {
  ontology_name: string;
  ext_rel_display_name: string;
  reference: ReferenceShort;
  reference_uniquename: string;
  gene: GeneShort;
  gene_uniquename: string;
}

export interface ChromosomeLocation {
  chromosome_name: string;
  start_pos: number;
  end_pos: number;
  strand: string;
}

export class GeneShort {
  uniquename: string;
  name: string;
}

export interface SynonymDetails {
  name: string;
  type: string;
}

export class GeneDetails {
  uniquename: string;
  name: string;
  feature_type: string;
  characterisation_status: string;
  location: ChromosomeLocation;
  cds_location: ChromosomeLocation;
  synonyms: Array<SynonymDetails>;
  cv_annotations: CvAnnotations;
  interaction_annotations: InteractionAnnotations;
  ortholog_annotations: Array<OrthologAnnotation>;
  paralog_annotations: Array<ParalogAnnotation>;
  target_of_annotations: Array<TargetOfAnnotation>;
  references: Array<ReferenceShort>;
}

export class TermDetails {
  definition: string;
  termid: string;
  cv_name: string;
  name: string;
  is_obsolete: false;
  rel_annotations: RelAnnotation;
}

export class ReferenceDetails {
  uniquename: string;
  title: string;
  citation: string;
  authors: string;
  authors_abbrev: string;
  pubmed_publication_date: string;
  publication_year: string;
  cv_annotations: CvAnnotations;
  interaction_annotations: InteractionAnnotations;
  ortholog_annotations: Array<OrthologAnnotation>;
  paralog_annotations: Array<ParalogAnnotation>;
}


function makeResults(resultsObject: any): PomBaseResults {
  let header = new QueryResultHeader(resultsObject.header.names);
  return new PomBaseResults(header, resultsObject.rows);
}

@Injectable()
export class PombaseAPIService {

  private apiUrl = 'http://pombase2.bioinformatics.nz/api/v1/dataset/latest';

  constructor (private http: Http) {}

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }

  processAlleleMap(allelesByUniquename: any, genesByUniquename: any) {
    for (let alleleUniquename of Object.keys(allelesByUniquename)) {
      let allele = allelesByUniquename[alleleUniquename];
      allele.gene = genesByUniquename[allele.gene_uniquename];
    }
  }

  processTermAnnotations(termAnnotations: Array<TermAnnotation>,
                         genesByUniquename: any, allelesByUniquename: any,
                         referencesByUniquename?: any, termsByTermId?: any) {
    for (let termAnnotation of termAnnotations) {
      for (let annotation of termAnnotation.annotations) {
        annotation.gene = genesByUniquename[annotation.gene_uniquename];
        if (referencesByUniquename) {
          annotation.reference = referencesByUniquename[annotation.reference_uniquename];
        }

        if (annotation.conditions) {
          annotation.conditions =
            annotation.conditions.map((termid: string) => termsByTermId[termid] as TermShort);
        }

        if (annotation.extension) {
          annotation.extension.map((extPart) => {
            if (extPart.ext_range.termid) {
              extPart.ext_range.term = termsByTermId[extPart.ext_range.termid];
            } else {
              if (extPart.ext_range.gene_uniquename) {
                extPart.ext_range.gene = genesByUniquename[extPart.ext_range.gene_uniquename];
              }
            }
          });
          if (annotation.genotype) {
            annotation.genotype.expressed_alleles.map((expressed_allele) => {
              expressed_allele.allele = allelesByUniquename[expressed_allele.allele_uniquename];
              expressed_allele.allele.gene =
                genesByUniquename[expressed_allele.allele.gene_uniquename];
            });
          }
        }
      }
    }
  }

  processInteractions(interactions: Array<InteractionAnnotation>,
                      genesByUniquename: any, referencesByUniquename?: any) {
    for (let annotation of interactions) {
      annotation.gene = genesByUniquename[annotation.gene_uniquename];
      annotation.interactor = genesByUniquename[annotation.interactor_uniquename];
      if (referencesByUniquename) {
        annotation.reference = referencesByUniquename[annotation.reference_uniquename];
      }
    }
  }

  processOrthologs(orthologs: Array<OrthologAnnotation>,
                   genesByUniquename: any, referencesByUniquename?: any) {
    for (let annotation of orthologs) {
      annotation.ortholog = genesByUniquename[annotation.ortholog_uniquename];
      if (referencesByUniquename) {
        annotation.reference = referencesByUniquename[annotation.reference_uniquename];
      }
    }
  }

  processParalogs(paralogs: Array<ParalogAnnotation>,
                  genesByUniquename: any, referencesByUniquename?: any) {
    for (let annotation of paralogs) {
      annotation.paralog = genesByUniquename[annotation.paralog_uniquename];
      if (referencesByUniquename) {
        annotation.reference = referencesByUniquename[annotation.reference_uniquename];
      }
    }
  }

  processTargetOf(targetOfAnnotations: Array<TargetOfAnnotation>,
                  genesByUniquename: any, referencesByUniquename: any) {
    for (let annotation of targetOfAnnotations) {
      annotation.gene = genesByUniquename[annotation.gene_uniquename];
      if (annotation.reference_uniquename) {
        annotation.reference = referencesByUniquename[annotation.reference_uniquename];
      }
    }
  }

  processGeneReferences(referencesByUniquename: any) {
    let uniquenameRE = /PMID:(\d+)/i;
    let citationRE = /^(.*?) (\d\d\d\d .*)/i;
    let processOneReference = function(reference: ReferenceShort) {
      let uniquenameMatches = reference.uniquename.match(uniquenameRE);
      if (uniquenameMatches) {
        reference.pubmed_id = uniquenameMatches[1];
      }
      let citationMatches = reference.citation.match(citationRE);
      if (citationMatches) {
        reference.journal = citationMatches[1];
        reference.citation_date_pages = citationMatches[2];
      }
      return reference;
    };

    return Object.keys(referencesByUniquename)
      .map((key) => processOneReference(referencesByUniquename[key]));
  }

  processGeneResponse(response: Response): GeneDetails {
    let json = response.json();

    let genesByUniquename = json.genes_by_uniquename;
    let allelesByUniquename = json.alleles_by_uniquename;
    let referencesByUniquename = json.references_by_uniquename;
    let termsByTermId = json.terms_by_termid;

    this.processAlleleMap(allelesByUniquename, genesByUniquename);

    for (let cvName of Object.keys(json.cv_annotations)) {
      this.processTermAnnotations(json.cv_annotations[cvName], genesByUniquename, allelesByUniquename,
                                  referencesByUniquename, termsByTermId);
    }
    this.processInteractions(json.physical_interactions, genesByUniquename, referencesByUniquename);
    this.processInteractions(json.genetic_interactions, genesByUniquename, referencesByUniquename);
    this.processOrthologs(json.ortholog_annotations, genesByUniquename, referencesByUniquename);
    this.processParalogs(json.paralog_annotations, genesByUniquename, referencesByUniquename);
    this.processTargetOf(json.target_of_annotations, genesByUniquename, referencesByUniquename);

    json.references = this.processGeneReferences(referencesByUniquename);

    return json as GeneDetails;
  }

  getGene(uniquename: string): Promise<GeneDetails> {
    return this.http.get(this.apiUrl + '/data/gene/' + uniquename)
      .toPromise()
      .then(response => this.processGeneResponse(response))
      .catch(this.handleError);
  }

  processTermResponse(response: Response): TermDetails {
    let json = response.json();

    let genesByUniquename = json.genes_by_uniquename;
    let allelesByUniquename = json.alleles_by_uniquename;
    let referencesByUniquename = json.references_by_uniquename;
    let termsByTermId = json.terms_by_termid;

    this.processAlleleMap(allelesByUniquename, genesByUniquename);

    this.processTermAnnotations(json.rel_annotations, genesByUniquename, allelesByUniquename,
                                referencesByUniquename, termsByTermId);

    json.genes = Object.keys(genesByUniquename).map((key) => genesByUniquename[key]);

    return json as TermDetails;
  }

  getTerm(termid: string): Promise<TermDetails> {
    return this.http.get(this.apiUrl + '/data/term/' + termid)
      .toPromise()
      .then(response => this.processTermResponse(response))
      .catch(this.handleError);
  }

  processReferenceResponse(response: Response): ReferenceDetails {
    let json = response.json();

    let genesByUniquename = json.genes_by_uniquename;
    let allelesByUniquename = json.alleles_by_uniquename;
    let referencesByUniquename = json.references_by_uniquename;
    let termsByTermId = json.terms_by_termid;

    this.processAlleleMap(allelesByUniquename, genesByUniquename);

    for (let cvName of Object.keys(json.cv_annotations)) {
      this.processTermAnnotations(json.cv_annotations[cvName], genesByUniquename, allelesByUniquename,
                                  null, termsByTermId);
    }
    this.processInteractions(json.physical_interactions, genesByUniquename);
    this.processInteractions(json.genetic_interactions, genesByUniquename);
    this.processOrthologs(json.ortholog_annotations, genesByUniquename);
    this.processParalogs(json.paralog_annotations, genesByUniquename);

    return json as ReferenceDetails;
  }

  getReference(uniquename: string): Promise<ReferenceDetails> {
    return this.http.get(this.apiUrl + '/data/reference/' + uniquename)
      .toPromise()
      .then(response => this.processReferenceResponse(response))
      .catch(this.handleError);
  }

  getMetadata(): Promise<Metadata> {
    return this.http.get(this.apiUrl + '/data/metadata')
      .toPromise()
      .then(response => response.json() as Metadata)
      .catch(this.handleError);
  }

  getGeneSummaries(): Promise<Array<GeneSummary>> {
    return this.http.get(this.apiUrl + '/data/gene_summaries')
      .toPromise()
      .then(response => response.json() as Array<GeneSummary>)
      .catch(this.handleError);
  }

  getTermByNameFuzzy(cvName: string, queryText: string): Observable<TermShort[]> {
    let url = this.apiUrl + '/search/term/by_name/fuzzy/' + cvName + '/' + queryText;
    return this.http.get(url)
      .map((res: Response) => res.json());
  }

  postQuery(query: GeneQuery): Observable<PomBaseResults> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return this.http.post(this.apiUrl + '/search/qb/execute', query.toJSON(), options)
      .map((res) => { return makeResults(res.json()); });
  }
}
