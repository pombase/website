import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { PombaseAPIService } from '../pombase-api.service';
import { TypeaheadMatch } from 'ng2-bootstrap/typeahead/typeahead-match.class';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';

import { TermShort } from '../pombase-query';

@Component({
  selector: 'app-term-name-complete',
  templateUrl: './term-name-complete.component.html',
  styleUrls: ['./term-name-complete.component.css']
})
export class TermNameCompleteComponent implements OnInit, OnChanges {
  @Input() cvName: string;
  @Input() placeholder = 'start typing ...';
  @Output() termMatched = new EventEmitter();
  dataSource: Observable<TermShort[]>;

  public selectedTerm = '';

  constructor(private pombaseApiService: PombaseAPIService) {
    this.dataSource =
      Observable.create((observer: any) => {
        observer.next(this.selectedTerm);
      })
      .switchMap((token: string) =>
                 pombaseApiService.getTermByNameFuzzy(this.cvName, token));
  };

  ngOnInit() {
  }

  ngOnChanges() {
    this.selectedTerm = '';
  }

  public typeaheadOnSelect(e: TypeaheadMatch): void {
    this.termMatched.emit(e.item);
  }
}
