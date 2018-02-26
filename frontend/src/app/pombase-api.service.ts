import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';

import { TermShort } from './pombase-query';
import { Util } from './shared/util';
import { Seq } from './seq';
import { getAppConfig, ConfigOrganism } from './config';

export type GeneSummaryMap = {[uniquename: string]: GeneSummary};
export type ChromosomeShortMap = {[uniquename: string]: ChromosomeShort};

type TermIdTermMap = { [termid: string]: TermShort };

export enum Strand {
  Forward,
  Reverse,
}

export class Metadata {
  db_creation_datetime: Date;
  export_prog_name: string;
  export_prog_version: string;
  gene_count: number;
  term_count: number;
  cv_versions: { [cv_name: string]: string };
}

export class RecentReferences {
  pubmed: Array<ReferenceShort>;
  admin_curated: Array<ReferenceShort>;
  community_curated: Array<ReferenceShort>;
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
  approved_date: string;
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
  reference: string|ReferenceShort;
  evidence?: string;
  conditions: Array<TermShort|string>;
  withs: Array<any>;
  froms: Array<any>;
  residue?: string;
  qualifiers: Array<TermShort>;
  genes: Array<GeneShort>|Array<string>;
  genotype: string|GenotypeShort;
  extension: Array<ExtPart>;
}
export interface TermAnnotation {
  term: TermShort;
  is_not: boolean;
  annotations: Array<Annotation>;
  summary: Array<TermSummaryRow>;
  rel_names?: Array<string>;
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
  gene: GeneShort;
  gene_uniquename: string;
  reference: ReferenceShort;
  reference_uniquename: string;
  ortholog: GeneShort;
  ortholog_uniquename: string;
  ortholog_taxonid: number;
  ortholog_organism: ConfigOrganism;
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
  genes: Array<GeneShort>|Array<string>;
  genotype: GenotypeShort;
  genotype_uniquename: string;
}

export interface ChromosomeShort {
  name: string;
  length: number;
  ena_identifier: string;
}

export interface ChromosomeLocation {
  chromosome_name: string;
  start_pos: number;
  end_pos: number;
  strand: string;
}

export interface IdAndOrganism {
  identifier: string;
  taxonid: number;
}

export interface GeneSummary extends GeneShort {
  uniquename: string;
  name: string;
  taxonid: number;
  product?: string;
  uniprot_identifier?: string;
  synonyms: Array<string>;
  orthologs: Array<IdAndOrganism>;
  location?: ChromosomeLocation;
  feature_type: string;
}

export class GeneShort {
  uniquename: string;
  name: string;
  product?: string;

  // The function is used to trim a GeneSummary to a GeneShort
  static fromGeneShort(geneSummary: GeneShort): GeneShort {
    let ret = {
      uniquename: geneSummary.uniquename,
      name: geneSummary.name
    } as GeneShort;

    if (geneSummary.product) {
      ret.product = geneSummary.product;
    }

    return ret;
  }
}

export interface GeneMap {
  [uniquename: string]: GeneShort;
}

export interface SynonymDetails {
  name: string;
  type: string;
}

export interface ProteinDetails {
  uniquename: string;
  sequence: string;
  molecular_weight: number;
  number_of_residues: number;
  average_residue_weight: number;
  charge_at_ph7: number;
  isoelectric_point: number;
}

export interface FeatureShort {
  feature_type: string;
  uniquename: string;
  location: ChromosomeLocation;
  residues: string;
}

export interface TranscriptDetails {
  uniquename: string;
  parts: Array<FeatureShort>;
  sequence: string;
  transcript_type: string;
  protein?: ProteinDetails;
  cds_location?: ChromosomeLocation;
}

export interface InterProMatchLocation {
  start: number;
  end: number;
  score: number;
}

export interface InterProMatch {
  id: string;
  dbname: string;
  name: string;
  evidence: string;
  interpro_id: string;
  interpro_name: string;
  interpro_type: string;
  locations: Array<InterProMatchLocation>;
}

export interface AnnotationDetailMap {
  [id: number]: Annotation;
}

export class GeneDetails {
  uniquename: string;
  name: string;
  feature_type: string;
  product?: string;
  name_descriptions: Array<string>;
  gene_neighbourhood: Array<GeneShort>;
  taxonid: number;
  transcripts: Array<TranscriptDetails>;
  deletion_viability?: string;
  uniprot_identifier?: string;
  interpro_matches: Array<InterProMatch>;
  tm_domain_coords: Array<Array<number>>;
  orfeome_identifier: string;
  characterisation_status: string;
  location: ChromosomeLocation;
  synonyms: Array<SynonymDetails>;
  cv_annotations: CvAnnotations;
  physical_interactions: Array<InteractionAnnotation>;
  genetic_interactions: Array<InteractionAnnotation>;
  ortholog_annotations: Array<OrthologAnnotation>;
  paralog_annotations: Array<ParalogAnnotation>;
  target_of_annotations: Array<TargetOfAnnotation>;
  references: Array<ReferenceShort>;
  annotation_details: AnnotationDetailMap;
}

export class GenotypeDetails {
  uniquename: string;
  name: string;
  background: string;
  expressed_alleles: Array<ExpressedAllele>;
  synonyms: Array<SynonymDetails>;
  cv_annotations: CvAnnotations;
  annotation_details: AnnotationDetailMap;
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
  cv_annotations: CvAnnotations;
  single_allele_genotype_uniquenames: Array<string>;
  single_allele_genotypes: Array<GenotypeShort>;
  genes_annotated_with: Array<string>;
  annotation_details: AnnotationDetailMap;
}

export class ReferenceDetails {
  uniquename: string;
  title: string;
  citation: string;
  authors: string;
  authors_abbrev: string;
  pubmed_publication_date: string;
  canto_triage_status: string;
  canto_curator_role: string;
  canto_curator_name: string;
  canto_approved_date: string;
  canto_session_submitted_date: string;
  publication_year: string;
  cv_annotations: CvAnnotations;
  physical_interactions: Array<InteractionAnnotation>;
  genetic_interactions: Array<InteractionAnnotation>;
  ortholog_annotations: Array<OrthologAnnotation>;
  paralog_annotations: Array<ParalogAnnotation>;
  annotation_details: AnnotationDetailMap;
}

export interface TermSubsetElement {
  name: string;
  termid: string;
  gene_count: number;
}

export interface TermSubsetDetails {
  name: string;
  total_gene_count: number;
  elements: Array<TermSubsetElement>;
}

export interface TermSubsets {
  [subsetName: string]: TermSubsetDetails;
}

export interface GeneSubsetDetails {
  name: string;
  display_name: string;
  elements: Array<string>|Array<GeneShort>;
}

export interface GeneSubsets {
  [subsetName: string]: GeneSubsetDetails;
}

@Injectable()
export class PombaseAPIService {

  private apiUrl = '/api/v1/dataset/latest';
  private geneSummariesUrl = this.apiUrl + '/data/gene_summaries';
  private chromosomeSummariesUrl = this.apiUrl + '/data/chromosome_summaries';

  private promiseCache: { [name: string]: Promise<any> } = {};
  private resultCache = {};

  chunkPromises: {
    [key: string]: Promise<Seq>;
  } = {};

  startCacheTimeout() {
    setTimeout(() => {
      this.promiseCache = {};
      this.resultCache = {};
      this.startCacheTimeout();
    }, 60000);
  }

  constructor (private http: Http) {
    this.startCacheTimeout();

    setTimeout(() => {
      // pre-fetch the gene summaries
      this.getGeneSummaryMapPromise();
    }, 10);
  }

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

  processTermAnnotations(termAnnotations: Array<TermAnnotation>,
                         genesByUniquename: GeneMap, genotypesByUniquename: GenotypeMap,
                         allelesByUniquename: AlleleMap, annotationDetailsMap: AnnotationDetailMap,
                         referencesByUniquename: any, termsByTermId: TermIdTermMap) {
    for (let termAnnotation of termAnnotations) {
      termAnnotation.annotations =
        (termAnnotation.annotations as any as Array<number>)
        .map(id => { return annotationDetailsMap[id] }) as Array<Annotation>;
      const termId = termAnnotation.term as any as string;
      termAnnotation.term = termsByTermId[termId];
      for (let annotation of termAnnotation.annotations as Array<Annotation>) {
        annotation.genes =
          (annotation.genes as Array<string>).map((gene_uniquename: string) => {
            return genesByUniquename[gene_uniquename];
          }) as Array<GeneShort>;
        if (referencesByUniquename) {
          annotation.reference = referencesByUniquename[annotation.reference as string];
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
        if (genotypesByUniquename && annotation.genotype) {
          annotation.genotype = genotypesByUniquename[annotation.genotype as string];
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

      if (termAnnotation.summary) {

      for (let row of termAnnotation.summary) {
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
                if (extPart.ext_range.summary_gene_uniquenames) {
                  extPart.ext_range.summaryGenes =
                    extPart.ext_range.summary_gene_uniquenames
                    .map(part => {
                      return part.map(gene_uniquename => {
                        return genesByUniquename[gene_uniquename];
                      });
                    });
                } else {
                  if (extPart.ext_range.summary_termids) {
                    extPart.ext_range.summaryTerms =
                      extPart.ext_range.summary_termids
                      .map(termid => {
                        return termsByTermId[termid];
                      });
                  }
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
      annotation.gene = genesByUniquename[annotation.gene_uniquename];
      annotation.ortholog = genesByUniquename[annotation.ortholog_uniquename];
      annotation.ortholog_organism =
        getAppConfig().getOrganismByTaxonid(annotation.ortholog_taxonid);
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
      if (annotation.genes) {
        annotation.genes =
          (annotation.genes as Array<string>).map((gene_uniquename: string) => {
            return genesByUniquename[gene_uniquename] as GeneShort;
          });
      } else {
        annotation.genes = [];
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

    if (json.transcripts) {
      for (let transcript of json.transcripts) {
        transcript.sequence = '';
        for (let part of transcript.parts) {
          if (part.feature_type === 'exon') {
            transcript.sequence += part.residues;
          }
        }
        if (transcript.protein) {
          let proteinSequence = transcript.protein.sequence;
          let proteinSequenceLength = proteinSequence.length;

          if (proteinSequence.endsWith('*')) {
            proteinSequenceLength--;
          }

          transcript.protein.number_of_residues = proteinSequenceLength;
        }
      }
    } else {
      json.transcripts = [];
    }

    let genesByUniquename = json.genes_by_uniquename;
    let genotypesByUniquename = json.genotypes_by_uniquename;
    let allelesByUniquename = json.alleles_by_uniquename;
    let referencesByUniquename = json.references_by_uniquename;
    let termsByTermId = json.terms_by_termid;
    let annotationDetailsMap = json.annotation_details;

    this.processAlleleMap(allelesByUniquename, genesByUniquename);

    for (let cvName of Object.keys(json.cv_annotations)) {
      this.processTermAnnotations(json.cv_annotations[cvName], genesByUniquename, genotypesByUniquename,
                                  allelesByUniquename, annotationDetailsMap,
                                  referencesByUniquename, termsByTermId);
    }

    this.processInteractions(json.physical_interactions, genesByUniquename, referencesByUniquename);
    this.processInteractions(json.genetic_interactions, genesByUniquename, referencesByUniquename);
    this.processOrthologs(json.ortholog_annotations, genesByUniquename, referencesByUniquename);
    this.processParalogs(json.paralog_annotations, genesByUniquename, referencesByUniquename);
    this.processTargetOf(json.target_of_annotations, genesByUniquename, genotypesByUniquename,
                         allelesByUniquename, referencesByUniquename);

    if (!json['interpro_matches']) {
      json['interpro_matches'] = [];
    }

    // for displaying the references section on the gene page
    json.references = this.processGeneReferences(referencesByUniquename);

    return json as GeneDetails;
  }

  getWithRetry(url: string): Observable<Response> {
    return this.http.get(url)
      .retryWhen((errors) => {
        return errors
          .mergeMap((error) =>
                    (error.status === 404) ? Observable.throw(error) : Observable.of(error))
          .delay(10000)
          .take(5);
      })
      .timeout(60000);
  }

  getGene(uniquename: string): Promise<GeneDetails> {
    return this.getWithRetry(this.apiUrl + '/data/gene/' + uniquename)
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
    let annotationDetailsMap = json.annotation_details;

    this.processAlleleMap(allelesByUniquename, genesByUniquename);
    this.processExpressedAlleles(allelesByUniquename, genesByUniquename, json.expressed_alleles);

    for (let cvName of Object.keys(json.cv_annotations)) {
      this.processTermAnnotations(json.cv_annotations[cvName], genesByUniquename, genotypesByUniquename,
                                  allelesByUniquename, annotationDetailsMap,
                                  referencesByUniquename, termsByTermId);
    }

    return json as GenotypeDetails;
  }

  getGenotype(uniquename: string): Promise<GenotypeDetails> {
    return this.getWithRetry(this.apiUrl + '/data/genotype/' + uniquename)
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
    let annotationDetailsMap = json.annotation_details;

    this.processAlleleMap(allelesByUniquename, genesByUniquename);

    for (let cvName of Object.keys(json.cv_annotations)) {
      this.processTermAnnotations(json.cv_annotations[cvName], genesByUniquename, genotypesByUniquename,
                                  allelesByUniquename, annotationDetailsMap,
                                  referencesByUniquename, termsByTermId);
    }

    json.single_allele_genotypes = [];

    for (let genotypeUniquename of json.single_allele_genotype_uniquenames) {
      json.single_allele_genotypes.push(genotypesByUniquename[genotypeUniquename]);
    }

    json.genes = Object.keys(genesByUniquename).map((key) => genesByUniquename[key]);

    return json as TermDetails;
  }

  getTerm(termid: string): Promise<TermDetails> {
    return this.getWithRetry(this.apiUrl + '/data/term/' + termid)
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
    let annotationDetailsMap = json.annotation_details;

    this.processAlleleMap(allelesByUniquename, genesByUniquename);

    for (let cvName of Object.keys(json.cv_annotations)) {
      this.processTermAnnotations(json.cv_annotations[cvName], genesByUniquename, genotypesByUniquename,
                                  allelesByUniquename, annotationDetailsMap,
                                  null, termsByTermId);
    }


    this.processInteractions(json.physical_interactions, genesByUniquename);
    this.processInteractions(json.genetic_interactions, genesByUniquename);
    this.processOrthologs(json.ortholog_annotations, genesByUniquename);
    this.processParalogs(json.paralog_annotations, genesByUniquename);

    return json as ReferenceDetails;
  }

  getReference(uniquename: string): Promise<ReferenceDetails> {
    return this.getWithRetry(this.apiUrl + '/data/reference/' + uniquename)
      .toPromise()
      .then(response => this.processReferenceResponse(response))
      .catch(this.handleError);
  }

  getMetadata(): Promise<Metadata> {
    return this.getWithRetry(this.apiUrl + '/data/metadata')
      .toPromise()
      .then(response => response.json() as Metadata)
      .catch(this.handleError);
  }

  getRecentReferences(): Promise<RecentReferences> {
    return this.getWithRetry(this.apiUrl + '/data/recent_references')
      .toPromise()
      .then(response => response.json() as RecentReferences)
      .catch(this.handleError);
  }

  getGeneSummariesPromise(): Promise<Array<GeneSummary>> {
    if (!this.promiseCache[this.geneSummariesUrl]) {
      this.promiseCache[this.geneSummariesUrl] = this.getWithRetry(this.geneSummariesUrl)
        .toPromise()
        .then(response => {
          this.resultCache[this.geneSummariesUrl] =
            response.json() as Array<GeneSummary>;
          return this.resultCache[this.geneSummariesUrl];
        })
        .catch(this.handleError);
    }
    return this.promiseCache[this.geneSummariesUrl];
  }

  getGeneSummaries(): Array<GeneSummary> {
    return this.resultCache[this.geneSummariesUrl];
  }

  getGeneSummaryMapPromise(): Promise<GeneSummaryMap> {
    if (!this.promiseCache['getGeneSummaryMapPromise']) {
      this.promiseCache['getGeneSummaryMapPromise'] = this.getGeneSummariesPromise()
        .then(geneSummaries => {
          let retMap = {};
          for (let summ of geneSummaries) {
            if (summ.name) {
              retMap[summ.name] = summ;
              retMap[summ.name.toLowerCase()] = summ;
            }
          }
          for (let summ of geneSummaries) {
            retMap[summ.uniquename] = summ;
            retMap[summ.uniquename.toLowerCase()] = summ;
          }
          this.resultCache['getGeneSummaryMap'] = retMap;
          return retMap;
        });
    }
    return this.promiseCache['getGeneSummaryMapPromise'];
  }

  getGeneSummaryMap(): GeneSummaryMap {
    return this.resultCache['getGeneSummaryMap'];
  }

  getChromosomeSummariesPromise(): Promise<Array<ChromosomeShort>> {
    if (!this.promiseCache[this.chromosomeSummariesUrl]) {
      this.promiseCache[this.chromosomeSummariesUrl] =
        this.getWithRetry(this.chromosomeSummariesUrl)
        .toPromise()
        .then(response => {
          this.resultCache[this.chromosomeSummariesUrl] =
            response.json() as Array<ChromosomeShort>;
          return this.resultCache[this.chromosomeSummariesUrl];
        })
        .catch(this.handleError);
    }
    return this.promiseCache[this.chromosomeSummariesUrl];
  }

  getChromosomeSummaries(): Array<ChromosomeShort> {
    return this.resultCache[this.chromosomeSummariesUrl];
  }

  getChromosomeSummaryMapPromise(): Promise<ChromosomeShortMap> {
    if (!this.promiseCache['getChromosomeSummaryMapPromise']) {
      this.promiseCache['getChromosomeSummaryMapPromise'] =
        this.getChromosomeSummariesPromise()
        .then(chromosomeSummaries => {
          let retMap = {};
          for (let summ of chromosomeSummaries) {
            if (summ.name) {
              retMap[summ.name] = summ;
              retMap[summ.name.toLowerCase()] = summ;
            }
          }
          this.resultCache['getChromosomeSummaryMap'] = retMap;
          return retMap;
        });
    }
    return this.promiseCache['getChromosomeSummaryMapPromise'];
  }

  getChromosomeSummaryMap(): ChromosomeShortMap {
    return this.resultCache['getChromosomeSummaryMap'];
  }

  getTermSubsets(): Promise<TermSubsets> {
    return this.getWithRetry(this.apiUrl + '/data/term_subsets')
      .toPromise()
      .then(response => response.json() as TermSubsets)
      .catch(this.handleError);
  }

  addGeneShortToSubset(subsets: GeneSubsets): Promise<GeneSubsets> {
    return this.getGeneSummaryMapPromise()
      .then((geneSummaries) => {
        for (let subsetName of Object.keys(subsets)) {
          let subset = subsets[subsetName];
          subset.elements =
            (subset.elements as Array<string>)
            .map((uniquename) => geneSummaries[uniquename]);
        }
        return subsets;
      });
  }

  getGeneSubsets(): Promise<GeneSubsets> {
    return this.getWithRetry(this.apiUrl + '/data/gene_subsets')
      .toPromise()
      .then(response => response.json() as GeneSubsets)
      .then(subset => this.addGeneShortToSubset(subset))
      .catch(this.handleError);
  }

  getChunkPromise(chromosomeName: string, chunkSize: number, chunkId: number): Promise<Seq> {
    let key = chromosomeName + '-' + chunkSize + '-' + chunkId;

    if (this.chunkPromises[key]) {
      return this.chunkPromises[key];
    }

    let chunkPromise =
      this.getWithRetry(this.apiUrl + '/data/chromosome/' + chromosomeName +
                    '/sequence/' + chunkSize + '/chunk_' + chunkId)
      .toPromise()
      .then(response => new Seq(response.text()))
      .catch(this.handleError);
    this.chunkPromises[key] = chunkPromise;
    return chunkPromise;
  }

  async getChrSubSequence(chromosomeName: string, start: number, end: number, strand: Strand): Promise<string> {
    let chromosomesMap = await this.getChromosomeSummaryMapPromise();

    let chunkSizes = getAppConfig().apiSeqChunkSizes;

    if (start < 1) {
      start = 1;
    }
    const chrLength = chromosomesMap[chromosomeName].length;
    if (end > chrLength) {
      end = chrLength;
    }

    if (start > end) {
      return Promise.resolve('');
    }

    let subSeqLength = end - start + 1;

    let chunkSize;

    // use big chunks for big sub sequences
    if (subSeqLength > (chunkSizes.smallest + chunkSizes.largest) / 3) {
      chunkSize = chunkSizes.largest;
    } else {
      chunkSize = chunkSizes.smallest;
    }

    let startChunk = Math.floor((start - 1) / chunkSize);
    let endChunk = Math.floor((end - 1) / chunkSize);

    let promises = [];

    for (let chunkId = startChunk; chunkId < endChunk + 1; chunkId++) {
      promises[chunkId - startChunk] =
        this.getChunkPromise(chromosomeName, chunkSize, chunkId);
    }

    return Promise.all(promises)
      .then(values => {
        let chunksResidues = values.map(seq => seq.residues).join('');

        let startInChunk = start - 1 - startChunk * chunkSize;
        let endInChunk = end - startChunk * chunkSize;

        let retResidues = chunksResidues.slice(startInChunk, endInChunk);
        if (strand === Strand.Reverse) {
          return Util.reverseComplement(retResidues);
        } else {
          return retResidues;
        }
      });
  }

  getReferencesPromise(constraint: string) {
    return this.getWithRetry(this.apiUrl + '/data/community_curated_references')
      .toPromise()
      .then(response => response.json() as Array<ReferenceShort>)
      .catch(this.handleError);
  }

  reportNotFound(path: string) {
    path = path.replace(/^\//, '');
    this.http.get('appreport/notfound/' + path).toPromise()
      .then(() => {}).catch(() => {});
  }
}
