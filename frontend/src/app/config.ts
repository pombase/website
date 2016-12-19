export interface AppConfig {
  organism: {
    genus: string,
    species: string,
  };

  // return true iff the genus and species match the configured organism
  isConfigOrganism(genus: string, species: string): boolean;
}

export interface AnnotationType {
  displayName: string;
  columnsToShow: Array<string>;
}

export interface AnnotationTypes {
    [annotationTypeName: string]: AnnotationType;
}

export interface AnnotationTableConfig {
    annotationTypeOrder: Array<string>;
    annotationTypes: AnnotationTypes;
    getAnnotationType(annotationTypeName: string): AnnotationType;
}

let goColumnsToShow =
  ["desc-rel", "gene", "evidence", "with", "qualifiers", "reference", "gene-count"];
let defaultColumnsToShow =
  ["desc-rel", "gene", "evidence", "qualifiers", "reference", "gene-count"];
let defaultInteractionToShow =
  ["interactor", "gene-product", "evidence", "reference"];

let _config: AnnotationTableConfig = {
  annotationTypeOrder: [
    "molecular_function",
    "biological_process",
    "cellular_component",
    "fission_yeast_phenotype",
    "PomBase family or domain",
    "PSI-MOD",
    "gene_ex",
    "species_dist",
    "complementation",
    "taxonomic_conservation",
//    "subunit_composition",
//    "misc",
  ],
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
      columnsToShow: ["desc-rel", "gene",
                      "evidence", "residue", "reference", "gene-count"],
    },
    fission_yeast_phenotype: {
      displayName: "Phenotype",
      columnsToShow: ["desc-rel", "gene", "genotype",
                      "evidence", "conditions", "reference", "gene-count"],
    },
    gene_ex: {
      displayName: "Gene expression",
      columnsToShow: ["gene-ex", "extension", "evidence", "conditions", "gene-ex-scale", "reference"],
    },
    species_dist: {
      displayName: "Taxonomic conservation",
      columnsToShow: defaultColumnsToShow.concat("gene-count"),
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
  },

  isConfigOrganism(genus: string, species: string): boolean {
    return genus == this.organism.genus && species == this.organism.species;
  }
};

export function getAnnotationTableConfig(): AnnotationTableConfig {
  return _config;
}

export function getAppConfig(): AppConfig {
  return _appConfig;
}
