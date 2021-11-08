import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { ChromosomeConfig, getAppConfig, QueryNodeConfig } from '../config';
import { GeneQueryNode, GenomeRangeNode, NodeEventDetails } from '../pombase-query';
import { PombaseAPIService } from '../pombase-api.service';

interface DisplayChromosome extends ChromosomeConfig {
  geneCount: number;
}

@Component({
  selector: 'app-query-genome-range-node',
  templateUrl: './query-genome-range-node.component.html',
  styleUrls: ['./query-genome-range-node.component.css']
})
export class QueryGenomeRangeNodeComponent implements OnInit, OnChanges {
  @Input() nodeConfig: QueryNodeConfig;
  @Output() nodeEvent = new EventEmitter<NodeEventDetails>();

  rangeStart?: number;
  rangeEnd?: number;
  chromosomeName?: string;

  displayChromosomes: Array<DisplayChromosome> = [];

  appConfig = getAppConfig();

  constructor(private pombaseApiService: PombaseAPIService) { }

  validRange(): boolean {
    return (this.rangeStart !== null ||
            this.rangeEnd !== null) &&
      (this.rangeStart === undefined ||
       this.rangeEnd === undefined ||
       this.rangeStart <= this.rangeEnd);
  }

  genomeRangeSearch(): void {
    if (this.chromosomeName) {
      const part = new GenomeRangeNode(undefined, this.rangeStart!, this.rangeEnd!,
                                       this.chromosomeName);
      this.emitNodeEvent(part);
    }
  }

  emitNodeEvent(node: GeneQueryNode): void {
    this.nodeEvent.emit({ node, nodeConf: this.nodeConfig });
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

  ngOnChanges(): void {
    this.chromosomeName = undefined;
  }


  ngOnInit(): void {
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

}
