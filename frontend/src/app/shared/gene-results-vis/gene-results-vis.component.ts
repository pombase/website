import { Component, OnInit, Input } from '@angular/core';
import { GeneShort } from '../../pombase-api.service';
import { getAppConfig, VisColumnConfig } from '../../config';
import { QueryService } from '../../query.service';
import { GeneListNode, GeneQuery, QueryOutputOptions, QueryResult } from '../../pombase-query';

class GeneDisplayData {
  constructor(public id: number,
              public height: number, public width: number,
              public x: number, public y: number,
              public color: string) {};
}

class ColumnSpan {
  constructor(public startGeneIndex: number,
              public endGeneIndex: number,
              public spanAttributeValue) {};
}

class ColumnDisplayData {
  constructor(public height: number, public width: number,
              public x: number, public y: number,
              public color: string) {};
}

type ColumnDisplayDataMap = { [columnName: string]: Array<ColumnDisplayData> };

@Component({
  selector: 'app-gene-results-vis',
  templateUrl: './gene-results-vis.component.html',
  styleUrls: ['./gene-results-vis.component.css']
})
export class GeneResultsVisComponent implements OnInit {
  @Input() genes: Array<GeneShort> = [];

  results: QueryResult = null;

  geneDisplayData = [];
  geneMap = {};

  columnDisplayDataMap: ColumnDisplayDataMap = {};

  currentGene = null;
  currentGeneDomId = null;
  visColumnConfigs: Array<VisColumnConfig> = [];
  visColumnNames: Array<string> = [];

  selectedColumns: { [index: string]: boolean; } = {};
  selectedConfigs: Array<VisColumnConfig> = [];
  selectedConfigNames: Array<string> = [];

  lineHeight = 5;
  columnWidth = 30;
  geneWidth = 40;

  constructor(private queryService: QueryService) {
    this.visColumnConfigs = getAppConfig().geneResults.visualisation.columns;
    this.visColumnNames = [];

    this.visColumnConfigs.map(colConfig => {
      this.visColumnNames.push(colConfig.name);
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

    let groupedColumnData: { [columnName: string]: Array<ColumnSpan> } = {};

    const visColumnNames = this.visColumnConfigs.map(c => c.name);

    visColumnNames.map(columnName => groupedColumnData[columnName] = []);

    let resultRows = results.rows;

    // do sorting

    for (let i = 0; i < resultRows.length; i++) {
      const resultRow = resultRows[i];

      for (const columnName of this.selectedConfigNames) {
        const rowAttr = resultRow[columnName];
        let columnSpans = groupedColumnData[columnName];
        if (columnSpans.length === 0 ||
            columnSpans[columnSpans.length - 1].spanAttributeValue !== rowAttr) {
          columnSpans.push(new ColumnSpan(i, i, rowAttr))
        } else {
          let prevSpan = columnSpans[columnSpans.length - 1];
          prevSpan.endGeneIndex = i;
        }
      }
    }

    this.columnDisplayDataMap = {};

    for (let i = 0; i < this.selectedConfigNames.length; i++) {
      const columnName = this.selectedConfigNames[i];
      const columnSpans = groupedColumnData[columnName];

      const displayData = columnSpans.map(colSpan => {
        const geneCount = colSpan.endGeneIndex - colSpan.startGeneIndex + 1;

        let color = "#8888";  // default
        const attrConfig =
          this.visColumnConfigs[i].attr_values[colSpan.spanAttributeValue];

        if (attrConfig) {
          color = attrConfig.color + '8';  // make transparent
        }

        return new ColumnDisplayData(this.lineHeight * geneCount, this.columnWidth,
                                     this.geneWidth + i * this.columnWidth,
                                     colSpan.startGeneIndex * this.lineHeight,
                                     color);

      });

      this.columnDisplayDataMap[columnName] = displayData;
    }

    console.log(this.columnDisplayDataMap);
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
    this.geneDisplayData = [];

    this.geneMap = {};

    for (let i = 0; i < this.genes.length; i++) {
      const gene = this.genes[i];
      const geneDomId = this.makeGeneDomId(gene.uniquename, i);

      this.geneMap[geneDomId] = gene;

      let color = this.geneColor(geneDomId, false);

      this.geneDisplayData.push({
        'id': geneDomId,
        'height': this.lineHeight,
        'width': this.geneWidth + this.selectedConfigNames.length * this.columnWidth,
        'x': 0,
        'y': i * this.lineHeight,
        color,
      });
    }
  }

  getGeneDisplayData(): Array<GeneDisplayData> {
    return this.geneDisplayData;
  }

  getColumnDisplayDataMap(): ColumnDisplayDataMap {
    return this.columnDisplayDataMap
  }

  confSelectionChanged(): void {
    this.selectedConfigs = [];
    for (const visConfig of this.visColumnConfigs) {
      if (this.selectedColumns[visConfig.name]) {
        this.selectedConfigs.push(visConfig);
        this.selectedConfigNames.push(visConfig.name);
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
        return '#ddd';
      } else {
        return '#f8f8f8';
      }
    } else {
      return '#f0f';
    }
  }

  showResults(): boolean {
    return this.selectedConfigs.length > 0 && this.results !== null &&
      this.geneDisplayData !== null;
  }

  ngOnInit() {
  }
}
