import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { PombaseAPIService, GeneSummary } from '../pombase-api.service';

import { TypeaheadMatch } from 'ng2-bootstrap/typeahead/typeahead-match.class';

interface Model extends GeneSummary {
  searchData: string;
}

class DisplayModel {
  constructor(public uniquename: string,
              public name: string,
              public otherDetails: string) { }
}

@Component({
  selector: 'app-search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.css']
})
export class SearchBoxComponent implements OnInit {
  public fieldValue = '';
  dataSource: Observable<any>;
  noResults = true;

  lastMatchIdentifier = '';

  geneSummaries: Array<GeneSummary> = [];

  constructor(private pombaseApiService: PombaseAPIService,
              private router: Router) {
    this.dataSource = Observable
      .create((observer: any) => {
        // Runs on every search
        observer.next(this.fieldValue);
      })
      .mergeMap((token: string) => this.summariesAsObservable(token));
  }
 
  fieldValueMatches(geneSumm: GeneSummary, fieldValue: string): DisplayModel {
    if (fieldValue) {
      let value = this.fieldValue.trim().toLowerCase();

      if (value.length === 0) {
        return null;
      }

      if (geneSumm.uniquename.indexOf(value) !== -1 ||
          geneSumm.name && geneSumm.name.toLowerCase().indexOf(value) !== -1) {
        return new DisplayModel(geneSumm.uniquename, geneSumm.name, null);
      }
      for (let syn of geneSumm.synonyms) {
        if (syn.toLowerCase().indexOf(value) !== -1) {
          return new DisplayModel(geneSumm.uniquename, geneSumm.name, 'synonym: ' + syn);
        }
      }
      if (geneSumm.product && geneSumm.product.toLowerCase().indexOf(value) !== -1) {
        return new DisplayModel(geneSumm.uniquename, geneSumm.name,
                                'product: ' + geneSumm.product);
      }
      for (let orth of geneSumm.orthologs) {
        if (orth.identifier.toLowerCase().indexOf(value) !== -1) {
          return new DisplayModel(geneSumm.uniquename, geneSumm.name,
                                  'ortholog: ' + orth.identifier);
        }
      }
    }

    return null;
  }


  summariesAsObservable(token: string): Observable<any> {
    if (this.geneSummaries) {
      let filteredSummaries = [];
      for (let geneSumm of this.geneSummaries) {
        let matchSummary = this.fieldValueMatches(geneSumm, token);
        if (matchSummary && filteredSummaries.length < 20) {
          filteredSummaries.push(matchSummary);
        }
      }
      return Observable.of(filteredSummaries);
    } else {
      return Observable.of([]);
    }
  }

  ngOnInit() {
    this.pombaseApiService.getGeneSummaries()
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
    this.router.navigate(['/gene', e.item.uniquename]);
    this.fieldValue = '';
  }

  public typeaheadNoResults(e: boolean) {
    this.noResults = e;
  }

  getVisibility(): string {
    if (this.noResults && this.fieldValue.length > 0) {
      return 'visible';
    } else {
      return 'hidden';
    }
  }
}
