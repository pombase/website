import { Component, Input, OnInit } from '@angular/core';
import { GeneBoolNode, GeneQueryNode } from '../pombase-query';

@Component({
  selector: 'app-gene-query-structure',
  templateUrl: './gene-query-structure.component.html',
  styleUrls: ['./gene-query-structure.component.css']
})
export class GeneQueryStructureComponent implements OnInit {
  @Input() node: GeneQueryNode;

  constructor() { }

  isBooleanNode(): boolean {
    return this.node instanceof GeneBoolNode;
  }

  nodeAsBooleanNode(): GeneBoolNode {
    return this.node as GeneBoolNode;
  }

  ngOnInit(): void {
  }
}
