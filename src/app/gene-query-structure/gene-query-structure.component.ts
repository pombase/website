import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GeneBoolNode, GeneQuery, GeneQueryNode } from '../pombase-query';

@Component({
    selector: 'app-gene-query-structure',
    templateUrl: './gene-query-structure.component.html',
    styleUrls: ['./gene-query-structure.component.css'],
    standalone: false
})
export class GeneQueryStructureComponent implements OnInit {
  @Input() node: GeneQueryNode;
  @Input() level: number = 0;
  @Output() gotoResults = new EventEmitter<GeneQuery>();


  isBooleanNode(): boolean {
    return this.node instanceof GeneBoolNode;
  }

  nodeAsBooleanNode(): GeneBoolNode {
    return this.node as GeneBoolNode;
  }

  queryFromNode(): void {
    const query = new GeneQuery(this.node);
    this.gotoResults.emit(query);
  }

  returnResults(query: GeneQuery): void {
    this.gotoResults.emit(query);
  }

  ngOnInit(): void {
  }
}
