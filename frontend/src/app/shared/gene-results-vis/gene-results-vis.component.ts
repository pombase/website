import { Component, OnInit, Input } from '@angular/core';
import { GeneShort } from '../../pombase-api.service';
import { getAppConfig, VisColumnConfig } from '../../config';

@Component({
  selector: 'app-gene-results-vis',
  templateUrl: './gene-results-vis.component.html',
  styleUrls: ['./gene-results-vis.component.css']
})
export class GeneResultsVisComponent implements OnInit {
  @Input() genes: Array<GeneShort> = [];

  geneData = [];
  geneMap = {};
  currentGene = null;
  currentGeneDomId = null;
  visColumnConfigs: Array<VisColumnConfig>;
  selectedColumns: { [index: string]: boolean; } = {};

  constructor() {
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

  ngOnInit() {
    this.geneData = [];

    this.geneMap = {};

    for (let i = 0; i < this.genes.length; i++) {
      const gene = this.genes[i];
      const geneDomId = this.makeGeneDomId(gene.uniquename, i);

      this.geneMap[geneDomId] = gene;

      let color = this.geneColor(geneDomId, false);

      this.geneData.push({
        'id': geneDomId,
        'height': 2,
        'width': 500,
        'x': 0,
        'y': i * 2,
        color,
      });
    }
  }
}
