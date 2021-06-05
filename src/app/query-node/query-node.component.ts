import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';

import { GeneQuery, GeneListNode, TermNode, SubsetNode, IntRangeNode, FloatRangeNode,
         GenomeRangeNode, GeneQueryNode, TermShort } from '../pombase-query';
import { GeneSummary, ChromosomeShort } from '../pombase-api.service';

import { ChromosomeConfig, getAppConfig, QueryNodeConfig, QueryNodeSubsetConfig } from '../config';
import { PombaseAPIService } from '../pombase-api.service';

interface NodeEventDetails {
  node?: GeneQueryNode;
  nodeConf?: QueryNodeConfig;
}

interface DisplayChromosome extends ChromosomeConfig {
  geneCount: number;
}

@Component({
  selector: 'app-query-node',
  templateUrl: './query-node.component.html',
  styleUrls: ['./query-node.component.css']
})
export class QueryNodeComponent implements OnInit, OnChanges {
  @Input() startNodeType?: string;
  @Output() nodeEvent = new EventEmitter<NodeEventDetails>();

  nodeTypes = getAppConfig().queryBuilder.node_types;
  cannedQueryDetails?: Array<{ name: string; queryId: string; }>;
  chromosomeSummaries?: Array<ChromosomeShort>;

  activeConf?: QueryNodeConfig;
  selectedTerm?: TermShort;
  selectedSubset?: QueryNodeSubsetConfig;
  subsetName = '';
  rangeStart?: number;
  rangeEnd?: number;
  chromosomeName?: string;

  displayChromosomes: Array<DisplayChromosome> = [];

  appConfig = getAppConfig();

  constructor(private pombaseApiService: PombaseAPIService) { }

  ngOnInit() {
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

  ngOnChanges() {
    if (this.startNodeType) {
      this.setNodeType(this.startNodeType);
    }
  }

  upperCaseIntial(s: string): string {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  removePrefix(s: string): string {
    let firstColon = s.indexOf(':');
    return s.slice(firstColon + 1);
  }

  emitNodeEvent(node?: GeneQueryNode): void {
    this.nodeEvent.emit({ node, nodeConf: this.activeConf });
  }

  clearQuery(): void {
    this.selectedTerm = undefined;
    this.selectedSubset = undefined;
    this.subsetName = '';
    this.rangeStart = undefined;
    this.rangeEnd = undefined;
    this.activeConf = undefined;
    // clear the current query and results
    this.emitNodeEvent(undefined);
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

  newTermNode(newNode: TermNode) {
    this.selectedTerm = newNode.getTerm();
    this.emitNodeEvent(newNode);
  }

  genesFound(param: { genes: Array<GeneSummary>, listName: string }): void {
    let part = new GeneListNode(param.listName, param.genes);
    this.emitNodeEvent(part);
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

  subsetInputSearch(): void {
    let trimmedSubsetName = this.subsetName.trim();
    if (trimmedSubsetName.length > 0) {
      let longName;
      if (this.activeConf && this.activeConf.subsetPrefix) {
        longName = this.activeConf.subsetPrefix + ':' + trimmedSubsetName;
      } else {
        longName = trimmedSubsetName;
      }
      let part = new SubsetNode(undefined, longName);
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
    let part = new IntRangeNode(undefined, this.activeConf!.id,
                                this.rangeStart!, this.rangeEnd!);
    this.emitNodeEvent(part);
  }

  floatRangeSearch(): void {
    let part = new FloatRangeNode(undefined, this.activeConf!.id,
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
}
