import { Component, Input, OnInit } from '@angular/core';
import { TermShort, GeneQuery, GeneQueryNode, GeneBoolNode,
         PomBaseResults } from '../common/pombase-query';
import { PombaseAPIService } from '../pombase-api.service';

@Component({
  selector: 'app-query-builder',
  templateUrl: './query-builder.component.html',
  styleUrls: ['./query-builder.component.css']
})
export class QueryBuilderComponent implements OnInit {
//  @Input() query: GeneQuery;
  topNode: GeneBoolNode;
  query: GeneQuery;
  results: PomBaseResults = undefined;

  resetQuery() {
    this.topNode = new GeneBoolNode('and', []);
    this.query = new GeneQuery(this.topNode);
    this.results = undefined;
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
    this.topNode.getParts().push(part);
    this.doQuery();
  }
}
