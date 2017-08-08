import { Component, OnInit, Input } from '@angular/core';

import { QueryService } from '../query.service';

@Component({
  selector: 'app-predefined-query-results',
  templateUrl: './predefined-query-results.component.html',
  styleUrls: ['./predefined-query-results.component.css']
})
export class PredefinedQueryResultsComponent implements OnInit {
  @Input() predefinedQueryName;

  results = null;

  constructor(private queryService: QueryService) { }

  ngOnInit() {
    this.queryService.postPredefinedQuery(this.predefinedQueryName)
      .subscribe((results) => {
        this.results = results;
      });
  }
}
