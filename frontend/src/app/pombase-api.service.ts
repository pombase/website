import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/toPromise';

import { TermShort, GeneSummary, GeneQuery, PomBaseResults,
         QueryResultHeader } from './common/pombase-query';
import { Util } from './util';
import { Seq } from './seq';
import { getReleaseConfig, getAppConfig } from './config';

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
  with?: string;
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
  chromosome: ChromosomeShort;
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

export interface ProteinDetails {
  uniquename: string;
  sequence: string;
  molecular_weight: number;
  number_of_residues: number;
  average_residue_weight: number;
  charge_at_ph7: number;
  isoelectric_point: number;
  codon_adaptation_index: number;
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
}

export interface Organism {
  genus: string;
  species: string;
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

export class GeneDetails {
  uniquename: string;
  name: string;
  feature_type: string;
  product?: string;
  organism: Organism;
  transcripts: Array<TranscriptDetails>;
  deletion_viability?: string;
  uniprot_identifier?: string;
  interpro_matches: Array<InterProMatch>;
  orfeome_identifier: string;
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
  cv_annotations: CvAnnotations;
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
}

export interface TermSubsetElement {
  name: string;
  termid: string;
  gene_count: number;
}

export interface TermSubsetDetails {
  name: string;
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

function makeResults(resultsObject: any): PomBaseResults {
  let header = new QueryResultHeader(resultsObject.header.names);
  return new PomBaseResults(header, resultsObject.rows);
}

@Injectable()
export class PombaseAPIService {

  private apiUrl = getReleaseConfig().baseUrl + '/api/v1/dataset/latest';

  chunkPromises: {
    [key: string]: Promise<Seq>;
  } = {};

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

  processTermAnnotations(termAnnotations: Array<TermAnnotation>,
                         genesByUniquename: GeneMap, genotypesByUniquename: GenotypeMap,
                         allelesByUniquename: AlleleMap,
                         referencesByUniquename?: any, termsByTermId?: any) {
    for (let termAnnotation of termAnnotations) {
      for (let annotation of termAnnotation.annotations) {
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

    this.processAlleleMap(allelesByUniquename, genesByUniquename);

    for (let cvName of Object.keys(json.cv_annotations)) {
      this.processTermAnnotations(json.cv_annotations[cvName], genesByUniquename, genotypesByUniquename,
                                  allelesByUniquename, referencesByUniquename, termsByTermId);
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

  getWithRetry(url: string): Observable<Response> {
    return this.http.get(url)
      .retryWhen(error => error.delay(5000))
      .timeout(30000);
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

    this.processAlleleMap(allelesByUniquename, genesByUniquename);
    this.processExpressedAlleles(allelesByUniquename, genesByUniquename, json.expressed_alleles);

    for (let cvName of Object.keys(json.cv_annotations)) {
      this.processTermAnnotations(json.cv_annotations[cvName], genesByUniquename, genotypesByUniquename,
                                  allelesByUniquename, referencesByUniquename, termsByTermId);
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

    this.processAlleleMap(allelesByUniquename, genesByUniquename);

    for (let cvName of Object.keys(json.cv_annotations)) {
      this.processTermAnnotations(json.cv_annotations[cvName], genesByUniquename, genotypesByUniquename,
                                  allelesByUniquename, referencesByUniquename, termsByTermId);
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

    this.processAlleleMap(allelesByUniquename, genesByUniquename);

    for (let cvName of Object.keys(json.cv_annotations)) {
      this.processTermAnnotations(json.cv_annotations[cvName], genesByUniquename, genotypesByUniquename,
                                  allelesByUniquename, null, termsByTermId);
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

  getGeneSummaries(): Promise<Array<GeneSummary>> {
    return this.getWithRetry(this.apiUrl + '/data/gene_summaries')
      .toPromise()
      .then(response => response.json() as Array<GeneSummary>)
      .catch(this.handleError);
  }

  getGeneSummariesByUniquename(): Promise<{[uniquename: string]: GeneSummary}> {
    return this.getGeneSummaries()
      .then(geneSummaries => {
        let retMap = {};
        for (let summ of geneSummaries) {
          retMap[summ['uniquename']] = summ;
        }
        return retMap;
      });
  }

  getTermSubsets(): Promise<TermSubsets> {
    return this.getWithRetry(this.apiUrl + '/data/term_subsets')
      .toPromise()
      .then(response => response.json() as TermSubsets)
      .catch(this.handleError);
  }

  addGeneShortToSubset(subsets: GeneSubsets): Promise<GeneSubsets> {
    return this.getGeneSummariesByUniquename()
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

  getChrSubSequence(chromosome: ChromosomeShort, start: number, end: number, strand: Strand): Promise<string> {
    let chunkSizes = getAppConfig().apiSeqChunkSizes;

    if (start < 1) {
      start = 1;
    }
    if (end > chromosome.length) {
      end = chromosome.length;
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
        this.getChunkPromise(chromosome.name, chunkSize, chunkId);
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

  getTermByNameFuzzy(cvName: string, queryText: string): Observable<TermShort[]> {
    let url = this.apiUrl + '/search/term/by_name/fuzzy/' + cvName + '/' + queryText;
    return this.getWithRetry(url)
      .map((res: Response) => res.json());
  }

  postQuery(query: GeneQuery): Observable<PomBaseResults> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return this.http.post(this.apiUrl + '/search/qb/execute', query.toJSON(), options)
      .map((res) => { return makeResults(res.json()); });
  }
}
