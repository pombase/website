import { Component, OnInit, OnDestroy, Input } from '@angular/core';

import { QueryService } from '../../query.service';

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

  constructor(private queryService: QueryService) { }

  ngOnInit() {
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
