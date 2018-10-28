import { Component, OnInit, OnDestroy, Input } from '@angular/core';

import { QueryService } from '../../query.service';
import { getAppConfig, PredefinedQueryConfig } from '../../config';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-query-link',
  templateUrl: './query-link.component.html',
  styleUrls: ['./query-link.component.css']
})
export class QueryLinkComponent implements OnInit, OnDestroy {
  @Input() goToResults: boolean;
  @Input() predefinedQueryId: string;
  @Input() linkText: string = null;

  subscription: Subscription = null;
  queryConfig: PredefinedQueryConfig = null;
  titleText = '';

  constructor(private queryService: QueryService) { }

  ngOnInit() {
    this.queryConfig = getAppConfig().getPredefinedQuery(this.predefinedQueryId);

//    this.titleText = this.queryConfig.name || this.predefinedQueryId;

    if (!this.linkText) {
      this.subscription = this.queryService.postPredefinedQueryCount(this.predefinedQueryId)
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
