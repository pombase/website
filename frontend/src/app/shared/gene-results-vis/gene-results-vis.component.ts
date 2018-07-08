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

      for (const columnName of visColumnNames) {
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

    for (let i = 0; i < visColumnNames.length; i++) {
      const columnName = visColumnNames[i];
      const columnSpans = groupedColumnData[columnName];

      const displayData = columnSpans.map(colSpan => {
        const geneCount = colSpan.endGeneIndex - colSpan.startGeneIndex + 1;

        let color = "#888";  // default
        const attrConfig =
          this.visColumnConfigs[i].attr_values[colSpan.spanAttributeValue];

        if (attrConfig) {
          color = attrConfig.color;
        }

        return new ColumnDisplayData(3 * geneCount, 20,
                                     50 + i * 10, colSpan.startGeneIndex * 3,
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
        'height': 3,
        'width': 500,
        'x': 0,
        'y': i * 3,
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
      this.geneDisplayData !== null;
  }

  ngOnInit() {
  }
}
