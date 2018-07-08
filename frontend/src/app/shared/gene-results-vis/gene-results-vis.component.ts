import { Component, OnInit, Input } from '@angular/core';
import { GeneShort } from '../../pombase-api.service';
import { getAppConfig, VisColumnConfig } from '../../config';
import { QueryService } from '../../query.service';
import { GeneListNode, GeneQuery, QueryOutputOptions, QueryResult } from '../../pombase-query';

class GeneData {
  constructor(public id: number, height: number, width: number,
              x: number, y: number, color: string) {};
}

@Component({
  selector: 'app-gene-results-vis',
  templateUrl: './gene-results-vis.component.html',
  styleUrls: ['./gene-results-vis.component.css']
})
export class GeneResultsVisComponent implements OnInit {
  @Input() genes: Array<GeneShort> = [];

  results: QueryResult = null;

  geneData = [];
  geneMap = {};
  currentGene = null;
  currentGeneDomId = null;
  visColumnConfigs: Array<VisColumnConfig>;

  selectedColumns: { [index: string]: boolean; } = {};
  selectedConfigs: Array<VisColumnConfig> = [];

  constructor(private queryService: QueryService) {
    this.visColumnConfigs = getAppConfig().geneResults.visualisation.columns;

    this.visColumnConfigs.map(colConfig => {
      this.selectedColumns[colConfig.name] = false;
    });
  }

  mouseenter($event: Event) {
    const eventTargetElement = $event.target as Element;
    this.currentGeneDomId = eventTargetElement.id;

    if (this.currentGeneDomId) {
      this.currentGene = this.geneMap[this.currentGeneDomId];
      const geneColor = this.geneColor(this.currentGeneDomId, true);
      eventTargetElement.setAttribute('fill', geneColor);
    } else {
      this.currentGene = null;
    }
  }

  mouseleave($event: Event) {
    const eventTargetElement = $event.target as Element;
    const geneDomId = eventTargetElement.id;

    this.currentGene = null;
    this.currentGeneDomId = null;

    const geneColor = this.geneColor(geneDomId, false);
    eventTargetElement.setAttribute('fill', geneColor);
  }

  processColumnResults(results: QueryResult): void {
    this.results = results;
  }

  queryColumnResults(): void {
    const geneListNode = new GeneListNode(this.genes);
    const geneListQuery = new GeneQuery(geneListNode);

    const visColumnNames = this.visColumnConfigs.map(c => c.name);
    const outputOptions =
      new QueryOutputOptions(['gene_uniquename', ...visColumnNames], 'none');
    this.queryService.postQuery(geneListQuery, outputOptions)
      .subscribe(results => this.processColumnResults(results));
  }

  makeGeneData(): void {
    this.geneData = [];

    this.geneMap = {};

    for (let i = 0; i < this.genes.length; i++) {
      const gene = this.genes[i];
      const geneDomId = this.makeGeneDomId(gene.uniquename, i);

      this.geneMap[geneDomId] = gene;

      let color = this.geneColor(geneDomId, false);

      this.geneData.push({
        'id': geneDomId,
        'height': 3,
        'width': 500,
        'x': 0,
        'y': i * 3,
        color,
      });
    }
  }

  getGeneData(): Array<GeneData> {
    return this.geneData;
  }

  confSelectionChanged(): void {
    this.selectedConfigs = [];
    for (const visConfig of this.visColumnConfigs) {
      if (this.selectedColumns[visConfig.name]) {
        this.selectedConfigs.push(visConfig);
      }
    }

    if (!this.results) {
      this.queryColumnResults();
      this.makeGeneData();
    }
  }

  makeGeneDomId(geneUniquename: string, index: number): string {
    return 'gene-' + index + '-'  + geneUniquename;
  }

  geneColor(geneDomId: string, isCurrent: boolean): string {
    if (isCurrent) {
      return '#88b';
    }

    if (!geneDomId) {
      return '#f00';
    }

    const match = /gene-(\d+)-(.*)/.exec(geneDomId);

    if (match) {
      const index = parseInt(match[1], 10);
      const geneId = match[2];

      if (index % 10 === 0) {
        return '#aaa';
      } else {
        return '#f8f8f8';
      }
    } else {
      return '#f0f';
    }
  }

  showResults(): boolean {
    return this.selectedConfigs.length > 0 && this.results !== null &&
      this.geneData !== null;
  }

  ngOnInit() {
  }
}
