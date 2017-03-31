import { Injectable } from '@angular/core';

import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Rx';

import 'rxjs/add/operator/toPromise';

import { TermShort, GeneSummary, GeneQuery, PomBaseResults,
         QueryResultHeader } from './common/pombase-query';
import { Util } from './util';

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

export interface AlleleMap {
  [uniquename: string]: AlleleShort;
}

export interface GenotypeShort {
  uniquename: string;
  name: string;
  displayNameLong?: string;
  background: string;
  expressed_alleles: Array<ExpressedAllele>;
}

export interface GenotypeMap {
  [uniquename: string]: GenotypeShort;
}

export interface ExtPart {
  rel_type_display_name?: string;
  rel_type_name: string;
  ext_range: any;
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
  genotype_uniquename: string;
  extension: Array<ExtPart>;
}
export interface TermAnnotation {
  term: TermShort;
  is_not: boolean;
  annotations: Array<Annotation>;
  rel_names?: Array<string>;
  interesting_parents?: Array<string>;
}

export type AnnotationTable = Array<TermAnnotation>;

export interface CvAnnotations {
  [type_name: string]: AnnotationTable;
}

export interface TermSummaryRow {
  gene_uniquenames: Array<string>;
  genes: Array<GeneShort>;
  genotype_uniquenames: Array<string>;
  genotypes: Array<GenotypeShort>;
  extension: Array<ExtPart>;
}

export interface TermSummary {
  term: TermShort;
  is_not: boolean;
  rows: Array<TermSummaryRow>;
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
  genotype: GenotypeShort;
  genotype_uniquename: string;
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
  product?: string;
}

export interface GeneMap {
  [uniquename: string]: GeneShort;
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
  physical_interactions: Array<InteractionAnnotation>;
  genetic_interactions: Array<InteractionAnnotation>;
  ortholog_annotations: Array<OrthologAnnotation>;
  paralog_annotations: Array<ParalogAnnotation>;
  target_of_annotations: Array<TargetOfAnnotation>;
  references: Array<ReferenceShort>;
}

export class GenotypeDetails {
  uniquename: string;
  name: string;
  background: string;
  expressed_alleles: Array<ExpressedAllele>;
  synonyms: Array<SynonymDetails>;
  cv_annotations: CvAnnotations;
}

export interface TermAndRelation {
  termid: string;
  term_name: string;
  relation_name: string;
}

export class TermDetails {
  definition: string;
  termid: string;
  cv_name: string;
  direct_ancestors: Array<TermAndRelation>;
  annotation_feature_type: string;
  name: string;
  is_obsolete: false;
  rel_annotations: Array<TermAnnotation>;
  single_allele_genotype_uniquenames: Array<string>;
  single_allele_genotypes: Array<GenotypeShort>;
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

  processAlleleMap(allelesByUniquename: AlleleMap, genesByUniquename: GeneMap) {
    for (let alleleUniquename of Object.keys(allelesByUniquename)) {
      let allele = allelesByUniquename[alleleUniquename];
      allele.gene = genesByUniquename[allele.gene_uniquename];
    }
  }

  processTermSummaries(termSummaries: Array<TermSummary>,
                       genesByUniquename: GeneMap,
                       genotypesByUniquename: GenotypeMap,
                       allelesByUniquename: AlleleMap, termsByTermId: any) {
    for (let termSummary of termSummaries) {
      for (let row of termSummary.rows) {
        if (row.gene_uniquenames) {
          row.genes =
            row.gene_uniquenames.map(gene_uniquename => {
              return genesByUniquename[gene_uniquename];
            });
        } else {
          row.genes = [];
        }
        if (row.extension) {
          row.extension.map((extPart) => {
            if (extPart.ext_range.termid) {
              extPart.ext_range.term = termsByTermId[extPart.ext_range.termid];
            } else {
              if (extPart.ext_range.gene_uniquename) {
                extPart.ext_range.gene = genesByUniquename[extPart.ext_range.gene_uniquename];
              } else {
                if (extPart.ext_range.sumary_gene_uniquenames) {
                  extPart.ext_range.summaryGenes =
                    extPart.ext_range.sumary_gene_uniquenames
                    .map(part => {
                      return part.map(gene_uniquename => {
                        return genesByUniquename[gene_uniquename];
                      })
                    });
                }
              }
            }
          });
        }

        if (genotypesByUniquename && row.genotype_uniquenames) {
          row.genotypes =
            row.genotype_uniquenames.map(genotypeUniquename => {
              let genotype = genotypesByUniquename[genotypeUniquename];
              this.processExpressedAlleles(allelesByUniquename, genesByUniquename, genotype.expressed_alleles);
              genotype.displayNameLong = Util.displayNameLong(genotype);
              return genotype;
            });
        }
      }
    }
  }

  processTermAnnotations(termAnnotations: Array<TermAnnotation>,
                         genesByUniquename: GeneMap, genotypesByUniquename: GenotypeMap,
                         allelesByUniquename: AlleleMap,
                         referencesByUniquename?: any, termsByTermId?: any) {
    for (let termAnnotation of termAnnotations) {
      for (let annotation of termAnnotation.annotations) {
        if (annotation.gene_uniquename) {
          annotation.gene = genesByUniquename[annotation.gene_uniquename];
        }
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
        }
        if (genotypesByUniquename && annotation.genotype_uniquename) {
          annotation.genotype = genotypesByUniquename[annotation.genotype_uniquename];
          if (annotation.genotype) {
            annotation.genotype.expressed_alleles.map((expressed_allele) => {
              expressed_allele.allele = allelesByUniquename[expressed_allele.allele_uniquename];
              expressed_allele.allele.gene =
                genesByUniquename[expressed_allele.allele.gene_uniquename];
            });
            annotation.genotype.displayNameLong = Util.displayNameLong(annotation.genotype);
          }
        }
      }
    }
  }

  processInteractions(interactions: Array<InteractionAnnotation>,
                      genesByUniquename: GeneMap, referencesByUniquename?: any) {
    for (let annotation of interactions) {
      annotation.gene = genesByUniquename[annotation.gene_uniquename];
      annotation.interactor = genesByUniquename[annotation.interactor_uniquename];
      if (referencesByUniquename) {
        annotation.reference = referencesByUniquename[annotation.reference_uniquename];
      }
    }
  }

  processOrthologs(orthologs: Array<OrthologAnnotation>,
                   genesByUniquename: GeneMap, referencesByUniquename?: any) {
    for (let annotation of orthologs) {
      annotation.ortholog = genesByUniquename[annotation.ortholog_uniquename];
      if (referencesByUniquename) {
        annotation.reference = referencesByUniquename[annotation.reference_uniquename];
      }
    }
  }

  processParalogs(paralogs: Array<ParalogAnnotation>,
                  genesByUniquename: GeneMap, referencesByUniquename?: any) {
    for (let annotation of paralogs) {
      annotation.paralog = genesByUniquename[annotation.paralog_uniquename];
      if (referencesByUniquename) {
        annotation.reference = referencesByUniquename[annotation.reference_uniquename];
      }
    }
  }

  processTargetOf(targetOfAnnotations: Array<TargetOfAnnotation>,
                  genesByUniquename: GeneMap, genotypesByUniquename: GenotypeMap,
                  allelesByUniquename: AlleleMap, referencesByUniquename: any) {
    for (let annotation of targetOfAnnotations) {
      if (annotation.gene_uniquename) {
        annotation.gene = genesByUniquename[annotation.gene_uniquename];
      }
      if (annotation.genotype_uniquename) {
        annotation.genotype = genotypesByUniquename[annotation.genotype_uniquename];
        this.processExpressedAlleles(allelesByUniquename, genesByUniquename, annotation.genotype.expressed_alleles);
        annotation.genotype.displayNameLong = Util.displayNameLong(annotation.genotype);
      }
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
      if (reference.citation) {
        let citationMatches = reference.citation.match(citationRE);
        if (citationMatches) {
          reference.journal = citationMatches[1];
          reference.citation_date_pages = citationMatches[2];
        }
      }
      return reference;
    };

    return Object.keys(referencesByUniquename)
      .filter((uniquename) => uniquename.match(/^PMID:/))
      .map((key) => processOneReference(referencesByUniquename[key]));
  }

  processGeneResponse(response: Response): GeneDetails {
    let json = response.json();

    let genesByUniquename = json.genes_by_uniquename;
    let genotypesByUniquename = json.genotypes_by_uniquename;
    let allelesByUniquename = json.alleles_by_uniquename;
    let referencesByUniquename = json.references_by_uniquename;
    let termsByTermId = json.terms_by_termid;

    this.processAlleleMap(allelesByUniquename, genesByUniquename);

    for (let cvName of Object.keys(json.cv_annotations)) {
      this.processTermAnnotations(json.cv_annotations[cvName], genesByUniquename, genotypesByUniquename,
                                  allelesByUniquename, referencesByUniquename, termsByTermId);
    }

    for (let cvName of Object.keys(json.cv_summaries)) {
      this.processTermSummaries(json.cv_summaries[cvName], genesByUniquename, genotypesByUniquename,
                                allelesByUniquename, termsByTermId);
    }

    this.processInteractions(json.physical_interactions, genesByUniquename, referencesByUniquename);
    this.processInteractions(json.genetic_interactions, genesByUniquename, referencesByUniquename);
    this.processOrthologs(json.ortholog_annotations, genesByUniquename, referencesByUniquename);
    this.processParalogs(json.paralog_annotations, genesByUniquename, referencesByUniquename);
    this.processTargetOf(json.target_of_annotations, genesByUniquename, genotypesByUniquename,
                         allelesByUniquename, referencesByUniquename);

    // for displaying the references section on the gene page
    json.references = this.processGeneReferences(referencesByUniquename);

    return json as GeneDetails;
  }

  getGene(uniquename: string): Promise<GeneDetails> {
    return this.http.get(this.apiUrl + '/data/gene/' + uniquename)
      .toPromise()
      .then(response => this.processGeneResponse(response))
      .catch(this.handleError);
  }

  processExpressedAlleles(allelesByUniquename: any, genesByUniquename: any,
                          expressedAlleles: Array<ExpressedAllele>): void {
    expressedAlleles.map((expressed_allele) => {
      expressed_allele.allele = allelesByUniquename[expressed_allele.allele_uniquename];
      expressed_allele.allele.gene =
        genesByUniquename[expressed_allele.allele.gene_uniquename];
    });
  }

  processGenotypeResponse(response: Response): GenotypeDetails {
    let json = response.json();

    let genesByUniquename = json.genes_by_uniquename;
    let genotypesByUniquename = json.genotypes_by_uniquename;
    let allelesByUniquename = json.alleles_by_uniquename;
    let referencesByUniquename = json.references_by_uniquename;
    let termsByTermId = json.terms_by_termid;

    this.processAlleleMap(allelesByUniquename, genesByUniquename);
    this.processExpressedAlleles(allelesByUniquename, genesByUniquename, json.expressed_alleles);

    for (let cvName of Object.keys(json.cv_annotations)) {
      this.processTermAnnotations(json.cv_annotations[cvName], genesByUniquename, genotypesByUniquename,
                                  allelesByUniquename, referencesByUniquename, termsByTermId);
    }

    for (let cvName of Object.keys(json.cv_summaries)) {
      this.processTermSummaries(json.cv_summaries[cvName], genesByUniquename, genotypesByUniquename,
                                allelesByUniquename, termsByTermId);
    }

    return json as GenotypeDetails;
  }

  getGenotype(uniquename: string): Promise<GenotypeDetails> {
    return this.http.get(this.apiUrl + '/data/genotype/' + uniquename)
      .toPromise()
      .then(response => this.processGenotypeResponse(response))
      .catch(this.handleError);
  }

  processTermResponse(response: Response): TermDetails {
    let json = response.json();

    let genesByUniquename = json.genes_by_uniquename;
    let genotypesByUniquename = json.genotypes_by_uniquename;
    let allelesByUniquename = json.alleles_by_uniquename;
    let referencesByUniquename = json.references_by_uniquename;
    let termsByTermId = json.terms_by_termid;

    this.processAlleleMap(allelesByUniquename, genesByUniquename);

    this.processTermAnnotations(json.rel_annotations, genesByUniquename, genotypesByUniquename,
                                allelesByUniquename, referencesByUniquename, termsByTermId);

    this.processTermSummaries(json.rel_summaries, genesByUniquename, genotypesByUniquename,
                              allelesByUniquename, termsByTermId);

    json.single_allele_genotypes = [];

    for (let genotypeUniquename of json.single_allele_genotype_uniquenames) {
      json.single_allele_genotypes.push(genotypesByUniquename[genotypeUniquename]);
    }

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
    let genotypesByUniquename = json.genotypes_by_uniquename;
    let allelesByUniquename = json.alleles_by_uniquename;
    let termsByTermId = json.terms_by_termid;

    this.processAlleleMap(allelesByUniquename, genesByUniquename);

    for (let cvName of Object.keys(json.cv_annotations)) {
      this.processTermAnnotations(json.cv_annotations[cvName], genesByUniquename, genotypesByUniquename,
                                  allelesByUniquename, null, termsByTermId);
    }

    for (let cvName of Object.keys(json.cv_summaries)) {
      this.processTermSummaries(json.cv_summaries[cvName], genesByUniquename, genotypesByUniquename,
                                allelesByUniquename, termsByTermId);
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
