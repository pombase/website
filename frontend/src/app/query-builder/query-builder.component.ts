import { Component, OnInit } from '@angular/core';
import { GeneQuery, GeneQueryNode, QueryResult } from '../common/pombase-query';
import { PombaseAPIService } from '../pombase-api.service';

@Component({
  selector: 'app-query-builder',
  templateUrl: './query-builder.component.html',
  styleUrls: ['./query-builder.component.css']
})
export class QueryBuilderComponent implements OnInit {
  query: GeneQuery;
  results: QueryResult = null;

  resetQuery() {
    this.query = null;
    this.results = null;
  }

  constructor(private pombaseApiService: PombaseAPIService) {
    this.resetQuery();
  }

  ngOnInit() {

  }

  doQuery() {
    this.pombaseApiService.postQuery(this.query)
      .subscribe((results) => this.results = results);
  }

  newNode(part: GeneQueryNode) {
    this.query = new GeneQuery(part);
    this.doQuery();
  }
}
