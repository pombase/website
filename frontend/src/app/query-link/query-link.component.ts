import { Component, OnInit, Input } from '@angular/core';

import { QueryService } from '../query.service';

@Component({
  selector: 'app-query-link',
  templateUrl: './query-link.component.html',
  styleUrls: ['./query-link.component.css']
})
export class QueryLinkComponent implements OnInit {
  @Input() predefinedQueryName;

  linkText = ' ';

  constructor(private queryService: QueryService) { }

  ngOnInit() {
    this.queryService.postPredefinedQueryCount(this.predefinedQueryName)
      .subscribe((results) => {
        this.linkText = String(results);
      });
  }
}
