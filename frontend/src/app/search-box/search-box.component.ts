import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { PombaseAPIService, GeneSummary } from '../pombase-api.service';
import { CompleteService, SolrTermSummary, SolrRefSummary } from '../complete.service';

import { TypeaheadMatch } from 'ngx-bootstrap/typeahead/typeahead-match.class';
import { map, switchMap } from 'rxjs/operators';
import { combineLatest } from 'rxjs';

interface Model extends GeneSummary {
  searchData: string;
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

  geneSummaries: Array<GeneSummary> = [];

  constructor(private completeService: CompleteService,
              private pombaseApiService: PombaseAPIService,
              private router: Router) {
  }

  isInitialised(): boolean {
    return this.geneSummaries.length > 0;
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

  nameExactMatch(geneSumm: GeneSummary, value: string): DisplayModel {
    if (geneSumm.name && geneSumm.name.toLowerCase() === value) {
      return this.makeGeneDisplayModel(geneSumm.uniquename, geneSumm.name, null);
    }
    return null;
  }

  nameMatch(geneSumm: GeneSummary, value: string): DisplayModel {
    if (geneSumm.name && geneSumm.name.toLowerCase().indexOf(value) !== -1 &&
        (geneSumm.name.indexOf('-antisense-') === -1 ||
         value.indexOf('antisense') !== -1)) { // See #409
      return this.makeGeneDisplayModel(geneSumm.uniquename, geneSumm.name, null);
    } else {
      return null;
    }
  }

  identifierMatch(geneSumm: GeneSummary, value: string): DisplayModel {
    if (geneSumm.uniquename.toLowerCase().indexOf(value) !== -1) {
      return this.makeGeneDisplayModel(geneSumm.uniquename, geneSumm.name, null);
    } else {
      return null;
    }
  }

  antisenseNameMatch(geneSumm: GeneSummary, value: string): DisplayModel {
    if (geneSumm.name && geneSumm.name.toLowerCase().indexOf(value) !== -1 &&
        geneSumm.name.indexOf('-antisense-') !== -1 &&
        value.indexOf('antisense') === -1) { // See #409
      return this.makeGeneDisplayModel(geneSumm.uniquename, geneSumm.name, null);
    } else {
      return null;
    }
  }

  synonymMatch(geneSumm: GeneSummary, value: string): DisplayModel {
    for (let syn of geneSumm.synonyms) {
      if (syn.toLowerCase().indexOf(value) !== -1) {
        return this.makeGeneDisplayModel(geneSumm.uniquename, geneSumm.name, 'synonym: ' + syn);
      }
    }
    return null;
  }

  synonymExactMatch(geneSumm: GeneSummary, value: string): DisplayModel {
    for (let syn of geneSumm.synonyms) {
      if (syn.toLowerCase() === value) {
        return this.makeGeneDisplayModel(geneSumm.uniquename, geneSumm.name, 'synonym: ' + syn);
      }
    }
    return null;
  }

  orthologMatch(geneSumm: GeneSummary, value: string): DisplayModel {
    for (let orth of geneSumm.orthologs) {
      if (orth.identifier.toLowerCase().indexOf(value) !== -1) {
        return this.makeGeneDisplayModel(geneSumm.uniquename, geneSumm.name,
                                'ortholog: ' + orth.identifier);
      }
    }
    return null;
  }

  orthologExactMatch(geneSumm: GeneSummary, value: string): DisplayModel {
    for (let orth of geneSumm.orthologs) {
      if (orth.identifier.toLowerCase() === value) {
        return this.makeGeneDisplayModel(geneSumm.uniquename, geneSumm.name,
                                'ortholog: ' + orth.identifier);
      }
    }
    return null;
  }

  productMatch(geneSumm: GeneSummary, value: string): DisplayModel {
    if (geneSumm.product && geneSumm.product.toLowerCase().indexOf(value) !== -1) {
      return this.makeGeneDisplayModel(geneSumm.uniquename, geneSumm.name,
                              'product: ' + geneSumm.product);
    } else {
      return null;
    }
  }

  uniprotIdMatch(geneSumm: GeneSummary, value: string): DisplayModel {
    if (geneSumm.uniprot_identifier && geneSumm.uniprot_identifier.toLowerCase().indexOf(value) !== -1) {
      return this.makeGeneDisplayModel(geneSumm.uniquename, geneSumm.name,
                              'UniProt ID: ' + geneSumm.uniprot_identifier);
    } else {
      return null;
    }
  }

  containsMatch(matches: Array<DisplayModel>, match: DisplayModel): boolean {
    return matches.findIndex((element) => element.uniquename === match.uniquename) !== -1;
  }

  summariesFromToken(fieldValue: string): Array<DisplayModel> {
    if (this.geneSummaries) {
      let value = fieldValue.trim().toLowerCase();

      if (value.length > 0) {
        let filteredSummaries = [];
        for (let geneSumm of this.geneSummaries) {
          let match = this.nameExactMatch(geneSumm, value);
          if (match) {
            filteredSummaries.push(match);
          }
        }
        for (let geneSumm of this.geneSummaries) {
          let match = this.synonymExactMatch(geneSumm, value);
          if (match) {
            filteredSummaries.push(match);
          }
        }
        for (let geneSumm of this.geneSummaries) {
          let match = this.orthologExactMatch(geneSumm, value);
          if (match) {
            filteredSummaries.push(match);
          }
        }
        for (let geneSumm of this.geneSummaries) {
          let match = this.nameMatch(geneSumm, value);
          if (match && filteredSummaries.length < 20 &&
              !this.containsMatch(filteredSummaries, match)) {
            filteredSummaries.push(match);
          }
        }
        if (filteredSummaries.length < 20) {
          for (let geneSumm of this.geneSummaries) {
            let match = this.identifierMatch(geneSumm, value);
            if (match && filteredSummaries.length < 20) {
              filteredSummaries.push(match);
            }
          }
        }
        for (let geneSumm of this.geneSummaries) {
          let match = this.antisenseNameMatch(geneSumm, value);
          if (match && filteredSummaries.length < 20 &&
              !this.containsMatch(filteredSummaries, match)) {
            filteredSummaries.push(match);
          }
        }
        if (filteredSummaries.length < 20) {
          for (let geneSumm of this.geneSummaries) {
            let match = this.synonymMatch(geneSumm, value);
            if (match && filteredSummaries.length < 20 &&
                !this.containsMatch(filteredSummaries, match)) {
              filteredSummaries.push(match);
            }
          }
        }
        if (filteredSummaries.length < 20) {
          for (let geneSumm of this.geneSummaries) {
            let match = this.orthologMatch(geneSumm, value);
            if (match && filteredSummaries.length < 20 &&
                !this.containsMatch(filteredSummaries, match)) {
              filteredSummaries.push(match);
            }
          }
        }
        if (filteredSummaries.length < 20) {
          for (let geneSumm of this.geneSummaries) {
            let match = this.productMatch(geneSumm, value);
            if (match && filteredSummaries.length < 20 &&
                !this.containsMatch(filteredSummaries, match)) {
              filteredSummaries.push(match);
            }
          }
        }
        if (filteredSummaries.length < 20) {
          for (let geneSumm of this.geneSummaries) {
            let match = this.uniprotIdMatch(geneSumm, value);
            if (match && filteredSummaries.length < 20 &&
                !this.containsMatch(filteredSummaries, match)) {
              filteredSummaries.push(match);
            }
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
    const geneSummaryObservable = Observable.of(this.summariesFromToken(token));
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
        this.geneSummaries = summaries;

        let summaryCmp =
          (a, b) => {
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

        this.geneSummaries.sort(summaryCmp);
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
