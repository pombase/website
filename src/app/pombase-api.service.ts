import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { TermShort } from './pombase-query';
import { Util } from './shared/util';
import { Seq } from './seq';
import { getAppConfig, ConfigOrganism,
         AnnotationType, getAnnotationTableConfig } from './config';

import { HttpRetryService, RetryOptions } from './http-retry.service';

export type GeneSummaryMap = {[uniquename: string]: GeneSummary};
export type ChromosomeShortMap = {[uniquename: string]: ChromosomeShort};

type TermIdTermMap = { [termid: string]: TermShort };

export enum Strand {
  Forward,
  Reverse,
}

export class Metadata {
  db_creation_datetime: string;
  export_prog_name: string;
  export_prog_version: string;
  gene_count: number;
  term_count: number;
  cv_versions: { [cv_name: string]: string };
}

export interface StatCountsByTaxon {
  genes: number;
  annotations: number;
}

export interface DatabaseStatistics {
  by_taxon: { [taxon_id: number]: StatCountsByTaxon };
  community_pubs_count: number;
  non_community_pubs_count: number;
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
  gene_count?: number;
  genotype_count?: number;
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
  display_uniquename: string;
  name: string;
  displayNameLong?: string;
  background: string;
  expressed_alleles: Array<ExpressedAllele>;
}

export interface GenotypeMap {
  [uniquename: string]: GenotypeShort;
}

export interface ExtRange {
  gene_uniquename?: string;
  gene?: GeneShort;
  promoter_gene_uniquename?: string;
  promoter?: () => { gene: GeneShort };
  summary_gene_uniquenames?: Array<Array<string>>;
  summaryGenes?: Array<Array<GeneShort>>;
  termid?: string;
  term?: TermShort
  summary_termids?: Array<string>;
  summaryTerms?: Array<TermShort>;
  misc?: string;
  domain?: string;
  gene_product?: string;
  summary_residues?: Array<string>;
}

export interface ExtPart {
  rel_type_display_name?: string;
  rel_type_name: string;
  ext_range: ExtRange;
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
  genotype_background?: string;
  extension: Array<ExtPart>;
  throughput?: ThroughputType;
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

export type ThroughputType = 'high'|'low'|'non-experimental'|null;

export interface InteractionAnnotation {
  reference: ReferenceShort;
  reference_uniquename: string;
  evidence: string;
  gene: GeneShort;
  gene_uniquename: string;
  interactor: GeneShort;
  interactor_uniquename: string;
  throughput: ThroughputType;
}

export type InteractionTable = Array<InteractionAnnotation>;

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
  show_in_summary: boolean;
  ontology_name: string;
  ext_rel_display_name: string;
  reference: ReferenceShort;
  reference_uniquename: string;
  gene: GeneShort|string;
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

export interface IdNameAndOrganism {
  identifier: string;
  name: string | null;
  taxonid: number;
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

export class GeneSummary extends GeneShort {
  private static displayFieldGenerators: { [label: string]: (g: GeneSummary) => string } = null;
  private static fieldNames: Array<string> = null;

  uniquename: string;
  name: string;
  taxonid: number;
  organism?: ConfigOrganism;
  product?: string;
  uniprot_identifier?: string;
  synonyms: Array<string>;
  orthologs: Array<IdNameAndOrganism>;
  location?: ChromosomeLocation;
  feature_type: string;

  private static makeFields(): void {
    const geneResultsConfig = getAppConfig().getGeneResultsConfig();
    const fieldNames = geneResultsConfig.gene_summary_field_names;

    const displayFieldGenerators: { [label: string]: (g: GeneSummary) => string } = {
      'uniquename': g => g.uniquename,
      'name': g => g.name || '',
      'synonyms': g => g.synonyms.join(','),
      'product': g => g.product,
      'uniprot_identifier': g => g.uniprot_identifier,
      'feature_type': g => g.displayFeatureType(),
      'start_pos': g => String(g.location.start_pos),
      'end_pos': g => String(g.location.end_pos),
      'chromosome_name': g => {
        const chrName = g.location.chromosome_name;
        const chromosomeConfig = getAppConfig().chromosomes[chrName];
        if (chromosomeConfig && chromosomeConfig.short_display_name) {
          return chromosomeConfig.short_display_name;
        }
        return chrName;
      },
      'strand': g => g.location.strand,
    };

    for (const fieldName of fieldNames) {
      const fieldConfig = geneResultsConfig.field_config[fieldName];

      if (fieldConfig.column_type === 'orthologs') {
        if (fieldName.startsWith('orthologs:')) {
          const orthTaxonId = parseInt(fieldName.substr(10));
          displayFieldGenerators[fieldName] =
            (summary) =>
              summary.orthologs.filter(orth => orth.taxonid === orthTaxonId)
                .map(orth => orth.name || orth.identifier).join(',');
        } else {
          console.error('field config type is "' + fieldName +
            '" but field name doesn\'t start with "orthologs:" for name: "' + fieldName + '"');
        }
      }
    }

    this.displayFieldGenerators = displayFieldGenerators;
  }

  private static getFieldDisplayGenerators(): { [label: string]: (g: GeneSummary) => string } {
    if (!GeneSummary.displayFieldGenerators) {
      GeneSummary.makeFields();
    }
    return GeneSummary.displayFieldGenerators;
  }

  private displayFeatureType(): string {
    if (this.feature_type === 'mRNA gene') {
      return 'protein coding';
    } else {
      return this.feature_type;
    }
  }

  getFieldDisplayValue(fieldName: string): string {
    if (GeneSummary.getFieldDisplayGenerators()[fieldName]) {
      return GeneSummary.getFieldDisplayGenerators()[fieldName](this);
    } else {
      return null;
    }
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
  countLinkTitle: string;
  countLinkUrl: string;
  dbDescription: string;
  dbWebsite: string;
  geneCount: number;
  dbDisplayName: string;
  dbEntryUrl: string;
  interProEntryUrl: string;
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
  displayName: string;
  feature_type: string;
  product?: string;
  name_descriptions: Array<string>;
  gene_neighbourhood: Array<GeneShort>;
  taxonid: number;
  transcripts: Array<TranscriptDetails>;
  deletion_viability?: string;
  uniprot_identifier?: string;
  biogrid_interactor_id?: string;
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
  feature_publications: Array<ReferenceShort>;
}

export class GenotypeDetails {
  display_uniquename: string;
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
  abstract: string;
  authors: string;
  authors_abbrev: string;
  pubmed_publication_date: string;
  doi: string;
  canto_triage_status: string;
  canto_curator_role: string;
  canto_curator_name: string;
  canto_approved_date: string;
  approved_date: string;
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

export interface APIError {
  status: number;
  message: string;
}

@Injectable()
export class PombaseAPIService {
  private apiUrl = '/api/v1/dataset/latest';
  private geneSummariesUrl = this.apiUrl + '/data/gene_summaries';
  private chromosomeSummariesUrl = this.apiUrl + '/data/chromosome_summaries';

  private promiseCache: { [name: string]: Promise<any> } = {};
  private resultCache: any = {};

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

  constructor (private http: HttpClient,
               private httpRetry: HttpRetryService) {
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

  processTermAnnotations(cvName: string, termAnnotations: Array<TermAnnotation>,
                         genesByUniquename: GeneMap, genotypesByUniquename: GenotypeMap,
                         allelesByUniquename: AlleleMap, annotationDetailsMap: AnnotationDetailMap,
                         referencesByUniquename: any, termsByTermId: TermIdTermMap) {
    const annotationTypeConfig: AnnotationType = getAnnotationTableConfig().getAnnotationType(cvName);

    for (let termAnnotation of termAnnotations) {
      termAnnotation.annotations =
        Array.from(new Set(termAnnotation.annotations as any as Array<number>))
        .map(id => { return annotationDetailsMap[id] }) as Array<Annotation>;
      const termId = termAnnotation.term as any as string;
      termAnnotation.term = termsByTermId[termId];
      for (let annotation of termAnnotation.annotations as Array<Annotation>) {
        annotation.genes = genesOfAnnotation(annotation, genesByUniquename);
        if (referencesByUniquename) {
          annotation.reference = referencesByUniquename[annotation.reference as string];
        }

        if (annotation.conditions) {
          annotation.conditions =
            annotation.conditions.map((termid: string) => termsByTermId[termid] as TermShort);
        }

        if (annotation.residue && annotationTypeConfig.residue_as_extension_part) {
          moveResidueToExtension(annotation);
        }

        if (annotation.extension) {
          processExtension(annotation, termsByTermId, genesByUniquename);
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
          row.extension.map((extPart: ExtPart) => {
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
                      return part.map((gene_uniquename: string) => {
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
                  } else {
                    if (extPart.ext_range.promoter_gene_uniquename) {
                      extPart.ext_range.promoter = getPromoterGene(extPart.ext_range, genesByUniquename);
                    } else {
                      if (extPart.ext_range.gene_product) {
                        extPart.ext_range.term = termsByTermId[extPart.ext_range.gene_product];
                      }
                    }
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
      if (annotation.gene) {
        annotation.gene = genesByUniquename[annotation.gene as string] as GeneShort;
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

  processGeneResponse(json: any): GeneDetails {
    json.displayName = json.name || json.uniquename;

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

    for (let fieldName of ['cv_annotations',
                           'genes_by_uniquename', 'genotypes_by_uniquename',
                           'alleles_by_uniquename', 'references_by_uniquename',
                           'terms_by_termid', 'annotation_details']) {
      if (typeof(json[fieldName]) === 'undefined') {
        json[fieldName] = {};
      }
    }

    let genesByUniquename = json.genes_by_uniquename;
    let genotypesByUniquename = json.genotypes_by_uniquename;
    let allelesByUniquename = json.alleles_by_uniquename;
    let referencesByUniquename = json.references_by_uniquename;
    let termsByTermId = json.terms_by_termid;
    let annotationDetailsMap = json.annotation_details;

    this.processAlleleMap(allelesByUniquename, genesByUniquename);

    for (let cvName of Object.keys(json.cv_annotations)) {
      this.processTermAnnotations(cvName, json.cv_annotations[cvName], genesByUniquename, genotypesByUniquename,
                                  allelesByUniquename, annotationDetailsMap,
                                  referencesByUniquename, termsByTermId);
    }

    for (let fieldName of ['physical_interactions', 'genetic_interactions',
                           'ortholog_annotations', 'paralog_annotations',
                           'target_of_annotations', 'synonyms', 'name_descriptions',
                           'interpro_matches']) {
      if (typeof(json[fieldName]) === 'undefined') {
        json[fieldName] = [];
      }
    }

    this.processInteractions(json.physical_interactions, genesByUniquename, referencesByUniquename);
    this.processInteractions(json.genetic_interactions, genesByUniquename, referencesByUniquename);
    this.processOrthologs(json.ortholog_annotations, genesByUniquename, referencesByUniquename);
    this.processParalogs(json.paralog_annotations, genesByUniquename, referencesByUniquename);
    this.processTargetOf(json.target_of_annotations, genesByUniquename, genotypesByUniquename,
                         allelesByUniquename, referencesByUniquename);

    // for displaying the references section on the gene page
    json.references = this.processGeneReferences(referencesByUniquename);

    json.feature_publications =
      (json.feature_publications || []).map((refUniquename: string) => referencesByUniquename[refUniquename]);

    return json as GeneDetails;
  }

  getGene(uniquename: string): Promise<GeneDetails> {
    return this.httpRetry.getWithRetry(this.apiUrl + '/data/gene/' + uniquename)
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

  processGenotypeResponse(json: any): GenotypeDetails {
    let genesByUniquename = json.genes_by_uniquename;
    let genotypesByUniquename = json.genotypes_by_uniquename;
    let allelesByUniquename = json.alleles_by_uniquename;
    let referencesByUniquename = json.references_by_uniquename;
    let termsByTermId = json.terms_by_termid;
    let annotationDetailsMap = json.annotation_details;

    this.processAlleleMap(allelesByUniquename, genesByUniquename);
    this.processExpressedAlleles(allelesByUniquename, genesByUniquename, json.expressed_alleles);

    for (let cvName of Object.keys(json.cv_annotations)) {
      this.processTermAnnotations(cvName, json.cv_annotations[cvName], genesByUniquename, genotypesByUniquename,
                                  allelesByUniquename, annotationDetailsMap,
                                  referencesByUniquename, termsByTermId);
    }

    return json as GenotypeDetails;
  }

  getGenotype(uniquename: string): Promise<GenotypeDetails> {
    return this.httpRetry.getWithRetry(this.apiUrl + '/data/genotype/' + uniquename)
      .toPromise()
      .then(response => this.processGenotypeResponse(response))
      .catch(this.handleError);
  }

  processTermResponse(json: any): TermDetails {
    for (let fieldName of ['cv_annotations',
                           'genes_by_uniquename', 'genotypes_by_uniquename',
                           'alleles_by_uniquename', 'references_by_uniquename',
                           'terms_by_termid', 'annotation_details']) {
      if (typeof(json[fieldName]) === 'undefined') {
        json[fieldName] = {};
      }
    }

    let genesByUniquename = json.genes_by_uniquename;
    let genotypesByUniquename = json.genotypes_by_uniquename;
    let allelesByUniquename = json.alleles_by_uniquename;
    let referencesByUniquename = json.references_by_uniquename;
    let termsByTermId = json.terms_by_termid;
    let annotationDetailsMap = json.annotation_details;


    for (let fieldName of ['interesting_parents', 'subsets',
                           'synonyms', 'genes_annotated_with',
                           'direct_ancestors',
                           'single_allele_genotype_uniquenames']) {
      if (typeof(json[fieldName]) === 'undefined') {
        json[fieldName] = [];
      }
    }

    this.processAlleleMap(allelesByUniquename, genesByUniquename);

    for (let cvName of Object.keys(json.cv_annotations)) {
      this.processTermAnnotations(cvName, json.cv_annotations[cvName], genesByUniquename, genotypesByUniquename,
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
    return this.httpRetry.getWithRetry(this.apiUrl + '/data/term/' + termid)
      .toPromise()
      .then(response => this.processTermResponse(response))
      .catch(this.handleError);
  }

  processReferenceResponse(json: any): ReferenceDetails {
    let genesByUniquename = json.genes_by_uniquename;
    let genotypesByUniquename = json.genotypes_by_uniquename;
    let allelesByUniquename = json.alleles_by_uniquename;
    let termsByTermId = json.terms_by_termid;
    let annotationDetailsMap = json.annotation_details;

    this.processAlleleMap(allelesByUniquename, genesByUniquename);

    for (let cvName of Object.keys(json.cv_annotations)) {
      this.processTermAnnotations(cvName, json.cv_annotations[cvName], genesByUniquename, genotypesByUniquename,
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
    return this.httpRetry.getWithRetry(this.apiUrl + '/data/reference/' + uniquename)
      .toPromise()
      .then(response => this.processReferenceResponse(response))
      .catch(this.handleError);
  }

  getMetadata(): Promise<Metadata> {
    return this.httpRetry.getWithRetry(this.apiUrl + '/data/metadata')
      .toPromise()
      .then(body => body as unknown as Metadata)
      .catch(this.handleError);
  }

  getStatistics(): Promise<DatabaseStatistics> {
    return this.httpRetry.getWithRetry(this.apiUrl + '/data/stats')
      .toPromise()
      .then(body => body as unknown as DatabaseStatistics)
      .catch(this.handleError);
  }

  getRecentReferences(): Promise<RecentReferences> {
    return this.httpRetry.getWithRetry(this.apiUrl + '/data/recent_references')
      .toPromise()
      .then(body => body as unknown as RecentReferences)
      .catch(this.handleError);
  }

  getGeneSummariesPromise(): Promise<Array<GeneSummary>> {
    if (!this.promiseCache[this.geneSummariesUrl]) {
      this.promiseCache[this.geneSummariesUrl] = this.httpRetry.getWithRetry(this.geneSummariesUrl)
        .toPromise()
        .then(body => {
          const result = body as unknown as Array<GeneSummary>;
          result.map(summ => {
            summ.organism = getAppConfig().getOrganismByTaxonid(summ.taxonid);
            summ.synonyms = summ.synonyms || [];
            summ.orthologs = summ.orthologs || [];
          })
          this.resultCache[this.geneSummariesUrl] = result;
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
          let retMap: { [key: string]: GeneSummary } = {};
          for (let summ of geneSummaries) {
            const realSumm = Object.assign(new GeneSummary(), summ);
            if (realSumm.name) {
              retMap[realSumm.name] = realSumm;
              retMap[realSumm.name.toLowerCase()] = realSumm;
            }
            retMap[realSumm.uniquename] = realSumm;
            retMap[realSumm.uniquename.toLowerCase()] = realSumm;
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

  getGeneSummaryUniprotMapPromise(): Promise<GeneSummaryMap> {
    if (!this.promiseCache['getGeneSummaryUniprotMapPromise']) {
      this.promiseCache['getGeneSummaryUniprotMapPromise'] = this.getGeneSummariesPromise()
        .then(geneSummaries => {
          let retMap: { [key: string]: GeneSummary } = {};
          for (let summ of geneSummaries) {
            if (summ.uniprot_identifier) {
              retMap[summ.uniprot_identifier] = summ;
              retMap[summ.uniprot_identifier.toLowerCase()] = summ;
            }
          }
          this.resultCache['getGeneSummaryUniprotMap'] = retMap;
          return retMap;
        });
    }
    return this.promiseCache['getGeneSummaryUniprotMapPromise'];
  }

  getChromosomeSummariesPromise(): Promise<Array<ChromosomeShort>> {
    if (!this.promiseCache[this.chromosomeSummariesUrl]) {
      this.promiseCache[this.chromosomeSummariesUrl] =
        this.httpRetry.getWithRetry(this.chromosomeSummariesUrl)
        .toPromise()
        .then(response => {
          this.resultCache[this.chromosomeSummariesUrl] =
            response as unknown as Array<ChromosomeShort>;
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
          let retMap: { [chrName: string]: ChromosomeShort} = {};
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
    return this.httpRetry.getWithRetry(this.apiUrl + '/data/term_subsets')
      .toPromise()
      .then(body => body as unknown as TermSubsets)
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
    return this.httpRetry.getWithRetry(this.apiUrl + '/data/gene_subsets')
      .toPromise()
      .then(body => body as unknown as GeneSubsets)
      .then(subset => this.addGeneShortToSubset(subset))
      .catch(this.handleError);
  }

  getChunkPromise(chromosomeName: string, chunkSize: number, chunkId: number): Promise<Seq> {
    let key = chromosomeName + '-' + chunkSize + '-' + chunkId;

    if (this.chunkPromises[key]) {
      return this.chunkPromises[key];
    }

    const retryOptions = new RetryOptions('text');
    let chunkPromise =
      this.httpRetry.getWithRetry(this.apiUrl + '/data/chromosome/' + chromosomeName +
                    '/sequence/' + chunkSize + '/chunk_' + chunkId, retryOptions)
      .toPromise()
      .then(body => new Seq(body as unknown as string))
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

    let chunkSize: number;

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
    return this.httpRetry.getWithRetry(this.apiUrl + `/data/${constraint}_curated_references`)
      .toPromise()
      .then(body => body as unknown as Array<ReferenceShort>)
      .catch(this.handleError);
  }

  reportNotFound(path: string) {
    path = path.replace(/^\//, '');
    this.http.get('appreport/notfound/' + path).toPromise()
      .then(() => {}).catch(() => {});
  }
}
function processExtension(annotation: Annotation, termsByTermId: TermIdTermMap, genesByUniquename: GeneMap) {
  annotation.extension.map((extPart) => {
    if (extPart.ext_range.termid) {
      extPart.ext_range.term = termsByTermId[extPart.ext_range.termid];
    } else {
      if (extPart.ext_range.gene_uniquename) {
        extPart.ext_range.gene = genesByUniquename[extPart.ext_range.gene_uniquename];
      } else {
        if (extPart.ext_range.promoter_gene_uniquename) {
          extPart.ext_range.promoter = getPromoterGene(extPart.ext_range, genesByUniquename);
        } else {
          if (extPart.ext_range.gene_product) {
            extPart.ext_range.term = termsByTermId[extPart.ext_range.gene_product];
          }
        }
      }
    }
  });
}

function getPromoterGene(extRange: any, genesByUniquename: GeneMap) {
  return () => {
    return {
      gene: genesByUniquename[extRange.promoter_gene_uniquename],
    };
  };
}

function genesOfAnnotation(annotation: Annotation, genesByUniquename: GeneMap): GeneShort[] | string[] {
  return (annotation.genes as Array<any>).map((geneDetail: any) => {
    if (typeof (geneDetail) === 'string') {
      return genesByUniquename[geneDetail as string];
    } else {
      return geneDetail as GeneShort;
    }
  }) as Array<GeneShort>;
}

function moveResidueToExtension(annotation: Annotation) {
  const residue = annotation.residue;
  delete annotation.residue;

  annotation.extension.push({
    rel_type_display_name: 'modified residue',
    rel_type_name: 'modified_residue',
    ext_range: {
      misc: residue,
    },
  });
}

