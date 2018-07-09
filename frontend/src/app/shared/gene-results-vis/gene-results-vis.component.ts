import { Component, OnInit, Input } from '@angular/core';
import { GeneShort } from '../../pombase-api.service';
import { getAppConfig, VisColumnConfig } from '../../config';
import { QueryService } from '../../query.service';
import { GeneListNode, GeneQuery, QueryOutputOptions, QueryResult, ResultRow } from '../../pombase-query';
import { Util } from '../util';

class GeneDisplayData {
  constructor(public id: string, public geneIndex: number,
              public color: string) {};
}

class ColumnSpan {
  constructor(public startGeneIndex: number,
              public endGeneIndex: number,
              public spanAttributeValue) {};
}

class ColumnDisplayData {
  constructor(public startIndex: number, public endIndex: number,
              public columnIndex: number,
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

  geneDisplayData: Array<GeneDisplayData> = [];
  geneMap = {};

  genesByUniquename = {};

  columnDisplayDataMap: ColumnDisplayDataMap = {};

  currentGene = null;
  currentGeneDomId = null;
  visColumnConfigs: Array<VisColumnConfig> = [];
  visColumnNames: Array<string> = [];

  selectedColumns: { [index: string]: boolean; } = {};
  selectedConfigs: Array<VisColumnConfig> = [];
  selectedConfigNames: Array<string> = [];

  sortByField = 'gene-name';

  lineHeight = 3;
  columnWidth = 30;
  geneWidth = 40;
  columnGap = 5;

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

  setSortBy(fieldName: string) {
    this.sortByField = fieldName;
    this.processColumnResults();
    this.makeGeneData();
  }

  sortResultRows(resultRows: ResultRow[]): void {
    const geneNameSort = (a: ResultRow, b: ResultRow) =>
      Util.geneCompare(this.genesByUniquename[a.gene_uniquename],
                       this.genesByUniquename[b.gene_uniquename]);

    if (this.sortByField === 'gene-name') {
      resultRows.sort(geneNameSort);
    } else {
      const byField = (a: ResultRow, b: ResultRow) => {
        return a[this.sortByField].localeCompare(b[this.sortByField]);
      }

      resultRows.sort(byField);
    }
  }

  changeLineHeight(delta: number): void {
    if (delta < 0 && this.lineHeight < 2) {
      return;
    }

    this.lineHeight += delta;
  }

  processColumnResults(): void {
    let groupedColumnData: { [columnName: string]: Array<ColumnSpan> } = {};

    const visColumnNames = this.visColumnConfigs.map(c => c.name);

    visColumnNames.map(columnName => groupedColumnData[columnName] = []);

    let resultRows = this.results.rows;

    this.sortResultRows(resultRows);

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

        let color = '#888';  // default
        const attrConfig =
          this.visColumnConfigs[i].attr_values[colSpan.spanAttributeValue];

        if (attrConfig) {
          color = attrConfig.color;
        }

        return new ColumnDisplayData(colSpan.startGeneIndex,
                                     colSpan.endGeneIndex,
                                     i,
                                     color);

      });

      this.columnDisplayDataMap[columnName] = displayData;
    }
  }

  queryColumnResults(): void {
    const geneListNode = new GeneListNode(this.genes);
    const geneListQuery = new GeneQuery(geneListNode);

    const visColumnNames = this.visColumnConfigs.map(c => c.name);
    const outputOptions =
      new QueryOutputOptions(['gene_uniquename', ...visColumnNames], 'none');
    this.queryService.postQuery(geneListQuery, outputOptions)
      .subscribe(results => {
        this.results = results;
        this.makeGeneData();
        this.processColumnResults()
      });
  }

  makeGeneData(): void {
    this.geneDisplayData = [];

    this.geneMap = {};

    for (let i = 0; i < this.results.rows.length; i++) {
      const row = this.results.rows[i];
      const geneUniquename = row.gene_uniquename;
      const gene = this.genesByUniquename[geneUniquename];
      const geneDomId = this.makeGeneDomId(gene.uniquename, i);

      this.geneMap[geneDomId] = gene;

      let color = this.geneColor(geneDomId, false);

      this.geneDisplayData.push({
        id: geneDomId,
        geneIndex: i,
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
    this.genes.map(gene => this.genesByUniquename[gene.uniquename] = gene);
  }
}
