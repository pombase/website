import { FeatureType, GeneDetails, ThroughputType } from './pombase-api.service';
import { TermAndName, TermId } from './pombase-query';

import goXrfConfigMap from './config/go-xrf-abbr-external-links.json';
import docConfig from './config/doc-config.json';
import pombaseConfig from '../../main_config.json';
import jbrowseTracks from '../../minimal_jbrowse_track_list.json';
import graphicalAbstractFileNames from './config/graphical_abstract_files.json';


export interface TermPageConfig {
  ancestorRelNames: Array<string>;
}

export interface SearchBoxConfig {
  suffixes_to_trim: Array<string>;
  ortholog_organisms_to_always_show: Array<number>;
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

export interface ProteinFeatureTrack {
  colour: string;
}

export interface ChromosomeConfig {
  name: string;
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

export interface QueryNodeConfigOption {
  display_name: string,
  id: string,
}

export interface QueryNodeConfig {
  id: string;
  topDescription: Array<QueryNodeTopDescriptionPart>;
  extraDescription?: string;
  extraDescription2?: string;
  displayName: string;
  percent_display_name?: string;
  nodeType: 'heading'|'canned-queries'|'int-range'|'float-range'|'gene-list'|'genome-range'|'has-ortholog'|'ontology'|'small-ontology'|'subset-input'|'subset-select'|'sub-nodes';
  level?: number;
  development_mode_only?: boolean;
  range_minimum?: number;
  range_any_and_none?: boolean;
  percent_query_id?: string;
  node_options_title?: string;
  node_options?: Array<QueryNodeConfigOption>;
  subNodes?: Array<QueryNodeConfig>;
  ontologyName?: string;
  annotationFeatureType?: string;
  subsetPrefix?: string;
  terms?: Array<QueryNodeTermConfig>;
  subsets?: Array<QueryNodeSubsetConfig>;
  placeholder?: string;
  extraResultTableColumns?: Array<string>;
  phenotypeConditionNamespace?: string;
}

export interface QueryBuilderConfig {
  node_types: Array<QueryNodeConfig>;
}

export interface ConfigOrganism {
  taxonid: number;
  genus: string;
  species: string;
  common_name: string;
  alternative_names: Array<string>;
  assembly_version: string;
  example_gene_identifiers: Array<string>;
  database_id_prefix?: string;
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

export interface DocPagesConfig {
  // titles for each path / Markdown file
  [path: string]: string
}

export interface DocumentationConfig {
  pages: DocPagesConfig;
}

export interface NavBarMenu {
  header: string;
  entries: Array<NavBarEntry>;
}
export interface NavBarEntry {
  title: string;
  url: string;
}

export interface NavBarConfig {
  nav_bar_menus: Array<NavBarMenu>;
}

export interface AnnotationTypeGroup {
  display_name: string;
  cv_names: Array<string>;
}

export interface StatsPageConfig {
  annotation_type_groups: Array<AnnotationTypeGroup>;
}

export interface GeneResultsFieldConfig {
  name: string;
  display_name: string;
  column_type: 'string'|'number'|'attribute'|'bins'|'list'|'gene_list'|'orthologs'|'ontology_term'|'user_vis_term'|'expression_level';
  column_group: 'default'|'extra';
  attr_values: Array<VisColumnAttrValueConfig>|undefined;
  attrValuesMap: Map<string, VisColumnAttrValueConfig>|undefined;
};

export interface GeneResultsConfig {
  field_config: { [name: string]: GeneResultsFieldConfig };
  gene_summary_field_names: Array<string>;
  geneSummaryFieldNames: Array<string>;
  visualisation_extra_column_cv_names: Array<string>;
  visualisation_field_names: Array<string>;
  gene_table_field_names: Array<string>;
  geneSummaryFields: Array<GeneResultsFieldConfig>;
  visualisationFields: Array<GeneResultsFieldConfig>;
  geneTableFields: Array<GeneResultsFieldConfig>;
  // names of slims that are available from the results pages:
  slim_table_slim_names: Array<string>;
};


interface SlimExternalLinkConfig {
  description: string;
  link_text: string;
  link_config_key: string;
  icon_image: string;
}

export interface SlimConfig {
  slim_display_name: string;
  doc_path: string;
  full_slim_path: string;
  description: string;
  slim_results_description: string;
  cv_name: string;
  external_link_config?: SlimExternalLinkConfig;
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

export interface CantaDataConfig {
  browser_track_triage_types: Array<string>;
}

export interface DetailsPageLinkConfig {
  link: string;
  text: string;
}

export interface FeatureLocationWarning {
  feature_types: Array<string>,
  warning: string,
}

export interface GeneExpressionDatasetConfig {
  name: string;
  plot_display_name: string;
  first_author: string;
  pubmed_id: string;
  level_type: string;
  during: string;
  during_termid: string;
}

export interface GeneExpressionConfig {
  max_gene_ex_plot_genes: number;
  datasets: Array<GeneExpressionDatasetConfig>;
}

export interface FooterLogoConfig {
  url: string;
  image: string;
  alt_text: string;
}

export interface ProteinFeatureTypeConfig {
  min_max_only: boolean;
}

export interface ProteinFeatureTableConfig {
  feature_types: { [featureTypeName: string]: ProteinFeatureTypeConfig };
}

export interface AppConfig {
  site_name: string;
  site_description: string;
  database_long_name: string;
  load_organism_taxonid: number;
  logo_file_name: string;
  small_logo_file_name: string;
  tiny_logo_file_name: string;
  header_background_file_name: string;
  footer: {
    funders: string;
    show_elixir_and_gbc_message: boolean;
    logos: Array<FooterLogoConfig>;
  };
  helpdesk_address: string;
  show_names_of_staff_curators: boolean;
  show_names_of_staff_file_curators: boolean;
  gene_systematic_identifier_re: string;
  transcript_systematic_identifier_re: string;
  details_popup_delay: number;
  data_sources: {
    interactions:  Array<{
      name: string;
      url: string;
    }>;
  };
  example_pages: {
    gene: string;
    term: string;
    reference: string;
  },
  social_media: {
    twitter?: string;
    bluesky?: string;
    mastodon?: string;
    github?: string;
    slack?: string;
    facebook?: string;
    linkedin?: string;
  };
  twitter_account?: string;
  has_disease_annotation: boolean;
  has_unknowns_list: boolean;
  has_characterisation_status: boolean;
  news_on_front_page: boolean;
  has_admin_curation: boolean;
  no_gene_name_route?: string;
  ensembl_blast_url: string;
  jackhmmer_search_url: string;
  ebi_tools_url: string;
  pdbe_entry_url: string;
  pdbe_image_url: string;
  rcsb_pdb_entry_url: string;
  seq_and_features_download_url?: string;
  canto_url?: string;
  canto_documentation_url?: string;
  intermine?: {
    list_post_url: string;
    mine_name: string;
  };
  community_mailing_list?: {
    url: string;
    icon: string;
    title: string;
  };
  welcome_message: string;
  canto_data_config: CantaDataConfig;
  organisms: Array<ConfigOrganism>;
  ortholog_taxonids: Array<number>;
  targetOfConfig: TargetOfConfig;
  frontPagePanels: Array<PanelConfig>;
  docPageAliases: { [old: string]: string };
  defaultJBrowseTracks: Array<JBrowseTrackInfo>;
  refPageExtraLinks: { [key: string]: Array<DetailsPageLinkConfig> };
  refPageJBrowseColumns: Array<JBrowseColumnConfig>;
  genePageExtraLinks: { [key: string]: Array<DetailsPageLinkConfig> };
  featureLocationWarnings: Array<FeatureLocationWarning>;
  alphafoldMaxProteinLength: number;
  jbrowseTrackPickerBaseUrl: string;
  apiSeqChunkSizes: {
    all: Array<number>;
    smallest: number;
    largest: number;
  };
  predefinedQueries: { [key: string]: PredefinedQueryConfig };
  cannedQueryIds: Array<string>;
  goAspects: Array<string>;
  cvNameMap: { [cvName: string]: string };
  termPageConfig: TermPageConfig;
  phenotypeIdPrefixes: Array<string>;

  externalTermLinkPrefixes: Array<string>;

  searchBoxCvNames: Array<string>;
  searchBoxConfig: SearchBoxConfig;
  evidenceTypes: EvidenceConfig;
  externalGeneReferences: Array<ExternalGeneReference>;
  externalTermReferences: Array<ExternalTermReference>;
  miscExternalLinks: ExternalLinks;
  graphicalAbstractFileNames: {[pmid: string]: string};
  slims: { [slimName: string]: SlimConfig };
  chromosomes: Array<ChromosomeConfig>;

  extensionCategories?: { [filterSubType: string]: Array<ExtensionFilterCategory> };

  geneExpression: GeneExpressionConfig;

  documentation: DocumentationConfig;
  navBar: NavBarConfig;

  stats: StatsPageConfig;

  queryBuilder: QueryBuilderConfig;

  termDisplayNames: { [termName in FeatureType]: FeatureType };

  proteinFeatureTable: ProteinFeatureTableConfig;

  _geneResults: GeneResultsConfig;

  // the names of fields that can be queried and used in the client
  // see: GeneQueryData in data.rs and class QueryOutputOptions in pombase-query.ts
  allowedQueryFieldName: Array<string>;

  getGeneResultsConfig(): GeneResultsConfig;

  // return true iff the genus and species match the configured organism
  isConfigOrganism(taxon: number): boolean;

  getConfigOrganism(): ConfigOrganism;
  isMultiOrganismMode(): boolean;

  getPredefinedQuery(queryName: string): PredefinedQueryConfig;

  getOrganismByTaxonid(taxonid: number): ConfigOrganism;
  getOrganismByGenusAndSpecies(genus: string, species: string): ConfigOrganism|undefined;

  getChromosomeConfigByName(name: string): ChromosomeConfig|undefined;

  getExternalTermLink(dbName: string, termId: string): { url: string, displayName: string } | undefined;

  getExternalGeneLink(name: string,
                      organismTaxonId: number,
                      geneDetails: GeneDetails): Array<string>|undefined;

  getMiscExternalLink(configKey: string, id: string, geneUniquename?: string): LinkDisplay|undefined;

  getGenePageExternalLinks(geneDetails: GeneDetails): DetailsPageLinkConfig[];
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

export type InteractionTypeFilterCategory = string;

export interface FilterConfig {
  filter_type: string;
  filter_subtype?: string;
  display_name: string;
  detailed_view_only: boolean;
  scope: Array<string>;
  term_categories?: Array<TermFilterCategory>;
  slim_name?: string;
  evidence_categories?: Array<EvidenceFilterCategory>;
  extension_rel_type_names?: Array<string>;
  extension_categories?: Array<ExtensionFilterCategory>;
  throughput_categories?: Array<ThroughputFilterCategory>;
  interaction_types?: Array<InteractionTypeFilterCategory>;
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
  id_source?: string;
}

export interface AnnotationType {
  feature_type: string;
  display_name: string;
  inherits_from?: string;
  split_by_parents?: Array<SplitByParentsConfig>;
  columns_to_show?: Array<string>;
  columns_to_show_by_page_type?: { [column_name: string]: Array<string> };
  details_only?: boolean;
  // if true, don't automatically show a gene page section for this type
  no_gene_details_section?: boolean;
  hide_term_details?: boolean;
  hide_term_id_prefix?: boolean;
  // True for cases like the fake KEGG ontology.  If true we don't say
  // "ontology" and "term" everywhere
  is_a_fake_ontology?: boolean;
  filters?: Array<FilterConfig>;
  external_db_link_keys?: Array<string>;
  external_link_config?: Array<AnnotationExternalLinkConfig>;
  gene_structure_change_message?: Array<string>;
  residue_as_extension_part?: boolean;
  slim_subset_name?: string;
  slim_description?: string;
  slim_link?: string;
  slim_no_category_text?: string;
  protein_viewer_type?: string;
  downstream_query_title?: string;
  downstream_relations?: Array<TermId>;
  modification_abbreviations?: {
    [geneUniquename: string]: {
      [residueAbbreviation: string]: string;
    }
  };
  source_config?: { [source_name: string]: SourceConfig };
  help_route?: string;
  deploy_mode?: string; // display only in this mode, defaults to any mode
}

export interface AnnotationTypes {
  [annotationTypeName: string]: AnnotationType;
}

export interface ExtensionConfig {
}

export interface ExternalGeneReference {
  ref_type: string;
  feature_types: Array<string>;
  name: string;
  description: string;
  field_name: string;
  constraint?: string;  // a field that has to exist and not be empty
  go_xrf_abbrev?: string;
  url?: string;
  show_in_sections?: Array<string>;
}

export function replaceFieldsInUrl(url: string, replacements: {[key: string]: string}): string {
  const keys = Object.keys(replacements);
  for (const key of keys) {
    url = url.replace('<<' + key + '>>', replacements[key])
  }
  return url;
}

export function makeGeneExternalUrl(geneDetails: GeneDetails,
                                    organismTaxonId: number,
                                    extRefConf: ExternalGeneReference): Array<string> {
  if (extRefConf.constraint) {
    const geneAsAny = geneDetails as any;
    const fieldValue = geneAsAny[extRefConf.constraint];
    if (fieldValue === undefined) {
      return [];
    } else {
      if (fieldValue instanceof Array) {
        if (fieldValue.length == 0) {
          return [];
        }
      } else {
        if (!fieldValue) {
          return [];
        }
      }
    }
  }

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
          .replace('<<TAXONID>>', String(organismTaxonId))
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

export interface InteractionTypeConfig {
  baitLabel: string;
  preyLabel: string;
  isSymmetric: boolean;
}

export interface AnnotationTableConfig {
  annotationTypeOrder: Array<string>;
  extensions: ExtensionConfig;
  annotationTypes: AnnotationTypes;
  interactionConfig: {
    [evidence: string]: InteractionTypeConfig,
  };
  getAnnotationType(annotationTypeName: string): AnnotationType;
}

const GO_ASPECTS = ['molecular_function', 'biological_process', 'cellular_component'];

let _config: AnnotationTableConfig = {
  annotationTypes: pombaseConfig.cv_config,
  annotationTypeOrder: (pombaseConfig.annotation_type_order as Array<string>)
    .filter(typeName => {
      return typeName in pombaseConfig.cv_config;
    }),
  extensions: {
  },
  interactionConfig: pombaseConfig.interaction_config,
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

  if (thisConfig.filters) {
    for (const filterConfig of thisConfig.filters) {
      if (filterConfig.filter_subtype) {
        filterConfig.extension_categories =
          pombaseConfig.extension_categories[filterConfig.filter_subtype];
      }
    }
  }
}

if (pombaseConfig.term_page_extensions_cv_names &&
    pombaseConfig.term_page_extensions_cv_names.length > 0) {
  let seenNames: { [key: string]: boolean } = {};

  for (let extNameConf of pombaseConfig.extension_display_names) {
    const extDisplayName = extNameConf.display_name;

    for (let cvName of pombaseConfig.term_page_extensions_cv_names) {
      const typeName = `extension:${cvName}:${extDisplayName}`;
      const cvDisplayName = pombaseConfig.cv_config[cvName].display_name;
      const displayName = `${cvDisplayName} / ${extDisplayName}`;

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

function replaceIdNoPrefix(urlSyntax: string, idNoPrefix: string) {
  return urlSyntax.replace('[id_no_prefix]', idNoPrefix);
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

function processGeneResults(geneResults: GeneResultsConfig): GeneResultsConfig {
  Object.keys(geneResults.field_config)
    .map(confName => {
      let conf = geneResults.field_config[confName];
      conf.name = confName;
      if (!conf.column_group) {
        conf.column_group = 'default';
      }
    });

  return geneResults;
}

let _organismMap: { [taxonid: number]: ConfigOrganism }|null = null;

const confDbPrefixRE = /\[conf_db_prefix\]/g;

let _appConfig: AppConfig = {
  site_name: pombaseConfig.site_name,
  site_description: pombaseConfig.site_description,
  database_long_name: pombaseConfig.database_long_name,
  load_organism_taxonid: pombaseConfig.load_organism_taxonid,
  logo_file_name: pombaseConfig.logo_file_name,
  small_logo_file_name: pombaseConfig.small_logo_file_name,
  tiny_logo_file_name: pombaseConfig.tiny_logo_file_name,
  header_background_file_name: pombaseConfig.header_background_file_name,
  footer: pombaseConfig.footer,
  helpdesk_address: pombaseConfig.helpdesk_address,
  show_names_of_staff_curators: pombaseConfig.show_names_of_staff_curators,
  show_names_of_staff_file_curators: pombaseConfig.show_names_of_staff_file_curators,
  gene_systematic_identifier_re: pombaseConfig.gene_systematic_identifier_re,
  transcript_systematic_identifier_re: pombaseConfig.transcript_systematic_identifier_re,
  details_popup_delay: pombaseConfig.details_popup_delay,
  data_sources: pombaseConfig.data_sources,
  example_pages: pombaseConfig.example_pages,
  social_media: pombaseConfig.social_media,
  twitter_account: pombaseConfig.twitter_account,
  has_disease_annotation: pombaseConfig.has_disease_annotation,
  has_unknowns_list: pombaseConfig.has_unknowns_list,
  has_characterisation_status: pombaseConfig.has_characterisation_status,
  news_on_front_page: pombaseConfig.news_on_front_page,
  has_admin_curation: pombaseConfig.has_admin_curation,
  no_gene_name_route: pombaseConfig.no_gene_name_route,
  ensembl_blast_url: pombaseConfig.ensembl_blast_url,
  jackhmmer_search_url: pombaseConfig.jackhmmer_search_url,
  ebi_tools_url: pombaseConfig.ebi_tools_url,
  pdbe_entry_url: pombaseConfig.pdbe_entry_url,
  pdbe_image_url: pombaseConfig.pdbe_image_url,
  rcsb_pdb_entry_url: pombaseConfig.rcsb_pdb_entry_url,
  seq_and_features_download_url: pombaseConfig.seq_and_features_download_url,
  canto_url: pombaseConfig.canto_url,
  canto_documentation_url: pombaseConfig.canto_documentation_url,
  intermine: pombaseConfig.intermine,
  community_mailing_list: pombaseConfig.community_mailing_list,
  welcome_message: pombaseConfig.welcome_message,
  canto_data_config: pombaseConfig.canto_data_config,
  organisms: pombaseConfig.organisms,
  ortholog_taxonids: pombaseConfig.ortholog_taxonids,
  targetOfConfig: pombaseConfig.target_of_config,
  frontPagePanels: processPanelConfigs(pombaseConfig.front_page_panels),
  docPageAliases: pombaseConfig.doc_page_aliases,
  defaultJBrowseTracks: pombaseConfig.default_jbrowse_tracks,
  refPageExtraLinks: pombaseConfig.reference_page_extra_links || [],
  refPageJBrowseColumns: pombaseConfig.reference_page_jbrowse_columns,
  genePageExtraLinks: pombaseConfig.gene_page_extra_links || [],
  featureLocationWarnings: pombaseConfig.feature_location_warnings || [],
  alphafoldMaxProteinLength: pombaseConfig.alphafold_max_protein_length || 1280,
  jbrowseTrackPickerBaseUrl: pombaseConfig.jbrowse_track_picker_base_url,
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
  goAspects: GO_ASPECTS,
  cvNameMap: {
    'GO': '(' + GO_ASPECTS.join(' OR ') + ')',
    'FYPO': 'fission_yeast_phenotype',
    'PSI-MOD': 'PSI-MOD',
    'SO-protein': 'sequence',
  },
  slims: pombaseConfig.slims,
  extensionCategories: pombaseConfig.extension_categories,

  externalTermLinkPrefixes: pombaseConfig.external_term_link_prefixes || [],

  // limit the search box term autocompletion to these CVs:
  searchBoxCvNames: pombaseConfig.search_box_cv_names,
  searchBoxConfig: pombaseConfig.search_box_config,

  evidenceTypes: pombaseConfig.evidence_types,
  externalGeneReferences: pombaseConfig.external_gene_references,
  externalTermReferences: pombaseConfig.external_term_references,
  miscExternalLinks: pombaseConfig.misc_external_links,
  graphicalAbstractFileNames: graphicalAbstractFileNames,
  chromosomes: pombaseConfig.chromosomes,

  geneExpression: pombaseConfig.gene_expression,

  documentation: docConfig,
  navBar: pombaseConfig.nav_bar_config,

  stats: pombaseConfig.stats,

  // query builder node configuration:
  queryBuilder: pombaseConfig.query_builder,

  termDisplayNames: pombaseConfig.term_display_names,

  proteinFeatureTable: pombaseConfig.protein_feature_table,

  allowedQueryFieldName: pombaseConfig.gene_results.allowed_query_field_names,

  _geneResults: processGeneResults(pombaseConfig.gene_results),

  getGeneResultsConfig(): GeneResultsConfig {
    return this._geneResults;
  },

  isConfigOrganism(taxonid: number): boolean {
    return taxonid === this.load_organism_taxonid;
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
        _organismMap![organism.taxonid] = organism;
      });
    }

    return _organismMap[taxonid];
  },

  getOrganismByGenusAndSpecies(genus: string, species: string): ConfigOrganism|undefined {
    for (const orgConfig of this.organisms) {
      if (orgConfig.genus === genus && orgConfig.species === species) {
        return orgConfig;
      }
    }
    return undefined;
  },

  getChromosomeConfigByName(chrName: string): ChromosomeConfig|undefined {
    for (const chrConfig of this.chromosomes) {
      if (chrConfig.name == chrName) {
        return chrConfig;
      }
    }
    return undefined;
  },

  getPredefinedQuery(queryId: string): PredefinedQueryConfig {
    return getAppConfig().predefinedQueries[queryId];
  },

  getExternalTermLink(configKey: string, termId: string): LinkDisplay|undefined {
    let confs = this.externalTermReferences;

    for (let conf of confs) {
      if (conf.name === configKey) {
        if (conf.url) {
          let matches = termId.match(/^([^:]+):(.*)/);

          if (matches) {
            let url =
              replaceExampleId(conf.url.replace(confDbPrefixRE, matches[1]), termId);
            url = replaceIdNoPrefix(url, matches[2]);
            return { url: url, displayName: configKey };
          } else {
            return {
              url: replaceExampleId(conf.url, termId),
              displayName: configKey,
            };
          }
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

    return undefined;
  },

  getExternalGeneLink(name: string,
                      organismTaxonId: number,
                      geneDetails: GeneDetails): Array<string>|undefined {
    for (let conf of this.externalGeneReferences) {
      if (conf['name'] === name) {
        return makeGeneExternalUrl(geneDetails, organismTaxonId, conf);
      }
    }

    return undefined;
  },

  // get a URL from the misc_external_links configuration and substitute the given ID
  getMiscExternalLink(configKey: string, id: string, geneUniquename?: string): LinkDisplay|undefined {
    let configUrl = this.miscExternalLinks[configKey];

    if (configUrl) {
      let url = configUrl.replace('<<IDENTIFIER>>', id);
      if (geneUniquename) {
        url = url.replace('<<GENE_UNIQUENAME>>', geneUniquename);
      }
      return { url,
               displayName: configKey };
    }

    return undefined;
  },


  getGenePageExternalLinks(geneDetails: GeneDetails): DetailsPageLinkConfig[] {
    const linkConfig =
      this.genePageExtraLinks[geneDetails.uniquename];

    if (linkConfig) {
      return linkConfig
        .map(linkDetails => {
          return {
            text: linkDetails.text,
            link: linkDetails.link.replace(/ /g, '%20'),
          }
        });
    } else {
      return [];
    }
  }
};


let geneResults = pombaseConfig.gene_results as GeneResultsConfig;

_appConfig._geneResults = geneResults;

for (const fieldName of Object.keys(geneResults.field_config)) {

  let fieldConfig = geneResults.field_config[fieldName];
  fieldConfig.name = fieldName;

  if (fieldConfig.attr_values) {
    fieldConfig.attrValuesMap = new Map();
    let index = 0;
    for (let attrValueConfig of fieldConfig.attr_values) {
      if (!attrValueConfig.sort_priority) {
        attrValueConfig.sort_priority = index;
      }
      index++;
      fieldConfig.attrValuesMap.set(attrValueConfig.name, attrValueConfig);
    }
  }
}

// add a result column configuration for each gene ex dataset
for (const geneExDatasetConfig of _appConfig.geneExpression.datasets) {
  const geneExConfName = 'gene_ex_avg_copies_per_cell:' + geneExDatasetConfig.name;
  geneResults.field_config[geneExConfName] =
    {
      name: geneExConfName,
      display_name: geneExDatasetConfig.name,
      column_type: 'expression_level',
      column_group: 'extra',
      attr_values: [],
      attrValuesMap: new Map(),
    };
  geneResults.gene_table_field_names.push(geneExConfName);
}

const fieldFinder = (fieldName: string) => {
  const fieldConfig = geneResults.field_config[fieldName];
  if (fieldConfig) {
    return fieldConfig;
  } else {
    console.error('no field_config for: ' + fieldName);
    return null;
  }
}
geneResults.visualisationFields =
  geneResults.visualisation_field_names.map(fieldFinder)
  .filter(conf => !!conf) as Array<GeneResultsFieldConfig>;

geneResults.geneTableFields =
  geneResults.gene_table_field_names.map(fieldFinder)
  .filter(conf => !!conf) as Array<GeneResultsFieldConfig>;

geneResults.geneSummaryFieldNames = geneResults['gene_summary_field_names'];
geneResults.geneSummaryFields =
  geneResults.geneSummaryFieldNames.map(fieldFinder)
  .filter(conf => !!conf) as Array<GeneResultsFieldConfig>;

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

let xrfConfig: XrfConfigMap|undefined = undefined;

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
  'QuickGO': {
    displayName: 'QuickGO',
    description: 'QuickGO',
    urlSyntax: 'http://www.ebi.ac.uk/QuickGO/GTerm?id=[example_id]',
    website: 'http://www.ebi.ac.uk/QuickGO/',
  },
  'Gene3D' : {
    description : 'Domain Architecture Classification',
    displayName : 'Gene3D',
    urlSyntax: 'http://www.cathdb.info/version/latest/superfamily/[example_id]',
    website: 'http://www.cathdb.info/'
  },
  SUPERFAMILY : {
    description : 'SUPERFAMILY protein annotation database',
    displayName : 'SUPERFAMILY',
    urlSyntax : 'http://supfam.org/SUPERFAMILY/cgi-bin/scop.cgi?ipid=[example_id]',
    website : 'http://supfam.org/'
  },
  'Profile' : {
     'description' : 'Prosite database of protein families and domains',
     'displayName' : 'Prosite profile',
     'urlSyntax' : 'https://prosite.expasy.org/[example_id]',
     'website' : 'https://prosite.expasy.org/'
  },
  'InterProUniProtId' : {
    description : 'InterPro protein summary',
    displayName : 'InterPro',
    urlSyntax : 'https://www.ebi.ac.uk/interpro/protein/reviewed/[example_id]',
    website : 'https://www.ebi.ac.uk/interpro/',
 },
  'UniRule': {
    description: 'Annotation based on expertly curated rules',
    displayName: 'UniRule',
    urlSyntax: 'https://www.uniprot.org/unirule/[example_id]',
    website: 'https://www.uniprot.org/unirule/',
  },
  JaponicusDB : {
    "description" : "The Schizosaccharomyces japonicus genome database",
    displayName : "JaponicusDB",
    "urlSyntax" : "https://www.japonicusdb.org/gene/[example_id]",
    "website" : "https://www.japonicusdb.org/"
  },
  IntactInteractionNetwork: {
    "description" : "IntAct interaction networks",
    displayName: "IntAct interaction networks",
    urlSyntax: "https://www.ebi.ac.uk/intact/search?query=[example_id]",
    website: "https://www.ebi.ac.uk/intact/",
  },
  Monarch: {
    description: "Human disease phenotypes",
    displayName: "Human disease phenotypes",
    urlSyntax: "https://monarchinitiative.org/PomBase:[example_id]",
    website: "https://monarchinitiative.org/",
  },
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

export function getXrfConfigByName(name: string): XrfConfig|undefined {
  return getXrfConfig()[name];
}

export function getXrfWithPrefix(prefix: string, id: string): XrfDetails|undefined {
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

  return undefined;
}

export function getXrf(idWithPrefix: string): XrfDetails|undefined {
  let matches = idWithPrefix.match(/^([^:]+):(.*)/);

  if (matches) {
    return getXrfWithPrefix(matches[1], matches[2]);
  } else {
    return undefined;
  }
}


export function getOrganismExternalLink(organismGenus: string, organismSpecies: string,
                                        uniquename: string, name?: string): string|undefined {
  const organismConfig = getAppConfig().getOrganismByGenusAndSpecies(organismGenus, organismSpecies);

  if (!organismConfig) {
    return undefined;
  }

  const organismPrefix = organismConfig.database_id_prefix;

  if (!organismPrefix) {
    return undefined;
  }

  let xrfOrgConfig = getXrfConfig()[organismPrefix];

  if (xrfOrgConfig) {
    let linkTemplate = xrfOrgConfig.urlSyntax;

    if (linkTemplate) {
      if (!xrfOrgConfig.fieldName || xrfOrgConfig.displayName === 'uniquename') {
        return replaceExampleId(linkTemplate, uniquename);
      } else {
        return replaceExampleId(linkTemplate, name || uniquename);
      }
    }
  }

  return undefined;
}

  export interface JBrowseTrackInfo {
  pmed_id: string;
  label:   string;
  mutants:  string;
  assayed_gene_product: string;
  [key: string]: string;
}

const _jbrowseTracks: Array<JBrowseTrackInfo> = jbrowseTracks;
let _jbrowseTracksByPMID: { [pmid: string]: Array<JBrowseTrackInfo>; };
let _jbrowseTracksByGeneName: { [geneName: string]: Array<JBrowseTrackInfo>; };

function _makeJBrowseTrackMaps() {
  _jbrowseTracksByGeneName = {};
  _jbrowseTracksByPMID = {};
  const cleanGene = (geneName: string) => {
    const geneNames = geneName.split(/\s+and\s+|\s*,\s*/);
    return geneNames.map(geneName => {
      return geneName.replace(/delta\s*$/, '');
    })
  };
  const addInfo = (trackMap: { [geneName: string]: Array<JBrowseTrackInfo>; },
                   identifier: string, trackInfo: JBrowseTrackInfo) => {
                    if (trackMap[identifier]) {
                      trackMap[identifier].push(trackInfo);
                    } else {
                      trackMap[identifier] = [trackInfo];
                    }
                   };
  for (const trackInfo of _jbrowseTracks) {
     if (trackInfo.pmed_id) {
       addInfo(_jbrowseTracksByPMID, trackInfo.pmed_id, trackInfo);
     }
     if (trackInfo.mutants) {
       const geneNames = cleanGene(trackInfo.mutants);
       geneNames.map(geneName => addInfo(_jbrowseTracksByGeneName, geneName, trackInfo))
     }
     if (trackInfo.assayed_gene_product) {
      const geneNames = cleanGene(trackInfo.assayed_gene_product);
      geneNames.map(geneName => addInfo(_jbrowseTracksByGeneName, geneName, trackInfo))
    }
  }
}

export function getJBrowseTracksByPMID(pmid: string): Array<JBrowseTrackInfo> {

  if (!_jbrowseTracksByPMID) {
    _makeJBrowseTrackMaps();
  }
  pmid = pmid.replace(/^PMID:/, '');
  return  _jbrowseTracksByPMID[pmid] || [];
}

export function getJBrowseTracksByGeneName(geneName: string): Array<JBrowseTrackInfo> {

  if (!_jbrowseTracksByGeneName) {
    _makeJBrowseTrackMaps();
  }
  return _jbrowseTracksByGeneName[geneName] || [];
}
