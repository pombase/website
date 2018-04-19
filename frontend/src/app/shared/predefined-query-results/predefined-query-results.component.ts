import { Component, OnInit, OnDestroy, Input } from '@angular/core';

import { QueryService } from '../../query.service';
import { QueryOutputOptions } from '../../pombase-query';

@Component({
  selector: 'app-predefined-query-results',
  templateUrl: './predefined-query-results.component.html',
  styleUrls: ['./predefined-query-results.component.css']
})
export class PredefinedQueryResultsComponent implements OnInit, OnDestroy {
  @Input() predefinedQueryId;

  results = null;
  subscription = null;

  constructor(private queryService: QueryService) { }

  ngOnInit() {
    const outputOptions = new QueryOutputOptions(['gene_uniquename'], 'none');

    this.subscription =
      this.queryService.postPredefinedQuery(this.predefinedQueryId, outputOptions)
      .subscribe((results) => {
        this.results = results;
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
