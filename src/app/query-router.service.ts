import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { QueryService } from './query.service';
import { GeneQuery, QueryOutputOptions, QueryResult } from './pombase-query';

@Injectable({
  providedIn: 'root'
})
export class QueryRouterService {

  constructor(private queryService: QueryService,
              private router: Router) { }

  public gotoResults(query: GeneQuery, mode = 'results'): void {
    this.queryService.exec(query)
      .then((result: QueryResult) => {
        this.queryService.saveResultsToHistory(result);
        this.router.navigate(['/' + mode + '/from/id/', result.getId()]);
      });
  }

  public gotoPredefinedQueryResults(predefinedQueryId: string): void {
    this.router.navigate(['/results/from/predefined/', predefinedQueryId]);
  }

}
