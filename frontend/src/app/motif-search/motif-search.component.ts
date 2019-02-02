import { Component, OnInit } from '@angular/core';

import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs';
import { debounceTime, map, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { getAppConfig, AppConfig } from '../config';

import { MotifService, MotifPeptideResult, MotifSearchResults } from '../motif.service';

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
  cleanResults(results: MotifSearchResults): void {
    results.gene_matches.map((geneDetails: MotifPeptideResult) => {
      if (!geneDetails.matches) {
        geneDetails.matches = []
      }
    })
  }

  motif: string = '';
  motifChanged: Subject<string> = new Subject<string>();

  SearchState = SearchState;
  searchState: SearchState = SearchState.ShowHelp;

  peptideResults: MotifPeptideResult[] = [];
  motifSub: Subscription;

  organismCommonName: string = null;

  appConfig: AppConfig;

  constructor(private motifService: MotifService) {
    this.appConfig = getAppConfig();

    if (!this.appConfig.isMultiOrganismMode()) {
      this.organismCommonName =
      this.appConfig.getConfigOrganism().species;
    }

    this.motifSub = this.motifChanged.pipe(
      map(motif => {
        let trimmed = motif.trim();
        trimmed = trimmed.replace(/\|+$/g, '');
        trimmed = trimmed.replace(/^\|+/g, '');
        trimmed = trimmed.replace(/^\.*[\*\+]*$/g, '');
        if (trimmed.length == 0) {
          this.searchState = SearchState.ShowHelp;
        } else {
          // this.searchState = SearchState.Searching;
        }
        return trimmed;
      }),
      debounceTime(250),
      distinctUntilChanged(),
      switchMap(motif => this.motifService.motifSearch(motif)))
      .subscribe(results => {
        if (results.status === 'OK') {
          this.peptideResults = results.gene_matches
          if (this.peptideResults.length > 0) {
            this.cleanResults(results);
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
