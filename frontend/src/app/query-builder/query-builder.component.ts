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
  topNode: GeneBoolNode = new GeneBoolNode('and', []);
  query: GeneQuery = new GeneQuery(this.topNode);
  results: PomBaseResults = undefined;

  constructor(private pombaseApiService: PombaseAPIService) { }

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
