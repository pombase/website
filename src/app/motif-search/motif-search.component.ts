import { Component, OnInit, OnDestroy, OnChanges } from '@angular/core';
import { Router } from '@angular/router';

import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs';
import { debounceTime, map, distinctUntilChanged, switchMap } from 'rxjs/operators';

import { getAppConfig, AppConfig } from '../config';
import { MotifService, MotifPeptideResult, MotifSearchResults } from '../motif.service';
import { GeneListNode, GeneQuery } from '../pombase-query';
import { QueryService, HistoryEntry } from '../query.service';
import { PombaseAPIService, GeneShort, GeneSummaryMap } from '../pombase-api.service';

enum SearchState {
  ShowHelp = 0,
  TooShort = 1,
  Searching = 2,
  NoResults = 3,
  SomeResults = 5,
}

@Component({
  selector: 'app-motif-search',
  templateUrl: './motif-search.component.html',
  styleUrls: ['./motif-search.component.css']
})
export class MotifSearchComponent implements OnInit {

  motif = '';
  motifChanged: Subject<string> = new Subject<string>();

  SearchState = SearchState;
  searchState: SearchState = SearchState.ShowHelp;

  peptideResults: Array<MotifPeptideResult> = [];
  peptideResultsWithDetails: Array<MotifPeptideResult> = [];
  geneMatchesWithNoDetails = 0;

  motifSub: Subscription;
  organismCommonName: string = null;
  appConfig: AppConfig;
  geneSummaries: GeneSummaryMap = null;

  constructor(private router: Router,
              private pombaseApiService: PombaseAPIService,
              private queryService: QueryService,
              private motifService: MotifService) {
    this.appConfig = getAppConfig();

    if (!this.appConfig.isMultiOrganismMode()) {
      this.organismCommonName =
      this.appConfig.getConfigOrganism().species;
    }

    pombaseApiService.getGeneSummaryMapPromise()
      .then(geneSummaries => this.geneSummaries = geneSummaries);

    this.motifSub = this.motifChanged.pipe(
      map(motif => {
        let trimmed = motif.trim();
        trimmed = trimmed.replace(/\|+$/g, '');
        trimmed = trimmed.replace(/^\|+/g, '');
        trimmed = trimmed.replace(/^\.*[\*\+]*$/g, '');
        trimmed = trimmed.replace(/x/ig, '.');
        if (trimmed.length === 0) {
          this.searchState = SearchState.ShowHelp;
        } else {
          // this.searchState = SearchState.Searching;
        }
        return trimmed;
      }),
      debounceTime(250),
      distinctUntilChanged(),
      switchMap(motif => this.motifService.motifSearch('all', motif)))
      .subscribe(results => {
        if (results.status === 'OK') {
          this.peptideResults = results.gene_matches
          if (this.peptideResults.length > 0) {
            this.peptideResultsWithDetails = this.cleanResults(results);
            this.geneMatchesWithNoDetails =
               results.gene_matches.length - this.peptideResultsWithDetails.length;
            this.searchState = SearchState.SomeResults;
          } else {
            this.searchState = SearchState.NoResults;
          }
        } else {
          this.peptideResults = [];
          this.searchState = SearchState.NoResults;
        }
      },
      err => {
        this.searchState = SearchState.ShowHelp;
        console.error(err);
      });
  }

  cleanResults(results: MotifSearchResults): Array<MotifPeptideResult> {
    return results.gene_matches.filter((geneDetails: MotifPeptideResult) => {
      return geneDetails.matches;
    })
  }

  sendToQueryBuilder(): void {
    const geneUniquenames = this.peptideResults.map(res => res.gene_id);
    const part = new GeneListNode(geneUniquenames);
    const geneQuery = new GeneQuery(null, part);
    const callback = (historyEntry: HistoryEntry) => {
      this.router.navigate(['/query/results/from/history/', historyEntry.getEntryId()]);
    };
    this.queryService.saveToHistory(geneQuery, callback);
  }

  motifChange(motif: string): void {
    this.motifChanged.next(motif);
  }

  resetSearch(): void {
    this.motif = '';
    this.motifChange('');
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    this.motifSub.unsubscribe();
  }
}
