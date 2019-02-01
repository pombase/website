import { Component, OnInit } from '@angular/core';

import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs';
import { debounceTime, map, distinctUntilChanged, switchMap } from 'rxjs/operators';

import { MotifService, MotifPeptideResult } from '../motif.service';

@Component({
  selector: 'app-motif-search',
  templateUrl: './motif-search.component.html',
  styleUrls: ['./motif-search.component.css']
})
export class MotifSearchComponent implements OnInit {

  motif: string = '';
  motifChanged: Subject<string> = new Subject<string>();

  hasResults = false;
  showHelp = true;

  peptideResults: MotifPeptideResult[] = [];
  motifSub: Subscription;

  constructor(private motifService: MotifService) {
    this.motifSub = this.motifChanged.pipe(
      map(motif => {
        let trimmed = motif.trim();
        trimmed = trimmed.replace(/\|$/g, '');
        trimmed = trimmed.replace(/^\|/g, '');
        trimmed = trimmed.replace(/^\.[\*\+]$/g, '');
        this.showHelp = trimmed.length == 0;
        return trimmed;
      }),
      debounceTime(250),
      distinctUntilChanged(),
      switchMap(motif => this.motifService.motifSearch(motif)))
      .subscribe(results => {
        if (results.status === 'OK') {
          this.peptideResults = results.peptide_matches
          this.hasResults = results.peptide_matches.length > 0;
        } else {
          this.peptideResults = [];
          this.hasResults = false;
        }
      },
      err => console.error(err));
  }

  motifChange(motif: string): void {
    this.motifChanged.next(motif);
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    this.motifSub.unsubscribe();
  }
}
