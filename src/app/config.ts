export interface AppConfig {
  organism: {
    genus: string,
    species: string,
  }
}

export interface AnnotationType {
  displayName: string;
  columnsToShow: Array<string>;
}

export interface AnnotationTypes {
    [annotationTypeName: string]: AnnotationType;
}

export interface AnnotationTableConfig {
    annotationTypes: AnnotationTypes;
    getAnnotationType(annotationTypeName: string): AnnotationType;
}

let goColumnsToShow =
  ["desc-rel", "gene", "term", "gene_count", "evidence", "with", "reference"];
let defaultColumnsToShow =
  ["desc-rel", "gene", "term", "gene_count", "evidence", "reference"];
let defaultInteractionToShow =
  ["interactor", "gene-product", "evidence", "reference"];

let _config: AnnotationTableConfig = {
  annotationTypes: {
    molecular_function: {
      displayName: "GO molecular function",
      columnsToShow: goColumnsToShow,
   },
    biological_process: {
      displayName: "GO biological process",
      columnsToShow: goColumnsToShow,
    },
    cellular_component: {
      displayName: "GO cellular component",
      columnsToShow: goColumnsToShow,
    },
    "PSI-MOD": {
      displayName: "Modification",
      columnsToShow: ["desc-rel", "gene", "term", "gene_count",
                      "evidence", "residue", "reference"],
    },
    fission_yeast_phenotype: {
      displayName: "Phenotype",
      columnsToShow: ["desc-rel", "gene", "genotype", "term", "gene_count",
                      "evidence", "conditions", "reference"],
    },
    gene_ex: {
      displayName: "Gene expression",
      columnsToShow: ["desc-rel", "gene", "term", "evidence", "reference"],
    },
    species_dist: {
      displayName: "Taxonomic conservation",
      columnsToShow: defaultColumnsToShow.concat("gene_count"),
    },
    complementation: {
      displayName: "Complementation",
      columnsToShow: defaultColumnsToShow,
    },
    interacts_genetically: {
      displayName: "Genetic interaction",
      columnsToShow: defaultInteractionToShow,
    },
    interacts_physically: {
      displayName: "Physical interaction",
      columnsToShow: defaultInteractionToShow,
    },
    orthologs: {
      displayName: "Orthologs",
      columnsToShow: ["species", "ortholog", "description"]
    },
    paralogs: {
      displayName: "Paralogs",
      columnsToShow: ["ortholog", "description"]
    },
    subunit_composition: {
      displayName: "Subunit Composition",
      columnsToShow: defaultColumnsToShow,
    },
    misc: {
      displayName: "Miscellaneous",
      columnsToShow: defaultColumnsToShow,
    },
    sequence: {
      displayName: "Sequence",
      columnsToShow: defaultColumnsToShow,
    },
    _DEFAULT_: {
      displayName: null,
      columnsToShow: defaultColumnsToShow,
    }
  },
  getAnnotationType:
  function(annotationTypeName: string): AnnotationType {
    return _config.annotationTypes[annotationTypeName] || _config.annotationTypes['_DEFAULT_'];
  },
}

let _appConfig: AppConfig = {
  organism: {
    genus: 'Schizosaccharomyces',
    species: 'pombe',
  }
};

export function getAnnotationTableConfig(): AnnotationTableConfig {
  return _config;
}

export function getAppConfig(): AppConfig {
  return _appConfig;
}
