# ${database_name} collaborations

- **[Monarch](https://monarchinitiative.org/)** is a platform that connects phenotypes to environmental factors and genotypes, integrating phenotypes from multiple species to make them queryable in a single portal, and use the combined knowledge to better understand human disease. We are currently in the process of integrating our phenotype data into Monarch.

- **[Mondo](https://mondo.monarchinitiative.org/)** is a disease ontology developed as part of the Monarch initiative. It aims to merge multiple disease ontologies and develop guidelines for disease logical definitions, which are computer-readable. We actively contribute to the development of this ontology, and [link fission yeast genes with Mondo terms](/documentation/disease-association).

- **[uPheno](https://obofoundry.org/ontology/upheno.html)** is another component of the Monarch Initiative with the goal of integrating multiple phenotype ontologies into a unified cross-species phenotype ontology to make them interoperable. This interoperability is achieved by developing templates for phenotype logical definitions. We interact with uPheno developers to develop and implement standardised definition templates into FYPO .

- **[Pfam](https://pfam.xfam.org/)** and **[InterPro](https://www.ebi.ac.uk/interpro/)** are protein family databases. We have been collaborating with the Pfam and InterPro teams at the EBI for almost two decades, submitting over 1000 protein families via Pfam and providing QC for InterPro to GO mapping assignments. Recently, to increase ortholog coverage, we collaborated with the Pfam team to identify distant orthologs using AlphaFold reciprocal best structure hits. See this [preprint](https://doi.org/10.1101/2022.07.04.498216).

- **[Intermine](http://intermine.org/)** is a data warehouse that integrates heterogeneous data from different model organisms. Users can simultaneously query data from *${genus_and_species}* and other organisms through a website, a web API or client libraries in several programming languages. We have actively collaborated with InterMine to integrate data from ${database_name} into a ‘PombeMine’ and to improve PombeMine to better support our users. [Read more](https://www.pombase.org/pombemine).

- The [**Gene Ontology Consortium**](http://geneontology.org/) oversees the development of GO, to standardise the functional description of gene products. ${database_name} is a member of the GO consortium. ${database_name} Co-PI and project manager Valerie Wood is a member of the GO council, and funded to work on GO development as PI of a GO subcontract. Our curators actively contribute to GO development requesting changes and additions to the ontology. We also participate in other GO-related projects, for example:

  - The [**Term Matrix annotation QC**](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7536087/) project, a framework to develop rules to identify potentially incorrect GO annotations by identifying genes annotated to two biological processes unlikely to be co-annotated to the same gene products.
  - **Revision of the Gene Ontology terms of chromatin-related processes** to improve the GO representation of chromatin and epigenetics curation, since fission yeast is a major model species for this research field.

- **[PHI-base](http://www.phi-base.org/)** is a pathogen-host interaction database. ${database_name} supports PHI-base by adapting Canto (our community curation tool) for their curation and advising on phenotype ontology and literature curation.

- **[FlyBase](https://flybase.org/)** is a model organism for *Drosophila*. ${database_name} supports FlyBase by adapting Canto (our community curation tool) for their complex phenotype annotation.

- [**RNAcentral**](https://rnacentral.org/) is a non-coding RNA sequence database. As part of our data dissemination obligations, along with other model organism databases, we provide curated non-coding RNAs to RNA Central. We also collaborate to improve noncoding RNA classification.

- [**BioGRID**](https://thebiogrid.org/) is a database for genetic and physical interactions. They curate interactions from publications that are integrated into ${database_name}, and vice-versa, to avoid duplication of curation effort. This is part of our data-dissemination obligations.

- [**microPublication**](https://www.micropublication.org/) is a peer-reviewed journal that publishes one-figure papers with novel findings, negative or reproduced results, and results that may lack a broader scientific narrative. We are a partner database and provide curator input and promote articles on our website. This novel format incentivises reporting small and negative results, preventing research duplication and waste of research funding.

- [**JaponicusDB**](https://www.japonicusdb.org/) is the model organism database for the fission yeast *Schizosaccharomyces japonicus*, an emerging model organism. JaponicusDB uses ${database_name}'s website code and its curation is entirely provided by the authors using Canto. This database was set up in a sprint of less than three months, and is a success story that shows that ${database_name} code and curation tools are reusable. [Read more](https://academic.oup.com/genetics/article/220/4/iyab223/6481558).

- [**Valerie de Crecy-Lagard**](https://orcid.org/0000-0002-9955-3785) recently organised a workshop funded by NSF to devise a roadmap for the functional annotation of protein families. ${database_name} staff participated in the discussion (publication pending).
