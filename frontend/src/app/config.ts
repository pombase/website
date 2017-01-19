export interface LinkoutConfig {
  [name: string]: string;
}

export interface EvidenceConfig {
  [name: string]: {
    long?: string;
    link?: string;
  };
}

export interface AppConfig {
  organism: {
    genus: string,
    species: string,
  };

  linkoutConfig: LinkoutConfig;

  evidenceTypes: EvidenceConfig;

  // return true iff the genus and species match the configured organism
  isConfigOrganism(genus: string, species: string): boolean;
}

export interface AnnotationType {
  displayName: string;
  splitByParents?: Array<any>;
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
    "complementation",
    "target_of",
    "PomBase family or domain",
    "PSI-MOD",
    "gene_ex",
    "misc",
    "physical_interactions",
    "genetic_interactions",
    "orthologs",
    "paralogs",
    "species_dist",
    "taxonomic_conservation",
    "disease_associated",
    "warning",
    "subunit_composition",
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
      splitByParents: [
        {
          termid: "FYPO:0000002",
          displayName: "Cell phenotype",
        },
        {
          termid: "FYPO:0000003",
          displayName: "Population phenotype",
        },
      ],
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
    genetic_interactions: {
      displayName: "Genetic interaction",
      columnsToShow: defaultInteractionToShow,
    },
    physical_interactions: {
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

  linkoutConfig: {
    pro: "http://www.proconsortium.org/cgi-bin/pro/entry_pro?id=",
    pfam: "http://pfam.xfam.org/family/",
  },

  evidenceTypes: {
    IMP: {
      long: "Inferred from Mutant Phenotype",
      link: "http://www.geneontology.org/page/imp-inferred-mutant-phenotype",
    },
    IDA: {
      long: "Inferred from Direct Assay",
      link: "http://www.geneontology.org/page/ida-inferred-direct-assay",
    },
    IGI: {
      long: "Inferred from Genetic Interaction",
      link: "http://www.geneontology.org/page/igi-inferred-genetic-interaction",
    },
    IPI: {
      long: "Inferred from Physical Interaction",
      link: "http://www.geneontology.org/page/ipi-inferred-physical-interaction",
    },
    EXP: {
      long: "Inferred from Experiment",
      link: "http://www.geneontology.org/page/exp-inferred-experiment",
    },
    IEP: {
      long: "Inferred from Expression Pattern",
      link: "http://www.geneontology.org/page/iep-inferred-expression-pattern",
    },
    ISS: {
      long: "Inferred from Sequence or Structural Similarity",
      link: "http://www.geneontology.org/page/iss-inferred-sequence-or-structural-similarity",
    },
    ISO: {
      long: "Inferred from Sequence Orthology",
      link: "http://www.geneontology.org/page/iso-inferred-sequence-orthology",
    },
    ISA: {
      long: "Inferred from Sequence Alignment",
      link: "http://www.geneontology.org/page/isa-inferred-sequence-alignment",
    },
    ISM: {
      long: "Inferred from Sequence Model",
      link: "http://www.geneontology.org/page/ism-inferred-sequence-model",
    },
    IGC: {
      long: "Inferred from Genomic Context",
      link: "http://www.geneontology.org/page/igc-inferred-genomic-context",
    },
    IBA: {
      long: "Inferred from Biological aspect of Ancestor",
      link: "http://www.geneontology.org/page/iba-inferred-biological-aspect-ancestor",
    },
    IBD: {
      long: "Inferred from Biological aspect of Descendant",
      link: "http://www.geneontology.org/page/ibd-inferred-biological-aspect-descendant",
    },
    IKR: {
      long: "Inferred from Key Residues",
      link: "http://www.geneontology.org/page/ikr-inferred-key-residues",
    },
    IRD: {
      long: "Inferred from Rapid Divergence",
      link: "http://www.geneontology.org/page/ird-inferred-rapid-divergence",
    },
    RCA: {
      long: "inferred from Reviewed Computational Analysis",
      link: "http://www.geneontology.org/page/rca-inferred-reviewed-computational-analysis",
    },
    NAS: {
      long: "Non-traceable Author Statement",
      link: "http://www.geneontology.org/page/nas-non-traceable-author-statement",
    },
    IC: {
      long: "Inferred by Curator",
      link: "http://www.geneontology.org/page/ic-inferred-by-curator",
    },
    ND: {
      long: "No biological Data available",
      link: "http://www.geneontology.org/page/nd-no-biological-data-available",
    },
    IEA: {
      long: "Inferred from Electronic Annotation",
      link: "http://www.geneontology.org/page/iea-inferred-electronic-annotation",
    },
    NR: {
      long: "Not Recorded",
      link: "http://www.geneontology.org/page/nr-not-recorded",
    },
    TAS: {
      long: "Traceable Author Statement",
      link: "http://www.geneontology.org/page/tas-traceable-author-statement",
    },
    UNK: {
      long: "Unknown",
    },
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
