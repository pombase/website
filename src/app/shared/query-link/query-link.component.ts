import { Component, OnInit, Input } from '@angular/core';

import { QueryService } from '../../query.service';
import { QueryRouterService } from '../../query-router.service';

@Component({
    selector: 'app-query-link',
    templateUrl: './query-link.component.html',
    styleUrls: ['./query-link.component.css'],
    standalone: false
})
export class QueryLinkComponent implements OnInit {
  @Input() goToResults: boolean;
  @Input() predefinedQueryId: string;
  @Input() linkText: string;

  titleText = '';

  constructor(private queryService: QueryService,
              private queryRouterService: QueryRouterService) { }

  ngOnInit() {
    if (!this.linkText || this.linkText.includes('<<count>>')) {
      this.queryService.postPredefinedQueryCount(this.predefinedQueryId)
        .then((results) => {
          if (this.linkText && this.linkText.includes('<<count>>')) {
            let count = results.getRowCount().toString();
            this.linkText = this.linkText.replace('<<count>>', count);
          } else {
            this.linkText = String(results.getRowCount());
          }
        });
    }
  }

  gotoResults(): void {
    this.queryRouterService.gotoPredefinedQueryResults(this.predefinedQueryId);
  }
}
