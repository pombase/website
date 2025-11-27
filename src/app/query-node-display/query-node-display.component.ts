import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';

import { GeneQuery, GeneListNode, TermNode, SubsetNode,
         GeneQueryNode, TermShort,
         NodeEventDetails, HasOrthologNode } from '../pombase-query';
import { GeneSummary, ChromosomeShort } from '../pombase-api.service';

import { ConfigOrganism, getAppConfig,
         QueryNodeConfig, QueryNodeSubsetConfig } from '../config';


interface CannedQueryDetail {
  name: string;
  queryId: string;
}

interface CannedQueryGroupDetails {
  id: string;
  heading: string;
  queries: Array<CannedQueryDetail>;
}

@Component({
    selector: 'app-query-node-display',
    templateUrl: './query-node-display.component.html',
    styleUrls: ['./query-node-display.component.css'],
    standalone: false
})
export class QueryNodeDisplayComponent implements OnInit, OnChanges {
  @Input() nodeConfig: QueryNodeConfig;
  @Output() nodeEvent = new EventEmitter<NodeEventDetails>();

  cannedQueryGroups: Array<CannedQueryGroupDetails>= [];
  chromosomeSummaries?: Array<ChromosomeShort>;
  orthologOrganisms: Array<ConfigOrganism> = [];

  selectedTerm?: TermShort;
  selectedSubset?: QueryNodeSubsetConfig;

  selectedOrthologOrganism?: ConfigOrganism;

  appConfig = getAppConfig();

  constructor() {
    getAppConfig().ortholog_taxonids.map((taxonid) => {
      for (const configOrganism of getAppConfig().organisms) {
        if (configOrganism.taxonid == taxonid) {
          this.orthologOrganisms.push(configOrganism);
        }
      }
    });
  }

  ngOnInit(): void {
    this.cannedQueryGroups = [];
    for (const group of this.appConfig.cannedQueries) {
      let queryDetails = [];

      for (const id of group.query_ids) {
        let queryId = 'canned_query:' + id;
        let predefinedQuery = this.appConfig.getPredefinedQuery(queryId);
        if (!predefinedQuery) {
          queryId = id;
          predefinedQuery = this.appConfig.getPredefinedQuery(id);
        }
        if (predefinedQuery) {
          const query = GeneQuery.fromJSONString(predefinedQuery);
          queryDetails.push({
            name: query.getQueryName() || '[canned query name not configured]',
            queryId: queryId,
          } as CannedQueryDetail);
        }
      }
      const id = group.heading.replace(' ', '-');
      let heading = group.heading;
      if (queryDetails.length > 1) {
        heading += ' (' + queryDetails.length + ' queries)';
      }
      this.cannedQueryGroups.push({
        id,
        heading,
        queries: queryDetails,
      });
    }
  }

  ngOnChanges(): void {
    this.selectedTerm = undefined;
    this.selectedSubset = undefined;

    this.selectedOrthologOrganism = undefined;
  }

  removePrefix(s: string): string {
    let firstColon = s.indexOf(':');
    return s.slice(firstColon + 1);
  }

  emitEvent(nodeAndConfig: NodeEventDetails) {
    this.nodeEvent.emit(nodeAndConfig);
  }

  emitNodeEvent(node?: GeneQueryNode): void {
    if (node) {
      this.nodeEvent.emit({ node, nodeConf: this.nodeConfig });
    } else {
      this.nodeEvent.emit(undefined);
    }
  }

  newTermNode(newNode: TermNode) {
    this.selectedTerm = newNode.getTerm();
    this.emitNodeEvent(newNode);
  }

  genesFound(param: { genes: Array<GeneSummary>, listName: string }): void {
    let part = new GeneListNode(param.listName, param.genes);
    this.emitNodeEvent(part);
  }

  selectedOrthologChange(): void {
    if (this.selectedOrthologOrganism) {
      const nodeName = 'has ortholog with: ' + this.selectedOrthologOrganism.common_name;
      const part = new HasOrthologNode(nodeName, this.selectedOrthologOrganism.taxonid);
      this.emitNodeEvent(part);
    }
  }

  smallOntologyChange(): void {
    if (this.selectedTerm) {
      let part = new TermNode(undefined, this.selectedTerm.termid, this.selectedTerm.name,
                              this.selectedTerm.definition, undefined, undefined,
                              undefined, [], []);
      this.emitNodeEvent(part);
    }
  }

  subsetChange(): void {
    if (this.selectedSubset) {
      let part = new SubsetNode(undefined, this.selectedSubset.name);
      this.emitNodeEvent(part);
    }
  }

  selectPredefinedQuery(predefinedQueryId: string): void {
    const queryJson = this.appConfig.getPredefinedQuery(predefinedQueryId);
    const query = GeneQuery.fromJSONString(queryJson);
    this.emitNodeEvent(query.getTopNode());
  }

  subNodeEvent($event: NodeEventDetails): void {
    this.emitEvent($event);
  }
}
