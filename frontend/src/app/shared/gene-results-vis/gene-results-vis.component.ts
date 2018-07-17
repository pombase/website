import { Component, OnInit, Input } from '@angular/core';
import { GeneShort } from '../../pombase-api.service';
import { getAppConfig, VisColumnConfig } from '../../config';
import { QueryService } from '../../query.service';
import { GeneListNode, GeneQuery, QueryOutputOptions, QueryResult, ResultRow, TermAndName } from '../../pombase-query';
import { Util } from '../util';

class GeneDisplayData {
  constructor(public id: string, public geneIndex: number,
              public color: string) {};
}

class ColumnDisplayData {
  constructor(public startIndex: number, public endIndex: number,
              public color: string) {};
}

class GeneData {
  cleanRow: Object;

  cleanResults(row: ResultRow): Object {
    let cleanRow: Object = Object.assign({}, row);
    if (cleanRow['go_component']) {
      if (cleanRow['go_component'] instanceof Object) {
        cleanRow['go_component'] = cleanRow['go_component'].term.name;
      }
    } else {
      cleanRow['go_component'] = 'none';
    }

    if (!cleanRow['ortholog_taxonids']) {
      cleanRow['ortholog_taxonids'] = [];
    }

    if (cleanRow['ortholog_taxonids']) {
      const rowTaxonids = cleanRow['ortholog_taxonids'];
      delete cleanRow['ortholog_taxonids'];
      for (const config of this.visColumnConfigs) {
        if (!config.name.startsWith('ortholog_taxonids')) {
          continue;
        }
        let attrValue = 'absent';
        for (const taxonId of rowTaxonids) {
          const fullName = 'ortholog_taxonids:' + taxonId;
          if (fullName === config.name) {
            attrValue = 'present';
          }
        }
        cleanRow[config.name] = attrValue;
      }
    }

    return cleanRow;
  }

  getField(fieldName: string): string {
    return this.cleanRow[fieldName];
  }

  getGeneShort(): GeneShort {
    return this.geneShort;
  }

  constructor(private visColumnConfigs: Array<VisColumnConfig>,
              private geneShort: GeneShort, row: ResultRow) {
    this.cleanRow = this.cleanResults(row);
  };
}

@Component({
  selector: 'app-gene-results-vis',
  templateUrl: './gene-results-vis.component.html',
  styleUrls: ['./gene-results-vis.component.css']
})
export class GeneResultsVisComponent implements OnInit {
  @Input() genes: Array<GeneShort> = [];

  geneDataMap: { [geneUniquename: string]: GeneData } = {};

  sortedGeneUniquenames = [];

  geneDisplayData: Array<GeneDisplayData> = [];
  columnDisplayDataMap: { [colName: string]: Array<ColumnDisplayData> } = {};

  currentGene = null;

  visColumnConfigMap: { [colName: string]: VisColumnConfig } = {};
  visColumnConfigs: Array<VisColumnConfig> = [];
  visColumnNames: Array<string> = [];

  queryColumnNames = new Set<string>();

  selectedColumns: { [index: string]: boolean; } = {};
  selectedConfigNames: Array<string> = [];

  sortByField = 'gene-name';
  previousSortByField = 'gene-name';

  lineHeight = 3;
  columnWidth = 30;
  geneWidth = 40;
  columnGap = 5;

  constructor(private queryService: QueryService) {
    const colConfigs = getAppConfig().geneResults.visualisation.columns;
    this.visColumnConfigMap = {};
    this.visColumnConfigs = [];
    this.visColumnNames = [];

    const nameRE = /(.*):(.*)/;

    colConfigs.map(colConfig => {
      this.visColumnNames.push(colConfig.name);
      this.visColumnConfigs.push(colConfig);
      this.visColumnConfigMap[colConfig.name] = colConfig;

      let nameMatch = nameRE.exec(colConfig.name);

      if (nameMatch) {
        this.queryColumnNames.add(nameMatch[1]);
      } else {
        this.queryColumnNames.add(colConfig.name);
      }

      this.selectedColumns[colConfig.name] = false;
    });
  }

  makeGeneDataMap(queryResult: QueryResult): { [geneUniquename: string]: GeneData } {
    let geneMap = {};
    this.genes.map(geneShort => {
      geneMap[geneShort.uniquename] = geneShort;
    });
    let resultMap = {};
    queryResult.rows.map(row => {
      const geneShort = geneMap[row.gene_uniquename];
      resultMap[row.gene_uniquename] = new GeneData(this.visColumnConfigs, geneShort, row);
    });
    return resultMap;
  }

  geneUniquenameFromDomId(domId: string): [number, string] {
    const idMatch = /gene-(\d+)-(.*)/.exec(domId);

    if (idMatch) {
      return [parseInt(idMatch[1], 10), idMatch[2]];
    } else {
      return [-1, null];
    }
  }

  mouseenter($event: Event) {
    const eventTargetElement = $event.target as Element;
    const domId = eventTargetElement.id;

    if (domId) {
      const [geneIndex, geneUniquename] = this.geneUniquenameFromDomId(domId);

      this.currentGene = this.geneDataMap[geneUniquename];
      const geneColor = this.geneColor(geneIndex, true);
      eventTargetElement.setAttribute('fill', geneColor);
    } else {
      this.currentGene = null;
    }
  }

  mouseleave($event: Event) {
    const eventTargetElement = $event.target as Element;
    const domId = eventTargetElement.id;

    this.currentGene = null;

    const [geneIndex, geneUniquename] = this.geneUniquenameFromDomId(domId);

    const geneColor = this.geneColor(geneIndex, false);
    eventTargetElement.setAttribute('fill', geneColor);
  }

  setSortBy(fieldName: string) {
    if (this.sortByField === fieldName) {
      return;
    }
    this.previousSortByField = this.sortByField;
    this.sortByField = fieldName;
    this.sortGeneUniquenames();
    this.updateDisplayData();
  }

  doSortByField(geneUniquenameA: string, geneUniquenameB: string,
                fieldName: string, secondFieldName: string): number {
    let res;
    if (fieldName === 'gene-name') {
      res = Util.geneCompare(this.geneDataMap[geneUniquenameA].getGeneShort(),
                             this.geneDataMap[geneUniquenameB].getGeneShort());
    } else {
      const fieldA = this.geneDataMap[geneUniquenameA].getField(fieldName);
      const fieldB = this.geneDataMap[geneUniquenameB].getField(fieldName);
      res = fieldA.localeCompare(fieldB);
    }

    if (res === 0 && secondFieldName !== null) {
      return this.doSortByField(geneUniquenameA, geneUniquenameB, secondFieldName, null);
    } else {
      return res;
    }
  }

  sortGeneUniquenames(): void {
    this.sortedGeneUniquenames.sort((a, b) => {
      return this.doSortByField(a, b, this.sortByField, this.previousSortByField);
    });
  }

  changeLineHeight(delta: number): void {
    if (delta < 0 && this.lineHeight < 2) {
      return;
    }

    this.lineHeight += delta;
  }

  processColumnResults(): void {
    this.visColumnNames.map((columnName, i) => {
      this.columnDisplayDataMap[columnName] = [];
    });

    this.sortedGeneUniquenames.map((geneUniquename, idx) => {
      for (const columnName of this.selectedConfigNames) {
        const rowAttr = this.geneDataMap[geneUniquename].getField(columnName);
        let prevRowAttr;

        if (idx === 0) {
          prevRowAttr = null;
        } else {
          const prevGeneUniquename = this.geneDataMap[this.sortedGeneUniquenames[idx - 1]];
          prevRowAttr = prevGeneUniquename.getField(columnName);
        }

        let columnDisplayData = this.columnDisplayDataMap[columnName];
        if (!prevRowAttr ||
            columnDisplayData[columnDisplayData.length - 1] !== prevRowAttr) {
          let color = '#888';  // default
          const attrConfig =
            this.visColumnConfigMap[columnName].attr_values[rowAttr];

          if (attrConfig) {
            color = attrConfig.color;
          }
          columnDisplayData.push(new ColumnDisplayData(idx, idx, color))
        } else {
          let prevSpan = ColumnDisplayData[columnDisplayData.length - 1];
          prevSpan.endGeneIndex = idx;
        }
      }
    });
  }

  runQuery(): void {
    const geneListNode = new GeneListNode(this.genes);
    const geneListQuery = new GeneQuery(geneListNode);

    const outputOptions =
      new QueryOutputOptions(['gene_uniquename', ...Array.from(this.queryColumnNames)], 'none');
    this.queryService.postQuery(geneListQuery, outputOptions)
      .subscribe(results => {
        this.geneDataMap = this.makeGeneDataMap(results);
        this.sortGeneUniquenames();
        this.updateDisplayData();
      });
  }

  updateDisplayData(): void {
    if (Object.keys(this.geneDataMap).length > 0) {
      this.makeGeneData();
      this.processColumnResults()
    }
  }

  makeGeneData(): void {
    this.geneDisplayData = [];

    this.sortedGeneUniquenames.map((geneUniquename, geneIndex) => {
      const gene = this.geneDataMap[geneUniquename];
      const geneDomId = this.makeGeneDomId(geneUniquename, geneIndex);

      let color = this.geneColor(geneIndex, false);

      this.geneDisplayData.push(new GeneDisplayData(
        geneDomId,
        geneIndex,
        color,
      ));
    });
  }

  getGeneDisplayData(): Array<GeneDisplayData> {
    return this.geneDisplayData;
  }

  getColumnDisplayDataMap(): { [configName: string]: Array<ColumnDisplayData> } {
    return this.columnDisplayDataMap
  }

  confSelectionChanged(): void {
    this.selectedConfigNames = [];
    for (const visConfigName of this.visColumnNames) {
      if (this.selectedColumns[visConfigName]) {
        this.selectedConfigNames.push(visConfigName);
      }
    }

    if (Object.keys(this.geneDataMap).length === 0) {
      this.runQuery();
    } else {
      this.updateDisplayData();
    }
  }

  makeGeneDomId(geneUniquename: string, index: number): string {
    return 'gene-' + index + '-'  + geneUniquename;
  }

  geneColor(geneIndex: number, isCurrent: boolean): string {
    if (isCurrent) {
      return '#88b';
    }

    if (geneIndex % 10 === 0) {
      return '#ddd';
    } else {
      return '#f8f8f8';
    }
  }

  showResults(): boolean {
    return this.selectedConfigNames.length > 0 && Object.keys(this.geneDataMap).length > 0;
  }

  ngOnInit() {
    this.sortedGeneUniquenames = this.genes.map(geneShort => geneShort.uniquename);
  }
}
