import { Component, OnInit, Input } from '@angular/core';

import { QueryService, QueryOutputOptions } from '../../query.service';
import { QueryResult } from '../../pombase-query';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-predefined-query-results',
    templateUrl: './predefined-query-results.component.html',
    styleUrls: ['./predefined-query-results.component.css'],
    standalone: false
})
export class PredefinedQueryResultsComponent implements OnInit {
  @Input() predefinedQueryId: string;
  @Input() description: string;

  results: QueryResult;
  subscription: Subscription;

  constructor(private queryService: QueryService) { }

  ngOnInit() {
    const outputOptions = new QueryOutputOptions(['gene_uniquename'], [], [], 'none');

    this.queryService.postPredefinedQuery(this.predefinedQueryId, this.description, outputOptions)
      .then(results => {
        this.results = results;
      });
  }
}
