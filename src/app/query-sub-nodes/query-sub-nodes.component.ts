import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { QueryNodeConfig } from '../config';

@Component({
  selector: 'app-query-sub-nodes',
  templateUrl: './query-sub-nodes.component.html',
  styleUrls: ['./query-sub-nodes.component.css']
})
export class QuerySubNodesComponent implements OnInit {
  @Input() nodeConfig: QueryNodeConfig;
  @Output() subNodeEvent = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }
}
