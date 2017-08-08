import { Component, OnInit, OnDestroy, Input } from '@angular/core';

import { QueryService } from '../query.service';

@Component({
  selector: 'app-query-link',
  templateUrl: './query-link.component.html',
  styleUrls: ['./query-link.component.css']
})
export class QueryLinkComponent implements OnInit, OnDestroy {
  @Input() predefinedQueryName;

  linkText = ' ';
  subscription = null;

  constructor(private queryService: QueryService) { }

  ngOnInit() {
    this.subscription = this.queryService.postPredefinedQueryCount(this.predefinedQueryName)
      .subscribe((results) => {
        this.linkText = String(results);
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
