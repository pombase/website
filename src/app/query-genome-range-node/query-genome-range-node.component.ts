import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { ChromosomeConfig, getAppConfig, QueryNodeConfig } from '../config';
import { GeneQueryNode, GenomeRangeNode, NodeEventDetails } from '../pombase-query';
import { PombaseAPIService } from '../pombase-api.service';

interface DisplayChromosome extends ChromosomeConfig {
  geneCount: number;
  length: number;
}

@Component({
  selector: 'app-query-genome-range-node',
  templateUrl: './query-genome-range-node.component.html',
  styleUrls: ['./query-genome-range-node.component.css']
})
export class QueryGenomeRangeNodeComponent implements OnInit, OnChanges {
  @Input() nodeConfig: QueryNodeConfig;
  @Output() nodeEvent = new EventEmitter<NodeEventDetails>();

  rangeStart: number;
  rangeEnd: number;
  chromosomeName?: string;

  rangeRadio = 'all';

  rangeMax = 1;

  displayChromosomes: Array<DisplayChromosome> = [];

  appConfig = getAppConfig();

  constructor(private pombaseApiService: PombaseAPIService) { }

  genomeRangeSearch(): void {
    const part = new GenomeRangeNode(undefined, this.rangeStart!, this.rangeEnd!,
                                     this.chromosomeName!);
    this.emitNodeEvent(part);
  }

  startChanged(): void {
    if (this.rangeStart < 1) {
      this.rangeStart = 1;
    }
    if (this.rangeStart > this.rangeMax) {
      this.rangeStart = this.rangeMax;
    }
    if (this.rangeEnd < this.rangeStart) {
      this.rangeEnd = this.rangeStart;
    }
  }

  endChanged(): void {
    if (this.rangeEnd < 1) {
      this.rangeEnd = 1;
    }
    if (this.rangeEnd > this.rangeMax) {
      this.rangeEnd = this.rangeMax;
    }
    if (this.rangeEnd < this.rangeStart) {
      this.rangeStart = this.rangeEnd;
    }
  }

  setRanges(): void {
    for (const displayChromosome of this.displayChromosomes) {
      if (displayChromosome.name === this.chromosomeName) {
        this.rangeMax = displayChromosome.length;

        this.rangeStart = 1;
        this.rangeEnd = this.rangeMax;

        return;
      }
    }
  }

  chromosomeChanged(): void {
    this.setRanges();
  }

  emitNodeEvent(node: GeneQueryNode): void {
    this.nodeEvent.emit({ node, nodeConf: this.nodeConfig });
  }

  ngOnChanges(): void {
    this.chromosomeName = undefined;
  }

  ngOnInit(): void {
    this.displayChromosomes = [];

    this.pombaseApiService.getChromosomeSummaryMapPromise()
      .then(chrSummaryMap => {
        this.appConfig.chromosomes.map(chrConfig => {
          const chrSummary = chrSummaryMap[chrConfig.name];
          if (chrSummary &&
              chrSummary.gene_count > 0) {
            const displayConfig =
              Object.assign({
                 geneCount: chrSummary.gene_count,
                 length: chrSummary.length,
              },
              chrConfig);
            this.displayChromosomes.push(displayConfig);
          }
        });

        // default to chromosome 1
        this.chromosomeName = this.displayChromosomes[0].name;

        this.setRanges();
      });
  }
}
