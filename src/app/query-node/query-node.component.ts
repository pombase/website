import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from "@angular/core";

import { getAppConfig, QueryNodeConfig } from "../config";
import { DeployConfigService } from "../deploy-config.service";
import { NodeEventDetails } from "../pombase-query";

@Component({
  selector: 'app-query-node',
  templateUrl: './query-node.component.html',
  styleUrls: ['./query-node.component.css']
})
export class QueryNodeComponent implements OnInit, OnChanges {
  @Input() startNodeType?: string;
  @Output() nodeEvent = new EventEmitter<NodeEventDetails>();

  nodeTypes = getAppConfig().queryBuilder.node_types;

  activeConf?: QueryNodeConfig;

  appConfig = getAppConfig();

  constructor(deployConfigService: DeployConfigService) {
    if (deployConfigService.productionMode()) {
      this.nodeTypes = this.nodeTypes.filter(nodeConfig => !nodeConfig.development_mode_only);
    }
  }

  ngOnInit() {
  }

  ngOnChanges() {
    if (this.startNodeType) {
      this.setNodeType(this.startNodeType);
    }
  }

  upperCaseIntial(s: string): string {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  emitEvent(nodeAndConfig?: NodeEventDetails): void {
    this.nodeEvent.emit(nodeAndConfig);
  }

  clearQuery(): void {
    // clear the current query and results
    this.activeConf = undefined;
    this.emitEvent(undefined);
  }

  setNodeType(confId: string) {
    if (!this.activeConf || confId !== this.activeConf.id) {
      this.clearQuery();
      for (let conf of this.nodeTypes) {
        if (confId === conf.id) {
          this.activeConf = conf;
        }
      }
    }
  }
}
