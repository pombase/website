import { Component, OnInit } from '@angular/core';
import { GeneUniquename, GeneListNode, GeneQuery } from '../pombase-query';

import { PombaseAPIService, GeneSummary } from '../pombase-api.service';
import { QueryRouterService } from '../query-router.service';
import { AppConfig, getAppConfig } from '../config';


interface MapperType {
  id: string;
  taxonId: number|null;
  displayName: string;
};

@Component({
  selector: 'app-identifier-mapper',
  templateUrl: './identifier-mapper.component.html',
  styleUrls: ['./identifier-mapper.component.css']
})
export class IdentifierMapperComponent implements OnInit {

  appConfig: AppConfig = getAppConfig();
  inputText = '';
  selectedMapperType: MapperType = null;
  geneSummariesPromise: Promise<Array<GeneSummary>> = null;
  geneSummaries: Array<GeneSummary> = null;
  uniprotType: MapperType = {
    id: 'uniprot',
    taxonId: null,
    displayName: 'UniProt',
  };
  mapperTypes: Array<MapperType> = [];
  organismCommonName = this.appConfig.getConfigOrganism().common_name;

  oneToOneMatches: { [id: string]: GeneSummary } = {};
  multipleMatches: { [id: string]: Array<GeneSummary> } = {};
  notFound: Array<string> = [];
  listName: string = null;

  constructor(private pombaseApiService: PombaseAPIService,
              private queryRouterService: QueryRouterService) {
    this.geneSummariesPromise = this.pombaseApiService.getGeneSummariesPromise();
    this.geneSummariesPromise.then(geneSummaries => this.geneSummaries = geneSummaries);

    this.mapperTypes = [this.uniprotType];
    this.selectedMapperType = this.uniprotType;

    for (const orthTaxonId of this.appConfig.ortholog_taxonids) {
      this.appConfig.organisms
        .map(org => {
          if (org.taxonid === orthTaxonId) {
            this.mapperTypes.push({ id: 'ortholog' + org.taxonid,
                                    taxonId: org.taxonid,
                                    displayName: org.common_name });
          }
        });
    }
  }

  mapperTypeCompare(a: MapperType, b: MapperType): boolean {
    if (!a || !b) {
      return false;
    }
    return a.id === b.id;
  }

  objectKeyCount(obj: {}): number {
    return Object.keys(obj).length;
  }

  hasResults(): boolean {
    return this.objectKeyCount(this.oneToOneMatches) > 0 ||
      this.objectKeyCount(this.multipleMatches) > 0 ||
      this.notFound.length > 0;
  }

  clear(): void {
    this.inputText = '';
    this.resetResults();
  }

  resetResults(): void {
    this.oneToOneMatches = {};
    this.multipleMatches = {};
    this.notFound = [];
  }

  allMatches(): Array<GeneSummary> {
    let geneUniquenames = Object.values(this.oneToOneMatches);

    Object.keys(this.multipleMatches)
      .map(key => {
        const matches = this.multipleMatches[key];
        matches.map(geneSumm => geneUniquenames.push(geneSumm));
      });

    return geneUniquenames;
  }

  sendToQueryBuilder(): void {
    let geneUniquenames = this.allMatches();

    const part = new GeneListNode('genes from identifier mapping', geneUniquenames);
    const geneQuery = new GeneQuery(part);
    this.queryRouterService.gotoResults(geneQuery);
  }

  readFile($event: Event): void {
    let inputValue = $event.target as any;
    let file = inputValue.files[0];
    let fileReader = new FileReader();

    fileReader.onloadend = () => {
      this.inputText = fileReader.result as string;
    };

    fileReader.readAsText(file);
  }

  filteredIds(): Array<string> {
    let seen: Set<string> = new Set();
    return this.inputText.trim().split(/[,\s\u200B]+/)
      .filter(id => {
        id = id.trim();
        if (id.length === 0) {
          return false;
        }
        if (id.match(/[^a-zA-Z0-9\-_:\.]/)) {
          return false;
        }
        if (seen.has(id)) {
          return false;
        }
        seen.add(id);
        return true;
      })
  }

  lookup(): void {
    const ids = this.filteredIds();

    this.geneSummariesPromise
      .then(geneSummaries => {

        this.resetResults();

        if (!this.selectedMapperType) {
          return;
        }

        const lookupMap: { [key: string]: Array<GeneSummary> } = {};
        const lookupAdd = (key: string, geneSumm: GeneSummary) => {
          const lowerKey = key.toLowerCase();
          if (!lookupMap[lowerKey]) {
            lookupMap[lowerKey] = [];
          }
          lookupMap[lowerKey].push(geneSumm);
        };


        for (const geneSummary of geneSummaries) {
          if (this.selectedMapperType.id === 'uniprot') {
            if (geneSummary.uniprot_identifier) {
              lookupAdd(geneSummary.uniprot_identifier, geneSummary);
            }
          } else {
            if (this.selectedMapperType.taxonId) {
              geneSummary.orthologs.map(orth => {
                if (orth.taxonid == this.selectedMapperType.taxonId) {
                  const orthName = orth.name;

                  if (orthName) {
                    lookupAdd(orthName, geneSummary);
                  }

                  const orthIdentifier = orth.identifier;

                  if (orthIdentifier) {
                    lookupAdd(orthIdentifier, geneSummary);
                  }
                }
              });
            }
          }
        }

        ids.map((id: GeneUniquename) => {
          const lowerId = id.toLowerCase();
          const matchingGenes: Array<GeneSummary> = lookupMap[lowerId];

          if (matchingGenes) {
            if (matchingGenes.length == 1) {
              this.oneToOneMatches[id] = matchingGenes[0];
            } else {
              this.multipleMatches[id] = matchingGenes;
            }
          } else {
            this.notFound.push(id);
          }
        });
      });
  }

  ngOnInit(): void {
  }

}
