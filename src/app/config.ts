import { GeneDetails, ThroughputType } from './pombase-api.service';
import { TermAndName } from './pombase-query';

const goXrfConfigMap = require('./config/go-xrf-abbr-external-links.json');
const docConfig = require('./config/doc-config.json');
const pombaseConfig =  require('../../pombase_v2_config.json');
const jbrowseTracks =  require('../../minimal_jbrowse_track_list.json');

export interface TermPageConfig {
  ancestorRelNames: Array<string>;
}

export interface LinkoutConfig {
  [name: string]: string;
}

export interface SearchBoxConfig {
  suffixes_to_trim: Array<string>;
}

export interface EvidenceConfig {
  [name: string]: {
    long?: string;
    link?: string;
  };
}

export interface ExternalLinks {
  [name: string]: string;
}

export interface ChromosomeConfig {
  long_display_name: string;
  short_display_name: string;
  export_id: string;
  export_file_id: string;
}

export interface QueryNodeTermConfig {
  name: string;
  termid: string;
}

export interface QueryNodeSubsetConfig {
  name: string;
  displayName: string;
}

export interface QueryNodeTopDescriptionPart {
  text?: string;
  link?: {
    link_text: string;
    route: string;
  };
}

export interface QueryNodeConfig {
  id: string;
  topDescription: Array<QueryNodeTopDescriptionPart>;
  displayName: string;
  nodeType: string;
  ontologyName?: string;
  annotationFeatureType?: string;
  subsetPrefix?: string;
  terms?: Array<QueryNodeTermConfig>;
  subsets?: Array<QueryNodeSubsetConfig>;
  placeholder?: string;
  extraResultTableColumns?: Array<string>;
}

export interface QueryBuilderConfig {
  nodeTypes: Array<QueryNodeConfig>;
}

export interface ConfigOrganism {
  taxonid: number;
  genus: string;
  species: string;
  common_name: string;
}

export interface PanelConfig {
  title?: string;
  title_link?: string;
  panel_type: string;
  internalId: number;
  head_image: Array<string>;
  head_image_link: string;
  reference_id?: string;
  link?: string;
  link_label?: string;
  date_added: string;
  show_on_front_page: boolean;
  internalLink?: string;
  externalLink?: string;
}

export interface PredefinedQueryConfig {
  name: string;
  constraints: any;
}

export interface VisColumnAttrValueConfig {
  name: string;
  color: string;
  display_name: string;
  sort_priority: number;
}

export interface VisColumnConfig {
  name: string;
  display_name: string;
  column_type: string;
  attr_values: Array<VisColumnAttrValueConfig>;
  attrValuesMap: Map<string, VisColumnAttrValueConfig>;
}

export interface DocPagesConfig {
  // titles for each path / Markdown file
  [path: string]: string
}

export interface DocumentationConfig {
  pages: DocPagesConfig;
}

export interface GeneResultsVisConfig {
  columns: Array<VisColumnConfig>;
};

export interface GeneResultsConfig {
  sortable_columns: Array<string>;
  visualisation: GeneResultsVisConfig;
  // names of slims that are available from the results pages:
  slim_table_slim_names: Array<string>;
};

export interface SlimConfig {
  slim_display_name: string;
  terms: Array<TermAndName>;
}

export interface JBrowseColumnConfig {
  name: string;
  display_name: string;
  download_link?: boolean;
}

export interface TargetOfConfig {
 ontology_labels: {
    [cv_name: string]: string;
  };
}

export interface AppConfig {
  site_name: string;
  site_description: string;
  load_organism_taxonid: number;
  helpdesk_address: string;
  organisms: Array<ConfigOrganism>;
  ortholog_taxonids: Array<number>;
  targetOfConfig: TargetOfConfig;
  frontPagePanels: Array<PanelConfig>;
  defaultJBrowseTracks: Array<JBrowseTrackInfo>;
  refPageJBrowseColumns: Array<JBrowseColumnConfig>;
  apiSeqChunkSizes: {
    all: Array<number>;
    smallest: number;
    largest: number;
  };
  predefinedQueries: { [key: string]: PredefinedQueryConfig };
  cannedQueryIds: Array<string>;
  cvNameMap: { [cvName: string]: string };
  termPageConfig: TermPageConfig;
  phenotypeIdPrefixes: Array<string>;
  linkoutConfig: LinkoutConfig;
  missingBrowserImages: Array<string>;
  searchBoxCvNames: Array<string>;
  searchBoxConfig: SearchBoxConfig;
  evidenceTypes: EvidenceConfig;
  externalGeneReferences: Array<ExternalGeneReference>;
  externalTermReferences: Array<ExternalTermReference>;
  miscExternalLinks: ExternalLinks;
  slims: { [slimName: string]: SlimConfig };
  chromosomes: {
    [identifier: string]: ChromosomeConfig;
  };
  documentation: DocumentationConfig;

  queryBuilder: QueryBuilderConfig;

  _geneResults: GeneResultsConfig;
  _processedGeneResults: GeneResultsConfig;

  getGeneResultsConfig(): GeneResultsConfig;

  // return true iff the genus and species match the configured organism
  isConfigOrganism(taxon: number): boolean;

  getConfigOrganism(): ConfigOrganism;
  isMultiOrganismMode(): boolean;

  getPredefinedQuery(queryName: string): PredefinedQueryConfig;

  getOrganismByTaxonid(taxonid: number): ConfigOrganism;

  getExternalTermLink(dbName: string, termId: string): { url: string, displayName: string };

  getExternalGeneLink(name: string, geneDetails: GeneDetails): Array<string>;

  getMiscExternalLink(configKey: string, id: string): LinkDisplay;
}

export interface LinkDisplay {
  url: string;
  displayName: string;
}

export interface TermFilterCategory {
  display_name: string;
  // term IDs of the ancestors of the terms in this categories
  ancestors: Array<string>;
}

export interface ExtensionFilterCategory {
  display_name: string;
  // term IDs of the ancestors of the terms in this categories
  ancestors: Array<string>;
}

export interface EvidenceFilterCategory {
  display_name: string;
  evidence_codes: Array<string>;
}

export interface ThroughputFilterCategory {
  throughput_type: ThroughputType,
  display_name: string,
}

export interface FilterConfig {
  filter_name: string;
  display_name: string;
  detailed_view_only: boolean;
  scope: Array<string>;
  term_categories?: Array<TermFilterCategory>;
  evidence_categories?: Array<EvidenceFilterCategory>;
  extension_rel_type_name?: string;
  extension_categories?: Array<ExtensionFilterCategory>;
  throughput_categories?: Array<ThroughputFilterCategory>;
}

export interface SplitByParentsConfig {
  config_name: string;
  termids: Array<string>;
  display_name: string;
  details_link_label?: string;
}

export interface AnnotationExternalLinkConfig {
  display_text: string;
  url_prefix: string;
}

export interface SourceConfig {
  // conditions used restrict when the xref is displayed
  condition?: string;
  // the Chado cvtermprop type name for the ID used for linking
  // if this is set we know that this source can be linked to
  id_prop?: string;
}

export interface AnnotationType {
  feature_type: string;
  display_name: string;
  inherits_from?: string;
  split_by_parents?: Array<SplitByParentsConfig>;
  columns_to_show?: Array<string>;
  details_only?: boolean;
  // if true, don't automatically show a gene page section for this type
  no_gene_details_section?: boolean;
  hide_term_details?: boolean;
  filters?: Array<FilterConfig>;
  external_db_link_keys?: Array<string>;
  external_link_config?: Array<AnnotationExternalLinkConfig>;
  residue_as_extension_part?: boolean;
  slim_subset_name?: string;
  slim_description?: string;
  slim_link?: string;
  slim_no_category_text?: string;
  source_config?: { [source_name: string]: SourceConfig };
  help_route?: string;
  deploy_mode?: string; // display only in this mode, defaults to any mode
}

export interface AnnotationTypes {
  [annotationTypeName: string]: AnnotationType;
}

export interface ExtensionConfig {
}

export interface InteractionDirectionalLabels {
  bait: string;
  prey: string;
}

export interface ExternalGeneReference {
  ref_type: string;
  feature_types: Array<string>;
  name: string;
  description: string;
  field_name: string;
  go_xrf_abbrev?: string;
  url?: string;
  show_in_sections?: Array<string>;
}

export function makeGeneExternalUrl(geneDetails: GeneDetails, extRefConf: ExternalGeneReference): Array<string> {
  let getAllIds = (details: GeneDetails): Array<string> => {
    let ret = [details.uniquename];
    if (details.name) {
      ret.push(details.name);
    }

    for (let synonym of details.synonyms) {
      if (synonym['type'] === 'exact') {
        ret.push(synonym.name);
      }
    }
    return ret;
  };

  let url = extRefConf.url;
  let fieldName = extRefConf.field_name;
  if (url) {
    if (fieldName === 'NCBI_ALL_IDS') {
      return [geneDetails.name || geneDetails.uniquename,
              url.replace(/<<IDENTIFIER>>/, getAllIds(geneDetails).join('+OR+'))];
    } else {
      let fieldValue = (geneDetails as any)[fieldName];
      if (fieldValue) {
        let replacedUrl = url.replace('<<IDENTIFIER>>', fieldValue)
          .replace('<<UNIQUENAME>>', geneDetails.uniquename)
          .replace('<<GENE_NAME>>', geneDetails.name);
        return [fieldValue, replacedUrl];
      }

      return [];
    }
  } else {
    let go_xrf_abbrev = extRefConf.go_xrf_abbrev;
    if (go_xrf_abbrev) {
      let fieldValue = (geneDetails as any)[fieldName];
      if (fieldValue) {
        const xrfDetails = getXrfWithPrefix(go_xrf_abbrev, fieldValue);
        if (xrfDetails) {
          return [fieldValue, xrfDetails.url];
        } else {
          return [];
        }
      }
    }

    return [];
  }
}

export interface ExternalTermReference {
  name: string;
  url?: string; // needed when DB isn't in GO.xrf_abbs
}

export interface AnnotationTableConfig {
  annotationTypeOrder: Array<string>;
  extensions: ExtensionConfig;
  annotationTypes: AnnotationTypes;
  interactionDirectionalLabels: {
    [evidence: string]: InteractionDirectionalLabels,
  };
  getAnnotationType(annotationTypeName: string): AnnotationType;
}

let _config: AnnotationTableConfig = {
  annotationTypes: pombaseConfig.cv_config,
  annotationTypeOrder: pombaseConfig.annotation_type_order,
  extensions: {
  },
  interactionDirectionalLabels: {
    'Co-crystal Structure': {
      bait: 'co-crystallizes with',
      prey: 'co-crystallizes with',
    },
    'Co-fractionation': {
      bait: 'co-fractionates with',
      prey: 'co-fractionates with',
    },
    'Co-localization': {
      bait: 'co-localizes with',
      prey: 'co-localizes with',
    },
    'Co-purification': {
      bait: 'co-purifies with',
      prey: 'co-purifies with',
    },
    'Reconstituted Complex': {
      bait: 'forms complex with',
      prey: 'forms complex with',
    },
    'Affinity Capture-Luminescence': {
      bait: 'affinity captures',
      prey: 'affinity captured by',
    },
    'Affinity Capture-MS': {
      bait: 'affinity captures',
      prey: 'affinity captured by',
    },
    'Affinity Capture-RNA': {
      bait: 'affinity captures',
      prey: 'affinity captured by',
    },
    'Affinity Capture-Western': {
      bait: 'affinity captures',
      prey: 'affinity captured by',
    },
    'Biochemical Activity': {
      bait: 'modifies',
      prey: 'modified by',
    },
    'Far Western': {
      bait: 'captures',
      prey: 'captured by',
    },
    'FRET': {
      bait: 'fluorescence resonance energy donor to',
      prey: 'fluorescence resonance energy acceptor from',
    },
    'PCA': {
      bait: 'interacts with',
      prey: 'interacts with',
    },
    'Protein-peptide': {
      bait: 'binds to peptide derived from',
      prey: 'peptide from this protein binds to',
    },
    'Protein-RNA': {
      bait: 'binds to RNA',
      prey: 'binds to protein',
    },
    'Two-hybrid': {
      bait: 'binds activation domain construct with',
      prey: 'binds DNA-binding domain construct with',
    },
    'Negative Genetic': {
      bait: 'negative genetic interaction with',
      prey: 'negative genetic interaction with',
    },
    'Positive Genetic': {
      bait: 'positive genetic interaction with',
      prey: 'positive genetic interaction with',
    },
    'Synthetic Growth Defect': {
      bait: 'synthetic growth defect with',
      prey: 'synthetic growth defect with',
    },
    'Synthetic Haploinsufficiency': {
      bait: 'synthetic haploinsufficient with',
      prey: 'synthetic haploinsufficient with',
    },
    'Synthetic Lethality': {
      bait: 'synthetic lethal with',
      prey: 'synthetic lethal with',
    },
    'Synthetic Rescue': {
      bait: 'synthetically rescued by',
      prey: 'synthetically rescues',
    },
    'Dosage Growth Defect': {
      bait: 'growth defect in presence of overexpressed',
      prey: 'overexpression causes growth defect to',
    },
    'Dosage Lethality': {
      bait: 'inviable in presence of overexpressed',
      prey: 'overexpression lethal to',
    },
    'Dosage Rescue': {
      bait: 'rescued by overexpression of',
      prey: 'overexpression rescues',
    },
    'Phenotypic Enhancement': {
      bait: 'phenotype enhanced by',
      prey: 'enhances phenotype of',
    },
    'Phenotypic Suppression': {
      bait: 'rescued by',
      prey: 'rescues',
    },
  },
  getAnnotationType:
  function(annotationTypeName: string): AnnotationType {
    return _config.annotationTypes[annotationTypeName] || _config.annotationTypes['_DEFAULT_'];
  },
};

for (let configName of Object.keys(_config.annotationTypes)) {
  let thisConfig = _config.annotationTypes[configName];
  if (thisConfig.inherits_from != null) {
    let parentConfig = _config.annotationTypes[thisConfig.inherits_from];

    if (!parentConfig) {
      throw new Error('No such configuration ' + thisConfig.inherits_from +
                      ' to inherit from in config for: ' + configName);
    }

    let newConfig = {};
    Object.assign(newConfig, parentConfig, thisConfig);
    Object.assign(thisConfig, newConfig);
  }
}

if (pombaseConfig.show_extensions_on_term_pages) {
  let seenNames: { [key: string]: boolean } = {};

  for (let extNameConf of pombaseConfig.extension_display_names) {
    const displayName = extNameConf.display_name;
    const typeName = `extension:${displayName}`;

    if (seenNames[typeName]) {
      continue;
    } else {
      seenNames[typeName] = true;
    }

    _config.annotationTypes[typeName + ':gene'] = {
      'feature_type': 'gene',
      'display_name': displayName,
      'columns_to_show': ['desc-rel', 'gene', 'evidence', 'qualifiers', 'reference', 'count', 'extension']
    };
    _config.annotationTypes[typeName + ':genotype'] = {
      'feature_type': 'genotype',
      'display_name': displayName,
      'columns_to_show': ['desc-rel', 'genotype', 'evidence', 'qualifiers', 'reference', 'count', 'extension']
    };

    _config.annotationTypeOrder.push(typeName + ':gene');
    _config.annotationTypeOrder.push(typeName + ':genotype');
  }
}

function replaceExampleId(urlSyntax: string, idWithPrefix: string) {
  let matches = idWithPrefix.match(/^([^:]+):(.*)/);

  if (matches) {
    let prefix = matches[1];
    let id = matches[2];

    if (urlSyntax.indexOf(prefix + ':[example_id]') === -1) {
      return urlSyntax.replace('[example_id]', idWithPrefix);
    }

    return urlSyntax.replace('[example_id]', id);
  }

  return urlSyntax.replace('[example_id]', idWithPrefix);
}

function processPanelConfigs(configs: Array<PanelConfig>): Array<PanelConfig> {
  let ret = [];

  const urlRe = new RegExp('^\\w+://.*');

  for (let i = 0; i < configs.length; i++) {
    const conf = configs[i];

    let retConfig = Object.assign({}, conf);
    retConfig.internalId = i;

    if (retConfig.reference_id && !retConfig.link) {
      retConfig.link = '/reference/' + retConfig.reference_id;
    }

    if (retConfig.link) {
      if (urlRe.test(retConfig.link)) {
        retConfig.externalLink = retConfig.link;
      } else {
        retConfig.internalLink = retConfig.link;
      }
    }

    ret.push(retConfig);
  }

  return ret;
}

let _organismMap: { [taxonid: number]: ConfigOrganism } = null;

let _appConfig: AppConfig = {
  site_name: pombaseConfig.site_name,
  site_description: pombaseConfig.site_description,
  load_organism_taxonid: pombaseConfig.load_organism_taxonid,
  helpdesk_address: pombaseConfig.helpdesk_address,
  organisms: pombaseConfig.organisms,
  ortholog_taxonids: pombaseConfig.ortholog_taxonids,
  targetOfConfig: pombaseConfig.target_of_config,
  frontPagePanels: processPanelConfigs(pombaseConfig.front_page_panels),
  defaultJBrowseTracks: pombaseConfig.default_jbrowse_tracks,
  refPageJBrowseColumns: pombaseConfig.reference_page_jbrowse_columns,
  apiSeqChunkSizes: {
    all: pombaseConfig.api_seq_chunk_sizes,
    smallest: Math.min(...pombaseConfig.api_seq_chunk_sizes),
    largest: Math.max(...pombaseConfig.api_seq_chunk_sizes)
  },
  predefinedQueries: pombaseConfig.predefined_queries,
  cannedQueryIds: pombaseConfig.canned_query_ids,
  termPageConfig: {
    ancestorRelNames: ['is_a', 'part_of', 'regulates'],
  },
  phenotypeIdPrefixes: pombaseConfig.phenotype_id_prefixes,
  cvNameMap: {
    'GO': '(molecular_function OR biological_process OR cellular_component)',
    'FYPO': 'fission_yeast_phenotype',
    'PSI-MOD': 'PSI-MOD',
    'SO-protein': 'sequence',
  },
  slims: pombaseConfig.slims,

  linkoutConfig: {
    pro: 'http://www.proconsortium.org/cgi-bin/pro/entry_pro?id=',
    pfam: 'http://pfam.xfam.org/family/',
  },

  missingBrowserImages: pombaseConfig.missing_browser_images,

  // limit the search box term autocompletion to these CVs:
  searchBoxCvNames: pombaseConfig.search_box_cv_names,
  searchBoxConfig: pombaseConfig.search_box_config,

  evidenceTypes: pombaseConfig.evidence_types,
  externalGeneReferences: pombaseConfig.external_gene_references,
  externalTermReferences: pombaseConfig.external_term_references,
  miscExternalLinks: pombaseConfig.misc_external_links,
  chromosomes: pombaseConfig.chromosomes,
  documentation: docConfig,

  // query builder node configuration:
  queryBuilder: {
    nodeTypes: [
      {
        id: 'canned_queries',
        displayName: 'Commonly used queries',
        nodeType: 'canned-queries',
        topDescription: [{ text: 'Shortcuts for commonly used queries' }],
      },
      {
        id: 'gene_list',
        displayName: 'Gene IDs',
        nodeType: 'gene-list',
        topDescription: [{ text: 'Enter or upload a list of systematic gene IDs or gene names' }],
      },
      {
        id: 'uniprot_id_list',
        displayName: 'UniProt accessions',
        nodeType: 'gene-list',
        topDescription: [{ text: 'Enter or upload a list of UniProt accession numbers (eg. P04551)' }],
        extraResultTableColumns: ['UniProt ID'],
      },
      {
        id: 'GO',
        displayName: 'GO',
        nodeType: 'ontology',
        ontologyName: 'GO',
        topDescription: [{ text: 'Retrieve genes via annotated Gene Ontology terms that describe the ' +
                           'activity, process, or location of their products (protein or ncRNA)' }],
      },
      {
        id: 'FYPO',
        displayName: 'phenotype',
        nodeType: 'ontology',
        ontologyName: 'FYPO',
        annotationFeatureType: 'genotype',
        topDescription: [{ text: 'Retrieve genes based on phenotypes of mutations annotated using Fission ' +
                           'Yeast Phenotype Ontology (FYPO) terms' }],
      },
      {
        id: 'product_type',
        displayName: 'product type',
        nodeType: 'subset-select',
        subsets: [
          {
            'name': 'feature_type_pseudogene',
            'displayName': 'feature_type:pseudogene',
          },
          {
            'name': 'feature_type_mRNA_gene',
            'displayName': 'feature_type:protein',
          },
          {
            'name': 'feature_type_tRNA_gene',
            'displayName': 'feature_type:tRNA',
          },
          {
            'name': 'feature_type_ncRNA_gene',
            'displayName': 'feature_type:ncRNA',
          },
          {
            'name': 'feature_type_snoRNA_gene',
            'displayName': 'feature_type:snoRNA',
          },
          {
            'name': 'feature_type_snRNA_gene',
            'displayName': 'feature_type:snRNA',
          },
          {
            'name': 'feature_type_rRNA_gene',
            'displayName': 'feature_type:rRNA',
          }
        ],
        topDescription: [{ text: 'Retrieve genes based on product type. Note that "protein" includes ' +
                           'dubious and transposon protein-coding genes; there is a prepared query that excludes ' +
                           'both in the list of commonly used queries' }],
      },
      {
        id: 'PSI-MOD',
        displayName: 'protein modification',
        nodeType: 'ontology',
        ontologyName: 'PSI-MOD',
        placeholder: 'e.g phosphorylated residue (MOD:00696)',
        topDescription: [{ text: 'Retrieve protein-coding genes based on modifications annotated using PSI-MOD ontology terms' }],
      },
      {
        id: 'all_domains',
        displayName: 'protein domain',
        nodeType: 'subset-input',
        subsetPrefix: null,
        placeholder: 'eg. PF02373 or IPR001138',
        topDescription: [{ text: 'Retrieve protein-coding genes by specific domains present in the products. ' +
                           'To retrieve all domain-containing proteins, search for "IPR*" or "PF*"' }],
      },
      {
        id: 'SO_protein',
        displayName: 'protein feature',
        nodeType: 'ontology',
        ontologyName: 'SO-protein',
        topDescription: [{ text: 'Retrieve protein-coding genes based on features annotated using the protein ' +
                           'sequence feature branch of the Sequence Ontology (SO)' }],
      },
      {
        id: 'protein_length',
        displayName: 'protein length',
        nodeType: 'int-range',
        topDescription: [{ text: 'Retrieve protein-coding genes by product length (in amino acids)' }],
      },
      {
        id: 'protein_mol_weight',
        displayName: 'protein mol. weight',
        nodeType: 'float-range',
        topDescription: [{ text: 'Retrieve protein-coding genes by product molecular weight in kDa' }]
      },
      {
        id: 'disease_associated',
        displayName: 'disease',
        nodeType: 'ontology',
        ontologyName: 'disease_ontology',
        topDescription: [{ text: 'Retrieve genes for which the curated human ortholog is associated with a disease. ' +
                           'To find all disease gene orthologs, search for "disease"' }],
      },
      {
        id: 'tm_domain_count',
        displayName: 'Number of TM domains',
        nodeType: 'int-range',
        topDescription: [{ text: 'Retrieve protein-coding genes by number of predicted transmembrane domains in the product' }],
      },
      {
        id: 'genome_range',
        displayName: 'Genome location',
        nodeType: 'genome-range',
        topDescription: [{ text: 'Retrieve genes in a specified region of a chromosome' }],
      },
      {
        id: 'exon_count',
        displayName: 'Number of exons',
        nodeType: 'int-range',
        topDescription: [{ text: 'Retrieve genes by number of exons' }],
      },
      {
        id: 'taxonomic_conservation',
        displayName: 'taxonomic conservation',
        nodeType: 'small-ontology',
        terms: [
          {
            'name': 'Schizosaccharomyces pombe specific',
            'termid': 'PBO:0016878'
          },
          {
            'name': 'Schizosaccharomyces specific',
            'termid': 'PBO:0016885'
          },
          {
            'name': 'conserved in archaea',
            'termid': 'PBO:0011072'
          },
          {
            'name': 'conserved in bacteria',
            'termid': 'PBO:0011067'
          },
          {
            'name': 'conserved in eukaryotes',
            'termid': 'PBO:0011065'
          },
          {
            'name': 'conserved in eukaryotes only',
            'termid': 'PBO:0011071'
          },
          {
            'name': 'conserved in fungi',
            'termid': 'PBO:0011064'
          },
          {
            'name': 'conserved in fungi only',
            'termid': 'PBO:0011063'
          },
          {
            'name': 'conserved in metazoa',
            'termid': 'PBO:0011069'
          },
          {
            'name': 'conserved in vertebrates',
            'termid': 'PBO:0011070'
          },
          {
            'name': 'faster evolving duplicate',
            'termid': 'PBO:0009798'
          },
          {
            'name': 'no apparent S. cerevisiae ortholog',
            'termid': 'PBO:0000055'
          },
          {
            'name': 'orthologs cannot be distinguished',
            'termid': 'PBO:0000110'
          },
          {
            'name': 'predominantly single copy (one to one)',
            'termid': 'PBO:0006222'
          },
        ],
        topDescription: [{ text: 'Retrieve protein-coding genes based on broad categories of taxonomic conservation' }],
      },
      {
        id: 'characterisation_status',
        displayName: 'characterisation status',
        nodeType: 'subset-select',
        subsets: [
          {
            name: 'characterisation_status_published',
            displayName: 'characterisation_status:published',
          },
          {
            name: 'characterisation_status_transposon',
            displayName: 'characterisation_status:transposon',
          },
          {
            name: 'characterisation_status_dubious',
            displayName: 'characterisation_status:dubious',
          },
          {
            name: 'characterisation_status_Schizosaccharomyces_specific_protein_uncharacterized',
            displayName: 'characterisation_status:Schizo. specific protein, uncharacterized',
          },
          {
            name: 'characterisation_status_Schizosaccharomyces_pombe_specific_protein_uncharacterized',
            displayName: 'characterisation_status:S. pombe specific protein, uncharacterized',
          },
          {
            name: 'characterisation_status_biological_role_inferred',
            displayName: 'characterisation_status:biological role inferred',
          },
          {
            name: 'characterisation_status_conserved_unknown',
            displayName: 'characterisation_status:conserved unknown',
          },
        ],
        topDescription: [{ text: 'Retrieve protein-coding genes based on '},
                         {
                           link: {
                             link_text: 'characterisation status',
                             route: '/status/gene-characterisation',
                           },
                         }],
      },
    ],
  },

  _geneResults: pombaseConfig.gene_results,
  _processedGeneResults: null,

  getGeneResultsConfig(): GeneResultsConfig {
    let geneResultsConfig: GeneResultsConfig = this._geneResults;
    if (this._processedGeneResults === null) {
      for (let columnConfig of geneResultsConfig.visualisation.columns) {
        columnConfig.attrValuesMap = new Map();
        let index = 0;
        for (let attrValueConfig of columnConfig.attr_values) {
          if (!attrValueConfig.sort_priority) {
            attrValueConfig.sort_priority = index;
          }
          index++;
          columnConfig.attrValuesMap.set(attrValueConfig.name, attrValueConfig);
        }
      }

      this._processedGeneResults = geneResultsConfig;
    }

    return this._processedGeneResults;
  },

  isConfigOrganism(taxonid: number): boolean {
    return taxonid = this.load_organism_taxonid;
  },

  getConfigOrganism(): ConfigOrganism {
    return this.getOrganismByTaxonid(this.load_organism_taxonid);
  },
  isMultiOrganismMode(): boolean {
    return !this.load_organism_taxonid;
  },

  getOrganismByTaxonid(taxonid: number): ConfigOrganism {
    if (!_organismMap) {
      _organismMap = {};
      this.organisms.map((organism: ConfigOrganism) => {
        _organismMap[organism.taxonid] = organism;
      });
    }

    return _organismMap[taxonid];
  },

  getPredefinedQuery(queryId: string): PredefinedQueryConfig {
    return getAppConfig().predefinedQueries[queryId];
  },

  getExternalTermLink(configKey: string, termId: string): LinkDisplay {
    let confs = this.externalTermReferences;

    for (let conf of confs) {
      if (conf.name === configKey) {
        let matches = termId.match(/^([^:]+):(.*)/);

        if (matches) {
          let url =
            replaceExampleId(conf.url.replace('[conf_db_prefix]', matches[1]), termId);
          return { url: url, displayName: configKey };
        } else {
          return null;
        }
      }
    }

    let xrfDetails = getXrfConfig()[configKey.toLowerCase()];

    if (xrfDetails) {
      return { url: replaceExampleId(xrfDetails.urlSyntax, termId),
               displayName: xrfDetails.displayName };
    }

    let configUrl = this.miscExternalLinks[configKey];
    if (configUrl) {
      return { url: configUrl.replace('<<IDENTIFIER>>', termId),
               displayName: configKey };
    }

    return null;
  },

  getExternalGeneLink(name: string, geneDetails: GeneDetails): Array<string> {
    for (let conf of this.externalGeneReferences) {
      if (conf['name'] === name) {
        return makeGeneExternalUrl(geneDetails, conf);
      }
    }

    return null;
  },

  // get a URL from the misc_external_links configuration and substitute the given ID
  getMiscExternalLink(configKey: string, id: string): LinkDisplay {
    let configUrl = this.miscExternalLinks[configKey];

    if (configUrl) {
      return { url: configUrl.replace('<<IDENTIFIER>>', id),
               displayName: configKey };
    }

    return null;
  },
};

export function getAnnotationTableConfig(): AnnotationTableConfig {
  return _config;
}

export function getAppConfig(): AppConfig {
  return _appConfig;
}

interface XrfConfig {
  displayName: string;
  description: string;
  urlSyntax: string;
  website: string;
  fieldName?: string;
}

type XrfConfigMap = { [key: string]: XrfConfig };

let xrfConfig: { [key: string]: XrfConfig } = null;

// aliases that aren't in GO.xrf_abbs
let xrfConfigAliases = pombaseConfig.extra_database_aliases;

let xrfExtraConfigMap: { [key: string]: XrfConfig } = {
  'MobiDB': {
    displayName: 'MobiDB',
    description: 'MobiDB',
    urlSyntax: 'http://mobidb.bio.unipd.it/entries/[example_id]',
    website: 'http://mobidb.bio.unipd.it',
    fieldName: 'uniquename',
  },
  'HGNC-symbol': {
    displayName: 'HGNC',
    description: 'HGNC',
    urlSyntax: 'http://www.genenames.org/cgi-bin/gene_symbol_report?match=[example_id]',
    website: 'http://www.genenames.org',
    fieldName: 'name',
  },
  'QuickGO': {
    displayName: 'QuickGO',
    description: 'QuickGO',
    urlSyntax: 'http://www.ebi.ac.uk/QuickGO/GTerm?id=[example_id]',
    website: 'http://www.ebi.ac.uk/QuickGO/',
  }
};

export interface XrfDetails {
  displayName: string;
  description: string;
  url: string;
  website: string;
}

function getXrfConfig(): { [key: string]: XrfConfig } {
  if (!xrfConfig) {
    xrfConfig = {} as { [key: string]: XrfConfig };

    for (let key of Object.keys(goXrfConfigMap)) {
      let goXrfDetail = goXrfConfigMap[key];
      xrfConfig[key] = {
        displayName: goXrfDetail.name,
        description: goXrfDetail.description,
        urlSyntax: goXrfDetail.url_syntax,
        website: goXrfDetail.website,
      };
    }

    for (let key of Object.keys(xrfExtraConfigMap)) {
      xrfConfig[key] = xrfExtraConfigMap[key];
    }

    for (let key of Object.keys(xrfConfigAliases)) {
      xrfConfig[key] = xrfConfig[xrfConfigAliases[key]];
    }

    let keys = Object.keys(xrfConfig);

    for (let key of keys) {
      xrfConfig[key.toLowerCase()] = xrfConfig[key];
      xrfConfig[key.toUpperCase()] = xrfConfig[key];
    }
  }

  return xrfConfig;
}

export function getXrfWithPrefix(prefix: string, id: string): XrfDetails {
  let xrfDetail = getXrfConfig()[prefix.toLowerCase()];

  if (xrfDetail) {
    let linkTemplate = xrfDetail.urlSyntax;

    if (linkTemplate) {
      return {
        displayName: xrfDetail.displayName,
        description: xrfDetail.description,
        url: replaceExampleId(linkTemplate, id),
        website: xrfDetail.website,
      };
    }
  }

  return null;
}

export function getXrf(idWithPrefix: string): XrfDetails {
  let matches = idWithPrefix.match(/^([^:]+):(.*)/);

  if (matches) {
    return getXrfWithPrefix(matches[1], matches[2]);
  } else {
    return null;
  }
}

let organismPrefix: { [key: string]: string } = {
  'Homo_sapiens': 'HGNC-symbol',
  'Saccharomyces_cerevisiae': 'SGD',
};

export function getOrganismExternalLink(organismGenus: string, organismSpecies: string, uniquename: string, name: string): string {
  let xrfOrgConfig = getXrfConfig()[organismPrefix[organismGenus + '_' + organismSpecies]];

  if (xrfOrgConfig) {
    let linkTemplate = xrfOrgConfig.urlSyntax;

    if (linkTemplate) {
      if (!xrfOrgConfig.fieldName || xrfOrgConfig.displayName === 'uniquename') {
        return linkTemplate.replace('[example_id]', uniquename);
      } else {
        return linkTemplate.replace('[example_id]', name);
      }
    }
  }

  return null;
}

export interface JBrowseTrackInfo {
  pmed_id: string;
  label:   string;
}

const _jbrowseTracks: Array<JBrowseTrackInfo> = jbrowseTracks;

export function getJBrowseTracksByPMID(pmid: string): Array<JBrowseTrackInfo> {
  pmid = pmid.replace(/^PMID:/, '');
  return  _jbrowseTracks.filter(track => track.pmed_id === pmid);
}
