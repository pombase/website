import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, config } from 'rxjs';
import { map } from 'rxjs/operators';

import { PombaseAPIService, GeneSummary, IdAndOrganism, IdNameAndOrganism } from '../pombase-api.service';
import { CompleteService, SolrTermSummary, SolrRefSummary } from '../complete.service';
import { getAppConfig, ConfigOrganism } from '../config';

import { TypeaheadMatch } from 'ngx-bootstrap/typeahead/typeahead-match.class';
import { switchMap } from 'rxjs/operators';
import { combineLatest } from 'rxjs';

class SearchSummary {
  constructor(
    public uniquename: string,
    public uniquenameLowerCase: string,
    public name: string,
    public nameLowerCase: string,
    public product: string,
    public productLowerCase: string,
    public uniprotIdentifier: string,
    public uniprotIdentifierLowerCase: string,
    public synonyms: Array<string>,
    public synonymsLowerCase: Array<string>,
    public orthologs: Array<IdNameAndOrganism>,
    public organism: ConfigOrganism) { }
}

class DisplayModel {
  constructor(public matchType: string,
              public uniquename: string,
              public name: string,
              public otherDetails: Array<string>,
              public organism: ConfigOrganism = null) {
    if (this.name && this.name.length > 50) {
      this.name = this.name.slice(0, 48) + '...';
    }
  }
}

@Component({
  selector: 'app-search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.css']
})
export class SearchBoxComponent implements OnInit {
  dataSource: Observable<Array<DisplayModel>>;
  noResults = true;

  fieldValue = '';

  geneSummariesFailed = false;

  searchSummaries: Array<SearchSummary> = [];

  cvNamesForTermComplete = '(' + getAppConfig().searchBoxCvNames.join(' OR ') + ')';

  constructor(private completeService: CompleteService,
              private pombaseApiService: PombaseAPIService,
              private router: Router) {
  }

  isInitialised(): boolean {
    return this.searchSummaries.length > 0;
  }

  makeGeneDisplayModel(uniquename: string, name: string, otherDetailsArg: Array<string>, organism: ConfigOrganism): DisplayModel {
    let otherDetails: Array<string> = [...otherDetailsArg];
    if (getAppConfig().isMultiOrganismMode()) {
      const orgDetails =
        `<span class="search-box-organism">${organism.common_name}</span>`;
      otherDetails.unshift(orgDetails);
    }

    return new DisplayModel('Matching genes:', uniquename, name, otherDetails, organism);
  }

  highlightMatch(pos: number, searchString: string, target?: string): string {
    let start;
    let highlightBit;
    let rest;
    if (target) {
      start = target.substr(0, pos);
      highlightBit = target.substr(pos, searchString.length);
      rest = target.substr(pos + searchString.length);
    } else {
      start = '';
      highlightBit = searchString;
      rest = '';
    }
    return `${start}<span class="search-box-highlight">${highlightBit}</span>${rest}`;
  }

  makeTermDisplayModel(termResult: SolrTermSummary): DisplayModel {
    return new DisplayModel('Matching terms:', termResult.termid, termResult.name, null);
  }

  makeRefDisplayModel(refResult: SolrRefSummary): DisplayModel {
    return new DisplayModel('Matching publications:', refResult.pubmedid, refResult.title, [refResult.citation]);
  }

  nameExactMatch(geneSumm: SearchSummary, value: string): DisplayModel {
    if (geneSumm.nameLowerCase === value) {
      return this.makeGeneDisplayModel(geneSumm.uniquename, geneSumm.name, [], geneSumm.organism);
    }
    return null;
  }

  nameMatch(geneSumm: SearchSummary, value: string): DisplayModel {
    if (geneSumm.nameLowerCase && geneSumm.nameLowerCase.indexOf(value) !== -1 &&
        (geneSumm.name.indexOf('-antisense-') === -1 ||
         value.indexOf('antisense') !== -1)) { // See #409
        return this.makeGeneDisplayModel(geneSumm.uniquename, geneSumm.name, [], geneSumm.organism);
    } else {
      return null;
    }
  }

  identifierMatch(geneSumm: SearchSummary, value: string): DisplayModel {
    if (geneSumm.uniquenameLowerCase.indexOf(value) !== -1) {
      return this.makeGeneDisplayModel(geneSumm.uniquename, geneSumm.name, [], geneSumm.organism);
    } else {
      return null;
    }
  }

  antisenseNameMatch(geneSumm: SearchSummary, value: string): DisplayModel {
    if (geneSumm.name && geneSumm.nameLowerCase.indexOf(value) !== -1 &&
        geneSumm.name.indexOf('-antisense-') !== -1 &&
        value.indexOf('antisense') === -1) { // See #409
        return this.makeGeneDisplayModel(geneSumm.uniquename, geneSumm.name, [], geneSumm.organism);
    } else {
      return null;
    }
  }

  synonymMatch(geneSumm: SearchSummary, value: string): DisplayModel {
    const matchIndex = geneSumm.synonymsLowerCase.findIndex(syn => syn.indexOf(value) !== -1);
    if (matchIndex !== -1) {
      const highlightedMatch = this.highlightMatch(0, geneSumm.synonyms[matchIndex]);
      return this.makeGeneDisplayModel(geneSumm.uniquename, geneSumm.name,
                                       ['synonym: ' + highlightedMatch],
                                       geneSumm.organism);
    }
    return null;
  }

  synonymExactMatch(geneSumm: SearchSummary, value: string): DisplayModel {
    const matchIndex = geneSumm.synonymsLowerCase.findIndex(syn => syn === value);
    if (matchIndex !== -1) {
      const highlightedMatch = this.highlightMatch(0, geneSumm.synonyms[matchIndex]);
      return this.makeGeneDisplayModel(geneSumm.uniquename, geneSumm.name,
                                       ['synonym: ' + highlightedMatch],
                                       geneSumm.organism);
    }
    return null;
  }

  orthologMatch(geneSumm: SearchSummary, value: string, exactness: 'exact'|'sub-string'): DisplayModel {
    interface FieldAndOrth {
      matchingFieldValue: string;
      orth: IdNameAndOrganism;
    }

    let matchingOrthologs: Array<FieldAndOrth> = [];

    if (exactness === 'exact') {
      for (const orth of geneSumm.orthologs) {
        if (orth.name && orth.name.toLowerCase() === value) {
          matchingOrthologs.push({ matchingFieldValue: orth.name, orth });
        } else {
          if (orth.identifier.toLowerCase() === value) {
            matchingOrthologs.push({ matchingFieldValue: orth.identifier, orth });
          }
        }
      }
    } else {
      for (const orth of geneSumm.orthologs) {
        if (orth.name && orth.name.toLowerCase().indexOf(value) !== -1) {
          matchingOrthologs.push({ matchingFieldValue: orth.name, orth });
          break;
        } else {
          if (orth.identifier.toLowerCase().indexOf(value) !== -1) {
            matchingOrthologs.push({ matchingFieldValue: orth.identifier, orth });
            break;
          }
        }
      }
    }

    if (matchingOrthologs.length > 0) {
      const details =
        matchingOrthologs.map(({ matchingFieldValue, orth })  => {
          const orgDetails = getAppConfig().getOrganismByTaxonid(orth.taxonid);
          const commonNameSpan = `<span class="search-box-organism">(${orgDetails.common_name})</span>`;
          return `ortholog: ${this.highlightMatch(0, matchingFieldValue)} ${commonNameSpan}`;
        });
      return this.makeGeneDisplayModel(geneSumm.uniquename, geneSumm.name,
        details, geneSumm.organism);
    }

    return null;
  }

  productMatch(geneSumm: SearchSummary, value: string): DisplayModel {
    if (geneSumm.product) {
      const pos = geneSumm.productLowerCase.indexOf(value);
      if (pos !== -1) {
        const highlightedMatch = this.highlightMatch(pos, value, geneSumm.product);
        return this.makeGeneDisplayModel(geneSumm.uniquename, geneSumm.name,
                                         ['product: ' + highlightedMatch],
                                         geneSumm.organism);
      }
    }
    return null;
  }

  uniprotIdMatch(geneSumm: SearchSummary, value: string): DisplayModel {
    if (geneSumm.uniprotIdentifier) {
      const pos = geneSumm.uniprotIdentifierLowerCase.indexOf(value);

      if (pos !== -1) {
        const highlightedMatch = this.highlightMatch(pos, value, geneSumm.uniprotIdentifier);
        return this.makeGeneDisplayModel(geneSumm.uniquename, geneSumm.name,
                                         ['UniProt ID: ' + highlightedMatch],
                                         geneSumm.organism);
      }
    }
    return null;
  }

  containsMatch(matches: Array<DisplayModel>, match: DisplayModel): boolean {
    return matches.findIndex((element) => element.uniquename === match.uniquename) !== -1;
  }

  summariesFromToken(fieldValue: string): Array<DisplayModel> {
    if (this.searchSummaries) {
      let value = fieldValue.trim().toLowerCase();

      value = value.replace(/\s+gene$/i, '');
      value = value.replace(/^gene\s+/i, '');

      if (value.length > 0) {
        let filteredSummaries: Array<DisplayModel> = [];

        const maybeAdd = (match: DisplayModel) => {
          if (match && filteredSummaries.length < 20 &&
              !this.containsMatch(filteredSummaries, match)) {
            filteredSummaries.push(match);
          }
        };

        for (let geneSumm of this.searchSummaries) {
          maybeAdd(this.nameExactMatch(geneSumm, value));
        }
        for (let geneSumm of this.searchSummaries) {
          maybeAdd(this.synonymExactMatch(geneSumm, value));
        }
        for (let geneSumm of this.searchSummaries) {
          maybeAdd(this.orthologMatch(geneSumm, value, 'exact'));
        }
        for (let geneSumm of this.searchSummaries) {
          maybeAdd(this.nameMatch(geneSumm, value));
        }
        if (filteredSummaries.length < 20) {
          let valueNoSuffixes = value;
          const suffixesToTrim = getAppConfig().searchBoxConfig.suffixes_to_trim;
          if (suffixesToTrim) {
            suffixesToTrim.map(suff => {
              valueNoSuffixes = valueNoSuffixes.replace(new RegExp(suff + '$'), '');
            });
          }
          for (let geneSumm of this.searchSummaries) {
            maybeAdd(this.identifierMatch(geneSumm, valueNoSuffixes));
          }
        }
        for (let geneSumm of this.searchSummaries) {
          maybeAdd(this.antisenseNameMatch(geneSumm, value));
        }
        if (filteredSummaries.length < 20) {
          for (let geneSumm of this.searchSummaries) {
            maybeAdd(this.synonymMatch(geneSumm, value));
          }
        }
        if (filteredSummaries.length < 20) {
          for (let geneSumm of this.searchSummaries) {
            maybeAdd(this.orthologMatch(geneSumm, value, 'sub-string'));
          }
        }
        if (filteredSummaries.length < 20) {
          for (let geneSumm of this.searchSummaries) {
            maybeAdd(this.productMatch(geneSumm, value));
          }
        }
        if (filteredSummaries.length < 20) {
          for (let geneSumm of this.searchSummaries) {
            maybeAdd(this.uniprotIdMatch(geneSumm, value));
          }
        }
        return filteredSummaries;
      }
    }
    return [];
  }

  getTermMatches(token: string): Observable<Array<DisplayModel>> {
    return this.completeService.completeTermName(this.cvNamesForTermComplete, token)
      .pipe(map((termResults: Array<SolrTermSummary>) =>
           termResults.map(termResult => this.makeTermDisplayModel(termResult))));
  }

  getRefMatches(token: string): Observable<Array<DisplayModel>> {
    return this.completeService.completeRef(token)
      .pipe(map((refResults: Array<SolrRefSummary>) =>
           refResults.map(refResult => this.makeRefDisplayModel(refResult))));
  }

  observableFromToken(token: string): Observable<Array<DisplayModel>> {
    const geneSummaryObservable = of(this.summariesFromToken(token));
    const termResultsObservable = this.getTermMatches(token);
    const refResultsObservable = this.getRefMatches(token);

    const combined =
      combineLatest(geneSummaryObservable, termResultsObservable, refResultsObservable)
        .pipe(
          map(([geneRes, termRes, refRes]) => {
            const maxGenes = 8;
            const maxTerms = 5;
            const geneCount = geneRes.length;
            const termCount = termRes.length;
            let refCount = 3;
            if (geneCount + termCount < maxGenes + maxTerms) {
              refCount += (maxGenes + maxTerms) - (geneCount + termCount);
            }
            return [...geneRes.slice(0, maxGenes), ...termRes.slice(0, maxTerms),
            ...refRes.slice(0, refCount)];
          }));
    return combined;
  }

  getDataSource(): Observable<Array<DisplayModel>> {
    return Observable.create((observer: any) => {
      // Runs on every search
      observer.next(this.fieldValue);
    })
      .pipe(
        switchMap((token: string) => this.observableFromToken(token))
      );
  }

  ngOnInit() {
    this.dataSource = this.getDataSource();

    this.pombaseApiService.getGeneSummariesPromise()
      .then(summaries => {
        this.searchSummaries = this.makeSearchSummaries(summaries);

        let summaryCmp =
          (a: SearchSummary, b: SearchSummary) => {
            if (a.name) {
              if (b.name) {
                return a.name.localeCompare(b.name);
              } else {
                return -1;
              }
            } else {
              if (b.name) {
                return 1;
              } else {
                return a.uniquename.localeCompare(b.uniquename);
              }
            }
          };

        this.searchSummaries.sort(summaryCmp);
      })
      .catch(reason => this.geneSummariesFailed = true);
  }

  makeSearchSummaries(summaries: Array<GeneSummary>): Array<SearchSummary> {
    return summaries
      .map(geneSumm => {
        const nameLowerCase =
          geneSumm.name ? geneSumm.name.toLowerCase() : undefined;
        const productLowerCase =
          geneSumm.product ? geneSumm.product.toLowerCase() : undefined;
        const uniprotIdentifierLowerCase =
          geneSumm.uniprot_identifier ? geneSumm.uniprot_identifier.toLowerCase() : undefined;

        return new SearchSummary(geneSumm.uniquename,
                                 geneSumm.uniquename.toLowerCase(),
                                 geneSumm.name, nameLowerCase,
                                 geneSumm.product, productLowerCase,
                                 geneSumm.uniprot_identifier, uniprotIdentifierLowerCase,
                                 geneSumm.synonyms, geneSumm.synonyms.map(syn => syn.toLowerCase()),
                                 geneSumm.orthologs, geneSumm.organism)
      });
  }

  public typeaheadOnSelect(e: TypeaheadMatch): void {
    if (e.item.matchType.toLowerCase().includes('gene')) {
      this.router.navigate(['/gene', e.item.uniquename]);
    } else {
      if (e.item.matchType.toLowerCase().includes('term')) {
        this.router.navigate(['/term', e.item.uniquename]);
      } else {
        this.router.navigate(['/reference', e.item.uniquename]);
      }
    }
    this.clearBox();
  }

  public typeaheadNoResults(e: boolean) {
    this.noResults = e;
  }

  matchesReference(value: string): boolean {
    return value.match(/^\s*(?:(PMID|GO_REF):)?\d\d\d+\s*$/) != null;
  }

  matchesTerm(value: string): boolean {
    return value.match(/^\s*[a-zA-Z_]+:\d\d\d+\s*$/) != null;
  }

  clearBox(): void {
    this.fieldValue = '';
  }

  enterPressed() {
    let trimmedValue = this.fieldValue;
    if (this.matchesReference(trimmedValue)) {
      let pmid = trimmedValue;
      if (!pmid.startsWith('PMID:')) {
        pmid = 'PMID:' + pmid;
      }
      this.clearBox()
      this.router.navigate(['/reference', pmid]);
    } else {
      if (this.matchesTerm(trimmedValue)) {
        this.clearBox()
        this.router.navigate(['/term', trimmedValue]);
      }
    }
  }

  noMatchingGenes(): boolean {
    return this.noResults && this.fieldValue.length > 0;
  }
}
