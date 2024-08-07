import { Injectable } from '@angular/core';
import { AppConfig, getAppConfig } from './config';

import { GeneSummary, GeneSummaryMap, PombaseAPIService } from './pombase-api.service';
import { GeneUniquename } from './pombase-query';

export interface MapperType {
  id: string;
  taxonId: number|null;
  displayName: string;
  displayNameWithExamples: string;
};

const localStorageIdsKey = 'pombase-identifier-mapping-ids-history-v1';
const localStorageTypeKey = 'pombase-identifier-mapping-type-history-v1';

const organismCommonName = getAppConfig().getConfigOrganism().common_name;


@Injectable({
  providedIn: 'root'
})
export class IdentifierMapperService {
  private _inputText: string;

  appConfig: AppConfig = getAppConfig();

  private uniprotType: MapperType = {
    id: 'uniprot',
    taxonId: null,
    displayName: 'UniProt',
    displayNameWithExamples: organismCommonName + ' UniProt accessions (e.g. P04551)',
  };

  private _mapperTypes: Array<MapperType> = [];

  private summaryMap: GeneSummaryMap;
  private _filteredIds: Array<string> = [];
  private geneSummaryMapPromise: Promise<GeneSummaryMap>;

  private _oneToOneMatches: { [id: string]: GeneSummary } = {};
  // eg. human PBRM1 -> pombe rsc4 and rsc1
  private _oneToManyMatches: { [id: string]: Array<GeneSummary> } = {};
  // eg. human ACTA1, ACTA2, ACTA2 etc <- pombe act1 (SPBC32H8.12c)
  private _manyToOneMatches: { [id: string]: Array<string> } = {};
  private _manyToManyMatches: Array<[Set<string>, Set<GeneSummary>]> = [];
  private _notFound: Array<string> = [];
  private _mapperType: MapperType;

  private readyResolve: () => void;
  private readyPromise: Promise<void> =
    new Promise((resolve, _) => {
      this.readyResolve = () => {
        resolve();
      }
    });

  constructor(private pombaseApiService: PombaseAPIService) {
    this._mapperTypes = [this.uniprotType];

    this.geneSummaryMapPromise = this.pombaseApiService.getGeneSummaryMapPromise();

    for (const orthTaxonId of this.appConfig.ortholog_taxonids) {
      this.appConfig.organisms
        .map(org => {
          if (org.taxonid === orthTaxonId) {
            const displayName = org.common_name;
            const displayNameWithExamples = displayName +
              ' (e.g. ' + org.example_gene_identifiers.join(' or ') + ')';
            this._mapperTypes.push({
              id: 'ortholog' + org.taxonid,
              taxonId: org.taxonid,
              displayName,
              displayNameWithExamples,
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

  public resultsReady(): Promise<void> {
    return this.readyPromise;
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
        this.readyResolve();
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

  public hasMatches(): boolean {
    return this.allMatchesCount() > 0;
  }

  public resetResults(): void {
    this._notFound = [];
    this._oneToOneMatches = {};
    this._oneToManyMatches = {};
    this._manyToOneMatches = {};
    this._manyToManyMatches = [];
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

  public manyToManyMatches(): Array<[Set<string>, Set<GeneSummary>]> {
    return this._manyToManyMatches;
  }

  public hasManyToManyMatches(): boolean {
    return this.manyToManyMatches().length > 0;
  }

  private filterIds(inputText: string): Array<string> {
    let seen: Set<string> = new Set();
    return inputText.trim().split(/[^a-zA-Z0-9\-_:\.]+/)
      .filter(id => {
        id = id.trim();
        if (id.length === 0) {
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

              const orthSecondaryIdentifier = orth.secondary_identifier;

              if (orthSecondaryIdentifier) {
                lookupAdd(orthSecondaryIdentifier, geneSummary);
              }
            }
          });
        }
      }
    }

    // could be 1-1 or 1-many:
    let oneToSomeMatches: { [key: string]: Set<string> } = {};

    ids.map((id: string) => {
      const lowerId = id.toLowerCase();
      const matchingGenes = lookupMap[lowerId];

      if (matchingGenes) {
        if (matchingGenes.length === 1) {
          this._oneToOneMatches[id] = matchingGenes[0];
        } else {
          this._oneToManyMatches[id] = matchingGenes;
        }

        matchingGenes.map(matchedGene => {
          if (!oneToSomeMatches[matchedGene.uniquename]) {
            oneToSomeMatches[matchedGene.uniquename] = new Set();
          }
          oneToSomeMatches[matchedGene.uniquename].add(id);
        })
      } else {
        this._notFound.push(id);
      }
    });

    Object.keys(oneToSomeMatches).map(uniquename => {
      const matches = Array.from(oneToSomeMatches[uniquename]);
      if (matches.length > 1) {
        this._manyToOneMatches[uniquename] = matches;

        matches.map(queryId => {
          delete this._oneToOneMatches[queryId];
        });
      }
    });

    let otherOrgSeenIds: { [id: string]: boolean } = {};

    ONE_TO_MANY:
    for (const otherOrgId of Object.keys(this._oneToManyMatches)) {
      if (otherOrgSeenIds[otherOrgId]) {
        continue;
      }

      otherOrgSeenIds[otherOrgId] = true;

      let otherIdsForGroup = new Set<string>();
      let thisOrgSummariesForGroup = new Set<GeneSummary>();

      const thisOrgGeneSummaries = this._oneToManyMatches[otherOrgId];

      if (thisOrgGeneSummaries) {
        for (const thisOrgGeneSummary of thisOrgGeneSummaries) {
          thisOrgSummariesForGroup.add(thisOrgGeneSummary);
          const manyToOneIds = this._manyToOneMatches[thisOrgGeneSummary.uniquename];
          if (manyToOneIds) {
            for (const manyToOneOtherOrgId of manyToOneIds) {
              otherIdsForGroup.add(manyToOneOtherOrgId);
              otherOrgSeenIds[manyToOneOtherOrgId] = true;
            }
          } else {
            // it's not many-to-many
            continue ONE_TO_MANY;
          }
        }
      }

      this._manyToManyMatches.push([otherIdsForGroup, thisOrgSummariesForGroup]);
    }

    for (const [otherIds, geneSummaries] of this._manyToManyMatches) {
      otherIds.forEach(otherId => {
        delete this._oneToManyMatches[otherId];
      });
      geneSummaries.forEach(geneSummary => {
        delete this._manyToOneMatches[geneSummary.uniquename];
      });
    }
  }

  private oneToManyMatchesCount(): number {
    let count = 0;

    for (const id of Object.keys(this._oneToManyMatches)) {
      count += this._oneToManyMatches[id].length;
    }

    return count;
  }

  private manyToManyMatchesCount(): number {
    let count = 0;

    for (const [_, geneSummaries] of this._manyToManyMatches) {
      count += geneSummaries.size;
    }

    return count;
  }

  public allMatchesCount(): number {
    return Object.keys(this._oneToOneMatches).length +
      this.oneToManyMatchesCount() +
      Object.keys(this._manyToOneMatches).length +
      this.manyToManyMatchesCount();
  }

  public allMatches(): Array<GeneUniquename> {
    const seen = new Set<GeneUniquename>();

    Object.values(this.oneToOneMatches())
      .map((gene) => {
        seen.add(gene.uniquename);
      })

    Object.keys(this.oneToManyMatches())
      .map(key => {
        const matches = this.oneToManyMatches()[key];
        matches.map(geneSumm => seen.add(geneSumm.uniquename));
      });

    Object.keys(this.manyToOneMatches())
      .map(geneUniquename => {
        seen.add(geneUniquename);
      });

    for (const [_, matches] of this._manyToManyMatches) {
      matches.forEach(geneSumm => seen.add(geneSumm.uniquename));
    }

    return Array.from(seen);
  }
}
