import { Component, OnInit, OnDestroy, Input } from '@angular/core';

import { QueryService } from '../../query.service';
import { getAppConfig } from '../../config';

@Component({
  selector: 'app-query-link',
  templateUrl: './query-link.component.html',
  styleUrls: ['./query-link.component.css']
})
export class QueryLinkComponent implements OnInit, OnDestroy {
  @Input() goToResults;
  @Input() predefinedQueryName;
  @Input() linkText = null;

  subscription = null;
  queryConfig = null;
  titleText = '';

  constructor(private queryService: QueryService) { }

  ngOnInit() {
    this.queryConfig = getAppConfig().getPredefinedQuery(this.predefinedQueryName);

//    this.titleText = this.queryConfig.name || this.predefinedQueryName;

    if (!this.linkText) {
      this.subscription = this.queryService.postPredefinedQueryCount(this.predefinedQueryName)
        .subscribe((results) => {
          this.linkText = String(results);
        });
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
