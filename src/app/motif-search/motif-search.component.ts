import { Component, OnInit } from '@angular/core';

import { firstValueFrom, Subject } from 'rxjs';
import { Subscription } from 'rxjs';
import { debounceTime, map, distinctUntilChanged, switchMap } from 'rxjs/operators';

import { getAppConfig, AppConfig } from '../config';
import { MotifService, MotifPeptideResult } from '../motif.service';
import { GeneListNode, GeneQuery } from '../pombase-query';
import { QueryRouterService } from '../query-router.service';
import { PombaseAPIService, GeneSummaryMap } from '../pombase-api.service';

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
    styleUrls: ['./motif-search.component.css'],
    standalone: false
})
export class MotifSearchComponent implements OnInit {

  motif = '';
  motifChanged: Subject<string> = new Subject<string>();
  trimmedMotif = '';

  SearchState = SearchState;
  searchState: SearchState = SearchState.ShowHelp;

  peptideResults: Array<MotifPeptideResult> = [];
  peptideResultsWithDetails: Array<MotifPeptideResult> = [];

  defaultGenesWithDetails = 500;
  showAllGeneDetails = false;

  motifSub: Subscription;
  organismCommonName: string;
  appConfig: AppConfig;
  geneSummaries: GeneSummaryMap;

  constructor(pombaseApiService: PombaseAPIService,
              private queryRouterService: QueryRouterService,
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
        this.trimmedMotif = '';
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
        this.trimmedMotif = trimmed;
        return trimmed;
      }),
      debounceTime(250),
      distinctUntilChanged((previous: string, current: string) => {
        if (this.showAllGeneDetails) {
          return false;
        } else {
          return previous === current;
        }
      }),
      switchMap(motif => {
        let genesWithDetails;
        if (this.showAllGeneDetails) {
          genesWithDetails = -1;
        } else {
          genesWithDetails = this.defaultGenesWithDetails;
        }
        return this.motifService.motifSearchAll('all', motif, genesWithDetails);
      }))
      .subscribe({
        next: (results) => {
          if (results.status === 'OK') {
            this.peptideResults = results.peptide_matches;
            if (this.peptideResults.length > 0) {
              if (this.showAllGeneDetails ||
                  this.peptideResults.length <= this.defaultGenesWithDetails) {
                this.peptideResultsWithDetails = this.peptideResults;
              } else {
                this.peptideResultsWithDetails =
                  this.peptideResults.slice(0, this.defaultGenesWithDetails);
              }
              this.searchState = SearchState.SomeResults;
            } else {
              this.searchState = SearchState.NoResults;
            }
          } else {
            this.peptideResults = [];
            this.searchState = SearchState.NoResults;
          }
          this.showAllGeneDetails = false;
        },
        error: err => {
          this.searchState = SearchState.ShowHelp;
          console.error(err);
        }
      });
  }

  morePeptideMatches(geneUniquename: string): void {
    firstValueFrom(this.motifService.motifSearchSingleGene(geneUniquename, this.trimmedMotif))
      .then(results => {
        if (results.peptide_matches.length === 1) {
          const fullGeneMatch = results.peptide_matches[0];
          const existingGeneIndex =
            this.peptideResultsWithDetails.findIndex(existingGeneMatch => {
              return existingGeneMatch.peptide_id === fullGeneMatch.peptide_id;
            });
          this.peptideResultsWithDetails[existingGeneIndex] = fullGeneMatch;
        }
      });
  }

  showAll(): void {
    this.showAllGeneDetails = true;
    this.motifChange(this.motif); // trigger the Observable
  }

  geneIdOf(peptideResult: MotifPeptideResult): string {
    return peptideResult.peptide_id.replace(/\.\d+$/, '');
  }

  sendToQueryBuilder(): void {
    const geneUniquenames =
       this.peptideResults.map(res => this.geneIdOf(res));
    const part = new GeneListNode('peptides matching motif "' + this.trimmedMotif + '"', geneUniquenames);
    const geneQuery = new GeneQuery(part);
    this.queryRouterService.gotoResults(geneQuery);
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
