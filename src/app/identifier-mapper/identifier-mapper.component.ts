import { Component, OnInit } from '@angular/core';
import { GeneUniquename, GeneListNode, GeneQuery } from '../pombase-query';

import { PombaseAPIService, GeneSummary, GeneSummaryMap } from '../pombase-api.service';
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
  filteredIds: Array<string> = [];
  selectedMapperType: MapperType = null;
  geneSummaryMapPromise: Promise<GeneSummaryMap> = null;
  geneSummaryMap: GeneSummaryMap = null;
  uniprotType: MapperType = {
    id: 'uniprot',
    taxonId: null,
    displayName: 'UniProt',
  };
  mapperTypes: Array<MapperType> = [];
  organismCommonName = this.appConfig.getConfigOrganism().common_name;

  oneToOneMatches: { [id: string]: GeneSummary } = {};
  // eg. human PBRM1 -> pombe rsc4 and rsc1
  oneToManyMatches: { [id: string]: Array<GeneSummary> } = {};
  // eg. human ACTA1, ACTA2, ACTA2 etc <- pombe act1 (SPBC32H8.12c)
  manyToOneMatches: { [id: string]: Array<string> } = {};
  notFound: Array<string> = [];

  constructor(private pombaseApiService: PombaseAPIService,
              private queryRouterService: QueryRouterService) {
    this.geneSummaryMapPromise =
      this.pombaseApiService.getGeneSummaryMapPromise();

    this.geneSummaryMapPromise
      .then(summaryMap => {
        this.geneSummaryMap = summaryMap;
      });

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

  lookupDone(): boolean {
    return this.objectKeyCount(this.oneToOneMatches) > 0 ||
      this.objectKeyCount(this.oneToManyMatches) > 0 ||
      this.objectKeyCount(this.manyToOneMatches) > 0 ||
      this.notFound.length > 0;
  }

  hasMatches(): boolean {
    return this.objectKeyCount(this.oneToOneMatches) > 0 ||
      this.objectKeyCount(this.oneToManyMatches) > 0 ||
      this.objectKeyCount(this.manyToOneMatches) > 0;
  }

  clear(): void {
    this.inputText = '';
    this.filteredIds = [];
    this.resetResults();
  }

  resetResults(): void {
    this.oneToOneMatches = {};
    this.oneToManyMatches = {};
    this.notFound = [];
    this.manyToOneMatches = {};
  }

  allMatches(): Array<GeneSummary> {
    let genes = Object.values(this.oneToOneMatches);

    Object.keys(this.oneToManyMatches)
      .map(key => {
        const matches = this.oneToManyMatches[key];
        matches.map(geneSumm => genes.push(geneSumm));
      });

    Object.keys(this.manyToOneMatches)
      .map(geneUniquename => {
        const gene = this.geneSummaryMap[geneUniquename];
        genes.push(gene);
      });

    return genes;
  }

  sendToQueryBuilder(): void {
    let geneUniquenames = this.allMatches();

    const part = new GeneListNode('genes from identifier mapping',
                                  geneUniquenames);
    const geneQuery = new GeneQuery(part);
    this.queryRouterService.gotoResults(geneQuery);
  }

  readFile($event: Event): void {
    let inputValue = $event.target as any;
    let file = inputValue.files[0];

    if (!file) {
      return;
    }

    let fileReader = new FileReader();

    fileReader.onloadend = () => {
      this.inputText = fileReader.result as string;
      this.inputTextChanged(this.inputText);
    };

    fileReader.readAsText(file);
  }

  filterIds(inputText: string): Array<string> {
    let seen: Set<string> = new Set();
    return inputText.trim().split(/[,\s\u200B]+/)
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

  inputTextChanged(inputText: string): void {
    this.filteredIds = this.filterIds(inputText);
  }

  lookup(): void {
    const ids = this.filterIds(this.inputText);

    this.geneSummaryMapPromise
      .then(summaryMap => {
        this.resetResults();

        if (!this.selectedMapperType) {
          return;
        }

        const lookupMap: { [key: string]: Array<GeneSummary> } = {};
        const lookupAdd = (key: string, geneSumm: GeneSummary) => {
          const lowerKey = key.toLowerCase();
          if (lookupMap[lowerKey]) {
            if (lookupMap[lowerKey]
                .filter(el => {
                  return geneSumm.uniquename === el.uniquename;
                })
                .length > 0) {
              return;
            }
          } else {
            lookupMap[lowerKey] = [];
          }
          lookupMap[lowerKey].push(geneSumm);
        };


        for (const geneSummary of Object.values(summaryMap)) {
          if (this.selectedMapperType.id === 'uniprot') {
            if (geneSummary.uniprot_identifier) {
              lookupAdd(geneSummary.uniprot_identifier, geneSummary);
            }
          } else {
            if (this.selectedMapperType.taxonId) {
              geneSummary.orthologs.map(orth => {
                if (orth.taxonid === this.selectedMapperType.taxonId) {
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

        let allToAllMatches: { [key: string]: Set<string> } = {};

        ids.map((id: GeneUniquename) => {
          const lowerId = id.toLowerCase();
          const matchingGenes: Array<GeneSummary> = lookupMap[lowerId];

          if (matchingGenes) {
            if (matchingGenes.length === 1) {
              this.oneToOneMatches[id] = matchingGenes[0];
            } else {
              this.oneToManyMatches[id] = matchingGenes;
            }

            matchingGenes.map(matchedGene => {
              if (!allToAllMatches[matchedGene.uniquename]) {
                allToAllMatches[matchedGene.uniquename] = new Set();
              }
              allToAllMatches[matchedGene.uniquename].add(id);
            })
          } else {
            this.notFound.push(id);
          }
        });

        Object.keys(allToAllMatches).map(uniquename => {
          const matches = Array.from(allToAllMatches[uniquename]);
          if (matches.length > 1) {
            this.manyToOneMatches[uniquename] = matches;

            console.log(this.oneToOneMatches);

            matches.map(queryId => {
              console.log(queryId);

              delete this.oneToOneMatches[queryId];
            });
          }
        });

      });
  }

  ngOnInit(): void {
  }

}
