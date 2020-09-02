import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { CompleteService } from '../complete.service';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead/typeahead-match.class';

import { Observable, of } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';

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

  constructor(completeService: CompleteService) {
    this.dataSource =
      Observable.create((observer: any) => {
        observer.next(this.selectedTerm);
      })
      .pipe(switchMap((token: string) =>
                      completeService.completeTermName(this.cvName, token)),
            catchError(e => {
              console.log('completion API call failed: ' + e.message);
              return of([]);
            }));
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
