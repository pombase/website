import { Component, OnInit, OnDestroy, Input } from '@angular/core';

import { QueryService } from '../query.service';

@Component({
  selector: 'app-predefined-query-results',
  templateUrl: './predefined-query-results.component.html',
  styleUrls: ['./predefined-query-results.component.css']
})
export class PredefinedQueryResultsComponent implements OnInit, OnDestroy {
  @Input() predefinedQueryName;

  results = null;
  subscription = null;

  constructor(private queryService: QueryService) { }

  ngOnInit() {
    this.subscription = this.queryService.postPredefinedQuery(this.predefinedQueryName)
      .subscribe((results) => {
        this.results = results;
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
