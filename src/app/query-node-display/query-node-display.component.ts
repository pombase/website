import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';

import { GeneQuery, GeneListNode, TermNode, SubsetNode, IntRangeNode, FloatRangeNode,
         GenomeRangeNode, GeneQueryNode, TermShort, NodeEventDetails, HasOrthologNode } from '../pombase-query';
import { GeneSummary, ChromosomeShort } from '../pombase-api.service';

import { ChromosomeConfig, ConfigOrganism, getAppConfig, QueryNodeConfig, QueryNodeSubsetConfig } from '../config';
import { PombaseAPIService } from '../pombase-api.service';

interface DisplayChromosome extends ChromosomeConfig {
  geneCount: number;
}

@Component({
  selector: 'app-query-node-display',
  templateUrl: './query-node-display.component.html',
  styleUrls: ['./query-node-display.component.css']
})
export class QueryNodeDisplayComponent implements OnInit, OnChanges {
  @Input() nodeConfig: QueryNodeConfig;
  @Output() nodeEvent = new EventEmitter<NodeEventDetails>();

  cannedQueryDetails?: Array<{ name: string; queryId: string; }>;
  chromosomeSummaries?: Array<ChromosomeShort>;
  orthologOrganisms: Array<ConfigOrganism> = [];

  selectedTerm?: TermShort;
  selectedSubset?: QueryNodeSubsetConfig;
  rangeStart?: number;
  rangeEnd?: number;
  chromosomeName?: string;
  selectedOrthologOrganism?: ConfigOrganism;

  displayChromosomes: Array<DisplayChromosome> = [];

  appConfig = getAppConfig();

  constructor(private pombaseApiService: PombaseAPIService) {
    getAppConfig().ortholog_taxonids.map((taxonid) => {
      for (const configOrganism of getAppConfig().organisms) {
        if (configOrganism.taxonid == taxonid) {
          this.orthologOrganisms.push(configOrganism);
        }
      }
    });
  }

  ngOnInit(): void {
    this.cannedQueryDetails =
      this.appConfig.cannedQueryIds.map(id => {
        const queryId = 'canned_query:' + id;
        const query = GeneQuery.fromJSONString(this.appConfig.getPredefinedQuery(queryId));
        return {
          name: query.getQueryName() || '[canned query name not configured]',
          queryId: queryId,
        };
      });

    this.displayChromosomes = [];

    this.pombaseApiService.getChromosomeSummaryMapPromise()
      .then(chrSummaryMap => {
        this.appConfig.chromosomes.map(chrConfig => {
          if (chrSummaryMap[chrConfig.name] &&
              chrSummaryMap[chrConfig.name].gene_count > 0) {
            const displayConfig =
              Object.assign({ geneCount: chrSummaryMap[chrConfig.name].gene_count},
                            chrConfig);
            this.displayChromosomes.push(displayConfig);
          }
        });
      });
  }

  ngOnChanges(): void {
    this.selectedTerm = undefined;
    this.selectedSubset = undefined;
    this.rangeStart = undefined;
    this.rangeEnd = undefined;
    this.chromosomeName = undefined;
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

  validRange(): boolean {
    return (this.rangeStart !== null ||
            this.rangeEnd !== null) &&
      (this.rangeStart === undefined ||
       this.rangeEnd === undefined ||
       this.rangeStart <= this.rangeEnd);
  }

  intRangeSearch(): void {
    let part = new IntRangeNode(undefined, this.nodeConfig!.id,
                                this.rangeStart!, this.rangeEnd!);
    this.emitNodeEvent(part);
  }

  floatRangeSearch(): void {
    let part = new FloatRangeNode(undefined, this.nodeConfig!.id,
                                  this.rangeStart!, this.rangeEnd!);
    this.emitNodeEvent(part);
  }

  genomeRangeSearch(): void {
    if (this.chromosomeName) {
      const part = new GenomeRangeNode(undefined, this.rangeStart!, this.rangeEnd!,
                                       this.chromosomeName);
      this.emitNodeEvent(part);
    }
  }

  genomeRangeButtonTitle(): string {
    if (this.chromosomeName) {
      if ((!this.rangeStart && !this.rangeEnd) || this.validRange()) {
        return 'Click to search';
      } else {
        return 'Start and end are optional but start must be less than end';
      }
    } else {
      return 'Select a chromosome';
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
