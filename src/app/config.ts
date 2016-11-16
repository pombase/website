export interface AnnotationType {
    displayName: string;
}

export interface AnnotationTypes {
    [annotationTypeName: string]: AnnotationType;
}

export interface GenePageConfig {
    annotationTypes: AnnotationTypes;
    getAnnotationType(annotationTypeName: string): AnnotationType;
}

let _config: GenePageConfig = {
  annotationTypes: {
    molecular_function: {
      displayName: "GO molecular function",
    },
    biological_process: {
      displayName: "GO biological process",
    },
    cellular_component: {
      displayName: "GO cellular component",
    },
    "PSI-MOD": {
      displayName: "Modification",
    },
    fission_yeast_phenotype: {
      displayName: "Phenotype",
    },
    post_translational_modification: {
      displayName: "Protein modification",
    },
    genetic_interaction: {
      displayName: "Genetic interaction",
    },
    physical_interaction: {
      displayName: "Physical interaction",
    },
    gene_ex: {
      displayName: "Gene expression",
    },
    species_dist: {
      displayName: "Taxonomic conservation"
    },
    complementation: {
      displayName: "Complementation"
    },
    interacts_genetically: {
      displayName: "Genetic interaction",
    },
    interacts_physically: {
      displayName: "Physical interaction",
    },
    orthologs: {
      displayName: "Orthologs",
    },
    paralogs: {
      displayName: "Paralogs",
    },
    subunit_composition: {
      displayName: "Subunit Composition",
    },
    misc: {
      displayName: "Miscellaneous",
    }
  },
  getAnnotationType:
  function(annotationTypeName: string): AnnotationType {
    return _config.annotationTypes[annotationTypeName];
  },
}

export function getGenePageConfig(): GenePageConfig {
  return _config;
}
