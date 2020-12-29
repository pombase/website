import { Injectable } from '@angular/core';
import { AppConfig, getAppConfig } from './config';

import { GeneSummary, GeneSummaryMap, PombaseAPIService } from './pombase-api.service';
import { GeneUniquename } from './pombase-query';


export interface MapperType {
  id: string;
  taxonId: number|null;
  displayName: string;
};

const localStorageIdsKey = 'pombase-identifier-mapping-ids-history-v1';
const localStorageTypeKey = 'pombase-identifier-mapping-type-history-v1';

@Injectable({
  providedIn: 'root'
})
export class IdentifierMapperService {
  private _inputText: string = null;

  appConfig: AppConfig = getAppConfig();

  private uniprotType: MapperType = {
    id: 'uniprot',
    taxonId: null,
    displayName: 'UniProt',
  };
  private _mapperTypes: Array<MapperType> = [];

  private summaryMap: GeneSummaryMap;
  private _filteredIds: Array<string> = [];
  private geneSummaryMapPromise: Promise<GeneSummaryMap> = null;

  private _oneToOneMatches: { [id: string]: GeneSummary } = {};
  // eg. human PBRM1 -> pombe rsc4 and rsc1
  private _oneToManyMatches: { [id: string]: Array<GeneSummary> } = {};
  // eg. human ACTA1, ACTA2, ACTA2 etc <- pombe act1 (SPBC32H8.12c)
  private _manyToOneMatches: { [id: string]: Array<string> } = {};
  private _notFound: Array<string> = [];
  private _mapperType: MapperType;

  constructor(private pombaseApiService: PombaseAPIService) {
    this._mapperTypes = [this.uniprotType];

    this.geneSummaryMapPromise = this.pombaseApiService.getGeneSummaryMapPromise();

    for (const orthTaxonId of this.appConfig.ortholog_taxonids) {
      this.appConfig.organisms
        .map(org => {
          if (org.taxonid === orthTaxonId) {
            this._mapperTypes.push({
              id: 'ortholog' + org.taxonid,
              taxonId: org.taxonid,
              displayName: org.common_name
            });
          }
        });
    }

    this._mapperType = this.uniprotMapperType();

    this._inputText = localStorage.getItem(localStorageIdsKey) || '';
    this._filteredIds = this.filterIds(this._inputText);

    const storedMapperTypeId = localStorage.getItem(localStorageTypeKey);

    if (storedMapperTypeId) {
      this._mapperTypes.map(mapperType => {
        if (mapperType.id === storedMapperTypeId) {
          this._mapperType = mapperType;
        }
      });
    }

    if (storedMapperTypeId && this._filteredIds.length > 0) {
      this.lookup();
    }
  }

  public uniprotMapperType(): MapperType {
    return this.uniprotType;
  }

  public mapperTypes(): Array<MapperType> {
    return this._mapperTypes;
  }

  public lookup(): Promise<void> {
    return this.geneSummaryMapPromise
      .then(summaryMap => {
        this.summaryMap = summaryMap;
        this.lookupHelper(this._mapperType, this._filteredIds);
      });
  }

  public set mapperType(mapperType: MapperType) {
    this._mapperType = mapperType;

    localStorage.setItem(localStorageTypeKey, mapperType.id)
  }

  public get mapperType(): MapperType {
    return this._mapperType;
  }

  public set inputText(inputText: string) {
    this._inputText = inputText || '';

    localStorage.setItem(localStorageIdsKey, this._inputText);
    this._filteredIds = this.filterIds(this._inputText);
  }

  public get inputText(): string {
    return this._inputText;
  }

  public filteredIds(): Array<string> {
    return this._filteredIds;
  }

  hasMatches(): boolean {
    return Object.keys(this._oneToOneMatches).length > 0 ||
      Object.keys(this._oneToManyMatches).length > 0 ||
      Object.keys(this._manyToOneMatches).length > 0;
  }

  resetResults(): void {
    this._oneToOneMatches = {};
    this._oneToManyMatches = {};
    this._notFound = [];
    this._manyToOneMatches = {};
  }

  public notFound(): Array<string> {
    return this._notFound;
  }

  public oneToOneMatches(): { [id: string]: GeneSummary } {
    return this._oneToOneMatches;
  }

  public hasOneToOneMatches(): boolean {
    return Object.keys(this.oneToOneMatches()).length > 0;
  }

  public oneToManyMatches(): { [id: string]: Array<GeneSummary> } {
    return this._oneToManyMatches;
  }

  public hasOneToManyMatches(): boolean {
    return Object.keys(this.oneToManyMatches()).length > 0;
  }

  public manyToOneMatches(): { [id: string]: Array<string> } {
    return this._manyToOneMatches;
  }

  public hasManyToOneMatches(): boolean {
    return Object.keys(this.manyToOneMatches()).length > 0;
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

  private lookupHelper(mapperType: MapperType, ids: Array<string>) {
    this.resetResults();

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


    for (const geneSummary of Object.values(this.summaryMap)) {
      if (mapperType.id === 'uniprot') {
        if (geneSummary.uniprot_identifier) {
          lookupAdd(geneSummary.uniprot_identifier, geneSummary);
        }
      } else {
        if (mapperType.taxonId) {
          geneSummary.orthologs.map(orth => {
            if (orth.taxonid === mapperType.taxonId) {
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
          this._oneToOneMatches[id] = matchingGenes[0];
        } else {
          this._oneToManyMatches[id] = matchingGenes;
        }

        matchingGenes.map(matchedGene => {
          if (!allToAllMatches[matchedGene.uniquename]) {
            allToAllMatches[matchedGene.uniquename] = new Set();
          }
          allToAllMatches[matchedGene.uniquename].add(id);
        })
      } else {
        this._notFound.push(id);
      }
    });

    Object.keys(allToAllMatches).map(uniquename => {
      const matches = Array.from(allToAllMatches[uniquename]);
      if (matches.length > 1) {
        this._manyToOneMatches[uniquename] = matches;

        matches.map(queryId => {
          delete this._oneToOneMatches[queryId];
        });
      }
    });
  }

}
