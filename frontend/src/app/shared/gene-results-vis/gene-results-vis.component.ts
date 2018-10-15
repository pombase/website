import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { GeneShort } from '../../pombase-api.service';
import { getAppConfig, VisColumnConfig } from '../../config';
import { QueryService, HistoryEntry } from '../../query.service';
import { GeneListNode, GeneQuery, QueryOutputOptions, QueryResult, ResultRow, TermAndName } from '../../pombase-query';
import { Util } from '../util';

class GeneDisplayData {
  constructor(public id: string, public geneIndex: number, public geneUniquename: string) {};
}

class ColumnDisplayData {
  displayName: string = '';
  constructor(public columnConfig: VisColumnConfig,
              public rowAttr: string,
              public startIndex: number, public endIndex: number,
              public color: string, public geneUniquenames: Array<string>) {
                if (columnConfig.attr_values[rowAttr] && columnConfig.attr_values[rowAttr].display_name) {
                  this.displayName = columnConfig.attr_values[rowAttr].display_name;
                } else {
                  this.displayName = rowAttr;
                }
              };
}

class GeneData {
  cleanRow: Object;

  cleanGORow(row, fieldName: string): void {
    if (row[fieldName]) {
      if (row[fieldName] instanceof Object) {
        row[fieldName] = row[fieldName].term.name;
      }
    } else {
      row[fieldName] = 'none';
    }
  }

  cleanResults(row: ResultRow): Object {
    let cleanRow: Object = Object.assign({}, row);
    this.cleanGORow(cleanRow, 'go_component');
    this.cleanGORow(cleanRow, 'go_process_superslim');
    this.cleanGORow(cleanRow, 'go_function');

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
  @ViewChild('visSVG') visSvg: ElementRef;

  geneDataMap: { [geneUniquename: string]: GeneData } = {};

  sortedGeneUniquenames = [];

  geneDisplayData: Array<GeneDisplayData> = [];
  columnDisplayDataMap: { [colName: string]: Array<ColumnDisplayData> } = {};

  currentData: ColumnDisplayData = null;
  currentGene: GeneData = null;

  visColumnConfigMap: { [colName: string]: VisColumnConfig } = {};
  visColumnConfigs: Array<VisColumnConfig> = [];
  visColumnNames: Array<string> = [];

  queryColumnNames = new Set<string>();

  activeColumns: { [index: string]: boolean; } = {};
  activeConfigNames: Array<string> = [];

  sortByFields = [];

  lineHeight = 3;
  columnWidth = 35;
  geneWidth = 40;
  columnGap = 10;
  geneListMaxLength = 40;
  colLabelHeight = 120;
  colLabelXOffset = 15;

  selectedGenes: { [index: string]: boolean } = {};
  selectedGeneList: Array<GeneData> = [];

  constructor(private queryService: QueryService,
              private router: Router) {
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

      this.activeColumns[colConfig.name] = true;

      this.sortByFields.push(colConfig.name);
    });

    this.sortByFields.push('gene-name');
  }

  saveAsSVG() {
    const el = this.visSvg.nativeElement;
    el.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    const svgData = el.outerHTML;
    const preface = '<?xml version="1.0" standalone="no"?>\r\n';
    const svgBlob = new Blob([preface, svgData], {type:"image/svg+xml;charset=utf-8"});
    const svgUrl = URL.createObjectURL(svgBlob);
    const downloadLink = document.createElement("a");
    downloadLink.href = svgUrl;
    downloadLink.download = name;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
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

  private getSelectedGeneUniquenames() {
    let selectedGeneUniquenames = [];
    for (const geneUniquename of Object.keys(this.selectedGenes)) {
      if (this.selectedGenes[geneUniquename]) {
        selectedGeneUniquenames.push(geneUniquename);
      }
    }
    return selectedGeneUniquenames;
  }

  setSelectedGeneList(): void {
    const selectedGeneUniquenames = this.getSelectedGeneUniquenames();

    const compareGenes = (geneUniquenameA: string, geneUniquenameB: string) => {
      return Util.geneCompare(this.geneDataMap[geneUniquenameA].getGeneShort(),
                              this.geneDataMap[geneUniquenameB].getGeneShort());
    };

    selectedGeneUniquenames.sort(compareGenes);

    this.selectedGeneList =
      selectedGeneUniquenames.map(uniquename => this.geneDataMap[uniquename]);
  }

  geneclick($event: Event) {
    const eventTargetElement = $event.target as Element;
    const domId = eventTargetElement.id;

    if (domId) {
      const [geneIndex, geneUniquename] = this.geneUniquenameFromDomId(domId);

      this.toggleSelectedGene(geneUniquename);
    }
  }

  toggleSelectedGene(geneUniquename: string): void {
    this.selectedGenes[geneUniquename] = !this.selectedGenes[geneUniquename];
    this.setSelectedGeneList();
  }

  setSelectedGene(geneUniquename: string): any {
    this.selectedGenes[geneUniquename] = true;
    this.setSelectedGeneList();
  }

  dataClick($event: MouseEvent, columnData: ColumnDisplayData): void {
    for (const geneUniquename of columnData.geneUniquenames) {
      if ($event.ctrlKey) {
        this.setSelectedGene(geneUniquename);
      } else {
        this.toggleSelectedGene(geneUniquename);
      }
    }
    $event.stopPropagation();
  }

  geneEnter($event: Event, geneData: GeneDisplayData) {
    this.currentData = null;
    this.currentGene = this.geneDataMap[geneData.geneUniquename];
  }

  geneLeave($event: Event) {
    this.currentGene = null;
  }

  dataEnter($event: Event, columnData: ColumnDisplayData) {
    this.currentGene = null;
    this.currentData = columnData;
  }

  dataLeave($event: Event) {
    this.currentData = null;
  }

  clearSelected(): void {
    this.selectedGenes = {};
    this.setSelectedGeneList();
  }

  sendToQueryBuilder(): void {
    const selectedGenes =
      this.getSelectedGeneUniquenames().map(uniquename => {
        return this.geneDataMap[uniquename].getGeneShort();
      });

    const part = new GeneListNode(selectedGenes);
    const geneQuery = new GeneQuery(part);
    const callback = (historyEntry: HistoryEntry) => {
      this.router.navigate(['/query/results/from/history/', historyEntry.getEntryId()]);
    };
    this.queryService.saveToHistory(geneQuery, callback);
  }

  setSortBy(fieldName: string) {
    if (this.sortByFields[0] === fieldName) {
      return;
    }
    const idx = this.sortByFields.indexOf(fieldName);

    if (idx !== -1) {
      this.sortByFields.splice(idx, 1);
    }

    this.sortByFields.unshift(fieldName);

    this.sortGeneUniquenames();
    this.updateDisplayData();
  }

  doSortByField(geneUniquenameA: string, geneUniquenameB: string,
                fieldNames: Array<string>): number {
    let res;
    const sortFieldName = fieldNames[0];
    if (sortFieldName === 'gene-name') {
      res = Util.geneCompare(this.geneDataMap[geneUniquenameA].getGeneShort(),
                             this.geneDataMap[geneUniquenameB].getGeneShort());
    } else {
      const fieldConfig = this.visColumnConfigMap[sortFieldName];
      const defaultOrder = fieldConfig.default_order;
      const fieldAValue = this.geneDataMap[geneUniquenameA].getField(sortFieldName);
      const fieldBValue = this.geneDataMap[geneUniquenameB].getField(sortFieldName);

      if (defaultOrder === 'sort_priority') {
        const geneAPriority = fieldConfig.attr_values[fieldAValue].sort_priority;
        const geneBPriority = fieldConfig.attr_values[fieldBValue].sort_priority;

        res = geneAPriority - geneBPriority;
      } else {
        if (defaultOrder === 'forward') {
          res = fieldAValue.localeCompare(fieldBValue);
        } else {
          res = fieldBValue.localeCompare(fieldAValue);
        }
      }
    }

    if (res === 0 && fieldNames.length > 1) {
      return this.doSortByField(geneUniquenameA, geneUniquenameB, fieldNames.slice(1));
    } else {
      return res;
    }
  }

  sortGeneUniquenames(): void {
    this.sortedGeneUniquenames.sort((a, b) => {
      return this.doSortByField(a, b, this.sortByFields);
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
      for (const columnName of this.activeConfigNames) {
        const rowAttr = this.geneDataMap[geneUniquename].getField(columnName);
        let prevRowAttr: string;

        if (idx === 0) {
          prevRowAttr = null;
        } else {
          const prevGeneData = this.geneDataMap[this.sortedGeneUniquenames[idx - 1]];
          prevRowAttr = prevGeneData.getField(columnName);
        }

        let columnDisplayDataList = this.columnDisplayDataMap[columnName];
        if (!prevRowAttr ||
            this.geneDataMap[geneUniquename].getField(columnName) !== prevRowAttr) {
          let color = '#888';  // default
          const attrConfig =
            this.visColumnConfigMap[columnName].attr_values[rowAttr];

          if (attrConfig) {
            color = attrConfig.color;
          }

          const columnConfig = this.visColumnConfigMap[columnName];
          const columnDisplayData =
            new ColumnDisplayData(columnConfig, rowAttr, idx, idx, color, [geneUniquename]);

          columnDisplayDataList.push(columnDisplayData);
        } else {
          let prevSpan = columnDisplayDataList[columnDisplayDataList.length - 1];
          prevSpan.endIndex = idx;
          prevSpan.geneUniquenames.push(geneUniquename);
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

      this.geneDisplayData.push(new GeneDisplayData(
        geneDomId, geneIndex, geneUniquename
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
    this.activeConfigNames = [];
    for (const visConfigName of this.visColumnNames) {
      if (this.activeColumns[visConfigName]) {
        this.activeConfigNames.push(visConfigName);
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

  showResults(): boolean {
    return this.activeConfigNames.length > 0 && Object.keys(this.geneDataMap).length > 0;
  }

  ngOnInit() {
    this.sortedGeneUniquenames = this.genes.map(geneShort => geneShort.uniquename);

    this.confSelectionChanged();
  }
}
