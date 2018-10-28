import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';

import { PombaseAPIService, GeneSummary, IdAndOrganism } from '../pombase-api.service';
import { CompleteService, SolrTermSummary, SolrRefSummary } from '../complete.service';

import { TypeaheadMatch } from 'ngx-bootstrap/typeahead/typeahead-match.class';
import { map, switchMap } from 'rxjs/operators';
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
    public orthologs: Array<IdAndOrganism>) { }
}

class DisplayModel {
  constructor(public matchType: string,
              public uniquename: string,
              public name: string,
              public otherDetails: string) {
    if (this.name && this.name.length > 50) {
      this.name = this.name.slice(0, 48) + '...';
    }
  }
}

const CV_NAMES_FOR_TERM_COMPLETE =
  '(molecular_function OR biological_process OR cellular_component OR ' +
  'fission_yeast_phenotype)';

@Component({
  selector: 'app-search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.css']
})
export class SearchBoxComponent implements OnInit {
  dataSource: Observable<Array<DisplayModel>>;
  noResults = true;

  fieldValue = '';

  searchSummaries: Array<SearchSummary> = [];

  constructor(private completeService: CompleteService,
              private pombaseApiService: PombaseAPIService,
              private router: Router) {
  }

  isInitialised(): boolean {
    return this.searchSummaries.length > 0;
  }

  makeGeneDisplayModel(uniquename: string, name: string, otherDetails: string): DisplayModel {
    return new DisplayModel('Matching genes:', uniquename, name, otherDetails);
  }

  makeTermDisplayModel(termResult: SolrTermSummary): DisplayModel {
    return new DisplayModel('Matching terms:', termResult.termid, termResult.name, null);
  }

  makeRefDisplayModel(refResult: SolrRefSummary): DisplayModel {
    return new DisplayModel('Matching publications:', refResult.pubmedid, refResult.title, refResult.citation);
  }

  nameExactMatch(geneSumm: SearchSummary, value: string): DisplayModel {
    if (geneSumm.nameLowerCase === value) {
      return this.makeGeneDisplayModel(geneSumm.uniquename, geneSumm.name, null);
    }
    return null;
  }

  nameMatch(geneSumm: SearchSummary, value: string): DisplayModel {
    if (geneSumm.nameLowerCase && geneSumm.nameLowerCase.indexOf(value) !== -1 &&
        (geneSumm.name.indexOf('-antisense-') === -1 ||
         value.indexOf('antisense') !== -1)) { // See #409
        return this.makeGeneDisplayModel(geneSumm.uniquename, geneSumm.name, null);
    } else {
      return null;
    }
  }

  identifierMatch(geneSumm: SearchSummary, value: string): DisplayModel {
    if (geneSumm.uniquenameLowerCase.indexOf(value) !== -1) {
      return this.makeGeneDisplayModel(geneSumm.uniquename, geneSumm.name, null);
    } else {
      return null;
    }
  }

  antisenseNameMatch(geneSumm: SearchSummary, value: string): DisplayModel {
    if (geneSumm.name && geneSumm.nameLowerCase.indexOf(value) !== -1 &&
        geneSumm.name.indexOf('-antisense-') !== -1 &&
        value.indexOf('antisense') === -1) { // See #409
        return this.makeGeneDisplayModel(geneSumm.uniquename, geneSumm.name, null);
    } else {
      return null;
    }
  }

  synonymMatch(geneSumm: SearchSummary, value: string): DisplayModel {
    const matchIndex = geneSumm.synonymsLowerCase.findIndex(syn => syn.indexOf(value) !== -1);
    if (matchIndex !== -1) {
      return this.makeGeneDisplayModel(geneSumm.uniquename, geneSumm.name,
                                       'synonym: ' + geneSumm.synonyms[matchIndex]);
    }
    return null;
  }

  synonymExactMatch(geneSumm: SearchSummary, value: string): DisplayModel {
    const matchIndex = geneSumm.synonymsLowerCase.findIndex(syn => syn === value);
    if (matchIndex !== -1) {
      return this.makeGeneDisplayModel(geneSumm.uniquename, geneSumm.name,
                                       'synonym: ' + geneSumm.synonyms[matchIndex]);
    }
    return null;
  }

  orthologMatch(geneSumm: SearchSummary, value: string): DisplayModel {
    for (let orth of geneSumm.orthologs) {
      if (orth.identifier.toLowerCase().indexOf(value) !== -1) {
        return this.makeGeneDisplayModel(geneSumm.uniquename, geneSumm.name,
                                         'ortholog: ' + orth.identifier);
      }
    }
    return null;
  }

  orthologExactMatch(geneSumm: SearchSummary, value: string): DisplayModel {
    for (let orth of geneSumm.orthologs) {
      if (orth.identifier.toLowerCase() === value) {
        return this.makeGeneDisplayModel(geneSumm.uniquename, geneSumm.name,
                                         'ortholog: ' + orth.identifier);
      }
    }
    return null;
  }

  productMatch(geneSumm: SearchSummary, value: string): DisplayModel {
    if (geneSumm.product && geneSumm.productLowerCase.indexOf(value) !== -1) {
      return this.makeGeneDisplayModel(geneSumm.uniquename, geneSumm.name,
                                       'product: ' + geneSumm.product);
    } else {
      return null;
    }
  }

  uniprotIdMatch(geneSumm: SearchSummary, value: string): DisplayModel {
    if (geneSumm.uniprotIdentifier && geneSumm.uniprotIdentifierLowerCase.indexOf(value) !== -1) {
      return this.makeGeneDisplayModel(geneSumm.uniquename, geneSumm.name,
                                       'UniProt ID: ' + geneSumm.uniprotIdentifier);
    } else {
      return null;
    }
  }

  containsMatch(matches: Array<DisplayModel>, match: DisplayModel): boolean {
    return matches.findIndex((element) => element.uniquename === match.uniquename) !== -1;
  }

  summariesFromToken(fieldValue: string): Array<DisplayModel> {
    if (this.searchSummaries) {
      let value = fieldValue.trim().toLowerCase();

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
          maybeAdd(this.orthologExactMatch(geneSumm, value));
        }
        for (let geneSumm of this.searchSummaries) {
          maybeAdd(this.nameMatch(geneSumm, value));
        }
        if (filteredSummaries.length < 20) {
          for (let geneSumm of this.searchSummaries) {
            maybeAdd(this.identifierMatch(geneSumm, value));
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
            maybeAdd(this.orthologMatch(geneSumm, value));
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
    return this.completeService.completeTermName(CV_NAMES_FOR_TERM_COMPLETE, token)
      .map((termResults: Array<SolrTermSummary>) =>
           termResults.map(termResult => this.makeTermDisplayModel(termResult)));
  }

  getRefMatches(token: string): Observable<Array<DisplayModel>> {
    return this.completeService.completeRef(token)
      .map((refResults: Array<SolrRefSummary>) =>
           refResults.map(refResult => this.makeRefDisplayModel(refResult)));
  }

  observableFromToken(token: string): Observable<Array<DisplayModel>> {
    const geneSummaryObservable = of(this.summariesFromToken(token));
    const termResultsObservable = this.getTermMatches(token);
    const refResultsObservable = this.getRefMatches(token);

    const combined =
      combineLatest(geneSummaryObservable, termResultsObservable, refResultsObservable)
      .map(([geneRes, termRes, refRes]) => {
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
      });
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
      });
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
                                 geneSumm.orthologs)
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

  enterPressed(e: any) {
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
