import { Component, OnInit } from '@angular/core';

import { SolrSearchService, SolrSearchResults } from '../solr-search.service';
import { PombaseAPIService, GeneSummaryMap } from '../pombase-api.service';
import { Subscription, Subject } from 'rxjs';
import { debounceTime, map, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { SettingsService } from '../settings.service';

enum SearchState {
  ShowHelp = 0,
  TooShort = 1,
  Searching = 2,
  NoResults = 3,
  SomeResults = 5,
}

@Component({
  selector: 'app-faceted-search',
  templateUrl: './faceted-search.component.html',
  styleUrls: ['./faceted-search.component.css']
})
export class FacetedSearchComponent implements OnInit {
  geneSummaries: GeneSummaryMap = null;
  query = '';
  SearchState = SearchState;
  searchState: SearchState = SearchState.ShowHelp;
  results: SolrSearchResults = null;

  private solrSub: Subscription = null;
  private trimmedQuery = '';
  private queryChanged: Subject<string> = new Subject<string>();

  constructor(private pombaseApiService: PombaseAPIService,
              private settingsService: SettingsService,
              private solrSearch: SolrSearchService) {

    pombaseApiService.getGeneSummaryMapPromise()
      .then(geneSummaries => this.geneSummaries = geneSummaries);

    this.solrSub = this.queryChanged.pipe(
      map(query => {
        this.trimmedQuery = '';
        let trimmed = query.trim();
        if (trimmed.length === 0) {
          this.searchState = SearchState.ShowHelp;
        } else {
          if (trimmed.length <= 2) {
            this.searchState = SearchState.TooShort;
          }
        }
        this.trimmedQuery = trimmed;
        settingsService.currentSearchText = trimmed;
        return trimmed;
      }),
      debounceTime(250),
      distinctUntilChanged(),
      switchMap(query => this.solrSearch.search(query)))
      .subscribe((results: SolrSearchResults) => {
        if (results.status === 'Ok') {
          this.results = results;
          this.processResults(this.results);
          if (results.term_matches.length > 0 || results.ref_matches.length > 0 ||
            results.doc_matches.length > 0) {
            this.searchState = SearchState.SomeResults;
          } else {
            this.searchState = SearchState.NoResults;
          }
        } else {
          this.results = null;
          this.searchState = SearchState.NoResults;
        }
      },
        err => {
          this.searchState = SearchState.ShowHelp;
          console.error(err);
        });
  }

  processResults(results: SolrSearchResults): void {
    results.ref_matches.map(refMatch => {
      if (refMatch.hl.title) {
        refMatch.title = refMatch.hl.title[0];
      }
      if (refMatch.hl.citation) {
        refMatch.citation = refMatch.hl.citation[0];
      }
      if (refMatch.hl.title) {
        refMatch.title = refMatch.hl.title[0];
      }
    });
    results.term_matches.map(termMatch => {
      if (termMatch.hl.name) {
        termMatch.name = termMatch.hl.name[0];
      }
    });
  }

  queryChange(query: string): void {
    this.queryChanged.next(query);
  }

  resetSearch(): void {
    this.query = '';
    this.queryChange('');
  }

  ngOnInit() {
    this.query = this.settingsService.currentSearchText;
    this.queryChange(this.query);
  }

  ngOnDestroy(): void {
    this.solrSub.unsubscribe();
  }

}
