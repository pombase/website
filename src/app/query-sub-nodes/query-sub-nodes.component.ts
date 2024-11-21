import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation, OnChanges } from '@angular/core';
import { QueryNodeConfig } from '../config';
import { NodeEventDetails } from '../pombase-query';
import { Util } from '../shared/util';

@Component({
    selector: 'app-query-sub-nodes',
    templateUrl: './query-sub-nodes.component.html',
    styleUrls: ['./query-sub-nodes.component.css'],
    encapsulation: ViewEncapsulation.None,
    standalone: false
})
export class QuerySubNodesComponent implements OnInit, OnChanges {
  @Input() nodeConfig: QueryNodeConfig;
  @Output() subNodeEvent = new EventEmitter();

  currentTabNodeConfig?: QueryNodeConfig;

  constructor() { }

  changeTab(nodeConfig: QueryNodeConfig) {
    this.currentTabNodeConfig = nodeConfig;
  }

  nodeHeading(nodeConfig: QueryNodeConfig): string {
    return Util.capitalize(nodeConfig.displayName);
  }

  emitEvent(nodeAndConfig: NodeEventDetails) {
    this.subNodeEvent.emit(nodeAndConfig);
  }

  ngOnInit(): void {
  }

  ngOnChanges(): void {
    this.currentTabNodeConfig = this.nodeConfig.subNodes![0];
  }
}
