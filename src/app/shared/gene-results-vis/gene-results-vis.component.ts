import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { GeneShort } from '../../pombase-api.service';
import { getAppConfig, GeneResultsFieldConfig } from '../../config';
import { QueryService, HistoryEntry, QueryOutputOptions } from '../../query.service';
import { GeneListNode, GeneQuery, QueryResult, ResultRow, TermShort } from '../../pombase-query';
import { Util } from '../util';
import { GeneVisSettingsComponent } from '../../gene-vis-settings/gene-vis-settings.component';
import { SettingsService } from '../../settings.service';

class GeneDisplayData {
  constructor(public id: string, public geneIndex: number, public geneUniquename: string) {};
}

class ColumnDisplayData {
  displayName = '';
  constructor(public columnConfig: GeneResultsFieldConfig,
              public rowAttr: string,
              public startIndex: number, public endIndex: number,
              public color: string, public geneUniquenames: Array<string>) {
                if (columnConfig.attrValuesMap &&
                    columnConfig.attrValuesMap.get(rowAttr) &&
                    columnConfig.attrValuesMap.get(rowAttr)!.display_name) {
                  this.displayName = columnConfig.attrValuesMap.get(rowAttr)!.display_name;
                } else {
                  this.displayName = rowAttr;
                }
              };
}

class GeneData {
  cleanRow: any;

  cleanAttributeRow(row: any, fieldName: string): void {
    if (row[fieldName]) {
      if (row[fieldName] instanceof Object) {
        row[fieldName] = row[fieldName].term.name;
      }
    } else {
      row[fieldName] = 'unknown';
    }
  }

  cleanResults(row: ResultRow): Object {
    let cleanRow: any = Object.assign({}, row);
    this.cleanAttributeRow(cleanRow, 'go_component');
    this.cleanAttributeRow(cleanRow, 'go_process_superslim');
    this.cleanAttributeRow(cleanRow, 'go_function');
    this.cleanAttributeRow(cleanRow, 'characterisation_status');
    this.cleanAttributeRow(cleanRow, 'protein_length_bin');

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

    this.visColumnConfigs.map(conf => {
      if (conf.column_type == 'user_vis_term') {
        if (row.subsets && row.subsets.includes(conf.name)) {
          cleanRow[conf.name] = 'annotated';
        } else {
          cleanRow[conf.name] = 'not_annotated';
        }
      }
    });

    return cleanRow;
  }

  getField(fieldName: string): string {
    return this.cleanRow[fieldName];
  }

  getGeneShort(): GeneShort {
    return this.geneShort;
  }

  constructor(private visColumnConfigs: Array<GeneResultsFieldConfig>,
              private geneShort: GeneShort, row: ResultRow) {
    this.cleanRow = this.cleanResults(row);
  };
}

class AttrValueConf {
  constructor(public attrValue: string, public displayName: string, public color: string) {}
}

@Component({
  selector: 'app-gene-results-vis',
  templateUrl: './gene-results-vis.component.html',
  styleUrls: ['./gene-results-vis.component.css']
})
export class GeneResultsVisComponent implements OnInit {
  @Input() genes: Array<GeneShort> = [];
  // probably the query name
  @Input() geneListDescription: string;
  @ViewChild('visSVG') visSvg: ElementRef;

  geneDataMap: { [geneUniquename: string]: GeneData } = {};

  sortedGeneUniquenames: Array<string> = [];

  geneDisplayData: Array<GeneDisplayData> = [];
  columnDisplayDataMap: { [colName: string]: Array<ColumnDisplayData> } = {};

  currentData?: ColumnDisplayData;
  currentGene?: GeneData;

  visColumnConfigMap: { [colName: string]: GeneResultsFieldConfig } = {};
  visColumnConfigs: Array<GeneResultsFieldConfig> = [];
  visColumnNames: Array<string> = [];

  queryColumnNames = new Set<string>();

  activeColumns: { [index: string]: boolean; } = {};
  activeColumnNames: Array<string> = [];

  attrValuesInUse: { [colName: string]: Array<AttrValueConf> };

  sortByFields: Array<string> = [];

  geneListMaxLength = 40;

  leftMargin = 35;
  lineHeight = 3;
  columnWidth = 35;
  geneWidth = 40;
  columnGap = 10;
  colLabelHeight = 120;
  colLabelXOffset = 15;
  keyWidth = 300;
  keyHeaderHeight = 15;
  keyRectHeight = 10;
  keyRectWidth = 10;
  keyAttrGap = 2;
  keyHeaderGap = 20;

  keyHighlight?: string;

  selectedGenes: { [index: string]: boolean } = {};
  selectedGeneList: Array<GeneData> = [];

  attrValueCounts: { [columnName: string]: { [attrName: string]: number } } = {};

  downloadModalRef: BsModalRef;

  extraColumns: Array<TermShort> = [];
  columnsSubscription: Subscription;
  loading: boolean;

  constructor(private settingsService: SettingsService,
              private queryService: QueryService,
              private router: Router,
              private modalService: BsModalService) {
  }

  saveAsSVG() {
    const el = this.visSvg.nativeElement;
    el.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    const svgData = el.outerHTML;
    const preface = '<?xml version="1.0" standalone="no"?>\r\n';
    const svgBlob = new Blob([preface, svgData], {type: 'image/svg+xml;charset=utf-8'});
    const svgUrl = URL.createObjectURL(svgBlob);
    const downloadLink = document.createElement('a');
    downloadLink.href = svgUrl;
    downloadLink.download = 'result-visualisation.svg';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }

  makeGeneDataMap(queryResult: QueryResult): { [geneUniquename: string]: GeneData } {
    let geneMap: { [key: string]: GeneShort } = {};
    this.genes.map(geneShort => {
      geneMap[geneShort.uniquename] = geneShort;
    });
    let resultMap: { [key: string]: GeneData } = {};
    queryResult.getRows().map(row => {
      const geneShort = geneMap[row.gene_uniquename];
      resultMap[row.gene_uniquename] = new GeneData(this.visColumnConfigs, geneShort, row);
    });
    return resultMap;
  }

  geneUniquenameFromDomId(domId: string): [number, string|undefined] {
    const idMatch = /gene-(\d+)-(.*)/.exec(domId);

    if (idMatch) {
      return [parseInt(idMatch[1], 10), idMatch[2]];
    } else {
      return [-1, undefined];
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
      const [, geneUniquename] = this.geneUniquenameFromDomId(domId);

      if (geneUniquename) {
        this.toggleSelectedGene(geneUniquename);
      }
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

  geneEnter(_: Event, geneData: GeneDisplayData) {
    this.currentData = undefined;
    this.keyHighlight = undefined;
    this.currentGene = this.geneDataMap[geneData.geneUniquename];
  }

  geneLeave(_: Event) {
    this.currentGene = undefined
  }

  dataEnter(_: Event, columnData: ColumnDisplayData) {
    this.currentGene = undefined;
    this.currentData = columnData;
    this.keyHighlight = columnData.columnConfig.name + ':' + columnData.rowAttr;
  }

  dataLeave(_: Event) {
    this.currentData = undefined;
    this.keyHighlight = undefined;
  }

  clearSelected(): void {
    this.selectedGenes = {};
    this.setSelectedGeneList();
  }

  countOfBin(currentData: ColumnDisplayData): string {
    const higlightedCount = currentData.geneUniquenames.length
    const totalForBin = this.attrValueCounts[currentData.columnConfig.name][currentData.rowAttr];
    if (higlightedCount === totalForBin) {
      if (totalForBin > 2) {
        return `All ${totalForBin} genes`;
      } else {
        if (totalForBin == 2) {
          return 'Both genes';
        } else {
          return 'The single gene';
        }
      }
    } else {
      return `${higlightedCount}/${totalForBin} genes`;
    }
  }

  selectedGenesDescription(): string {
    let desc = '';
    if (this.selectedGeneList.length === 1) {
      desc = 'one selected gene'
    } else {
      desc = this.selectedGeneList.length + ' selected genes';
    }
    return desc;
  }

  sendToQueryBuilder(): void {
    const selectedGenes =
      this.getSelectedGeneUniquenames().map(uniquename => {
        return this.geneDataMap[uniquename].getGeneShort();
      });

    const queryName = this.selectedGenesDescription() + ' from visualisation' +
      (this.geneListDescription ? ' of ' + this.geneListDescription : '');

    const part = new GeneListNode(queryName, selectedGenes);
    const geneQuery = new GeneQuery(part);
    const callback = (historyEntry: HistoryEntry) => {
      this.router.navigate(['/results/from/id/', historyEntry.getEntryId()]);
    };
    this.queryService.runAndSaveToHistory(geneQuery, callback);
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
      const fieldAValue = this.geneDataMap[geneUniquenameA].getField(sortFieldName);
      const fieldBValue = this.geneDataMap[geneUniquenameB].getField(sortFieldName);

      const geneAPriority = fieldConfig.attrValuesMap!.get(fieldAValue)!.sort_priority;
      const geneBPriority = fieldConfig.attrValuesMap!.get(fieldBValue)!.sort_priority;

      res = geneAPriority - geneBPriority;
    }

    if (res === 0 && fieldNames.length > 1) {
      return this.doSortByField(geneUniquenameA, geneUniquenameB, fieldNames.slice(1));
    } else {
      return res;
    }
  }

  isCurrentSortField(colName: string) {
    return this.sortByFields.length > 0 && this.sortByFields[0] !== colName;
  }

  isUserColumn(colConfig: GeneResultsFieldConfig): boolean {
    return colConfig.column_type == 'user_vis_term'
  }

  removeUserColumn(colName: string) {
    const sortIndex = this.sortByFields.indexOf(colName);
    if (sortIndex != -1) {
      this.sortByFields.splice(sortIndex, 1);
    }
    this.settingsService.removeExtraGeneVisColumn(colName);
  }

  getColumnTitle(colConfig: GeneResultsFieldConfig): string {
    if (colConfig.column_type == 'user_vis_term') {
      return `${colConfig.name}: ${colConfig.display_name}`;
    } else {
      return '';
    }
  }

  getGeneWidth(): number {
    if (this.lineHeight < 0.9) {
      return 5;
    } else {
      return this.geneWidth;
    }
  }

  sortGeneUniquenames(): void {
    this.sortedGeneUniquenames.sort((a, b) => {
      return this.doSortByField(a, b, this.sortByFields);
    });
  }

  changeLineHeight(delta: number): void {
    if (this.lineHeight < 1.1) {
      if (delta < 0) {
        if (this.lineHeight * this.getGeneDisplayData().length > 10) {
          this.lineHeight = this.lineHeight / 1.5;
        }
      } else {
        if (this.lineHeight > 0.9) {
          this.lineHeight = 2;
        } else {
          this.lineHeight = this.lineHeight * 1.5;
        }
      }
    } else {
      this.lineHeight = Math.ceil(this.lineHeight);
      if (this.lineHeight < 10 || delta < 0) {
        this.lineHeight += delta;
      }
    }
  }

  processColumnResults(): void {
    this.attrValueCounts = {};

    this.visColumnNames.map((columnName, _) => {
      this.columnDisplayDataMap[columnName] = [];
      this.attrValueCounts[columnName] = {};
    });

    this.sortedGeneUniquenames.map((geneUniquename, idx) => {
      for (const columnName of this.activeColumnNames) {
        const rowAttr = this.geneDataMap[geneUniquename].getField(columnName);

        if (!this.attrValueCounts[columnName][rowAttr]) {
          this.attrValueCounts[columnName][rowAttr] = 0;
        }
        this.attrValueCounts[columnName][rowAttr]++;

        let prevRowAttr: string|undefined;

        if (idx === 0) {
          prevRowAttr = undefined;
        } else {
          const prevGeneData = this.geneDataMap[this.sortedGeneUniquenames[idx - 1]];
          prevRowAttr = prevGeneData.getField(columnName);
        }

        let columnDisplayDataList = this.columnDisplayDataMap[columnName];
        if (!prevRowAttr ||
            this.geneDataMap[geneUniquename].getField(columnName) !== prevRowAttr) {
          let color = '#888';  // default
          const attrConfig =
            this.visColumnConfigMap[columnName].attrValuesMap!.get(rowAttr);

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

    this.attrValuesInUse = {};

    for (const columnName of this.activeColumnNames) {
      this.attrValuesInUse[columnName] = [];

      const columnConf = this.visColumnConfigMap[columnName];
      for (const attrName of Array.from(columnConf.attrValuesMap!.keys())) {
         if (this.attrValueCounts[columnName][attrName]) {
           const attrConf = columnConf.attrValuesMap!.get(attrName)!;
           const confForTemplate = new AttrValueConf(attrName, attrConf.display_name || attrName, attrConf.color);
           this.attrValuesInUse[columnName].push(confForTemplate);
         }
      }
    }
  }

  runQuery(): void {
    const geneListNode = new GeneListNode(undefined, this.genes);
    const geneListQuery = new GeneQuery(geneListNode);

    const ancestorTerms = this.extraColumns.map(term => term.termid);

    const outputOptions =
      new QueryOutputOptions(['gene_uniquename', ...Array.from(this.queryColumnNames)], [],
                                                               ancestorTerms, 'none');
    this.queryService.postQuery(geneListQuery, outputOptions)
      .then(results => {
        this.loading = false;
        this.geneDataMap = this.makeGeneDataMap(results);
        this.sortGeneUniquenames();
        this.updateDisplayData();
      });
  }

  updateDisplayData(): void {
    if (Object.keys(this.geneDataMap).length > 0) {
      this.activeColumnNames = [];
      for (const visConfigName of this.visColumnNames) {
        if (this.activeColumns[visConfigName]) {
          this.activeColumnNames.push(visConfigName);
        }
      }

      this.makeGeneData();
      this.processColumnResults()
    }
  }

  makeGeneData(): void {
    this.geneDisplayData = [];

    this.sortedGeneUniquenames.map((geneUniquename, geneIndex) => {
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
    this.recalculateAll(false);
  }

  recalculateAll(forceReRunQuery: boolean): void {
    this.activeColumnNames = [];

    if (Object.keys(this.geneDataMap).length === 0 || forceReRunQuery) {
      this.runQuery();
    } else {
      this.updateDisplayData();
    }
  }

  makeGeneDomId(geneUniquename: string, index: number): string {
    return 'gene-' + index + '-'  + geneUniquename;
  }

  showResults(): boolean {
    return this.activeColumnNames.length > 0 && Object.keys(this.geneDataMap).length > 0;
  }

  getScaleIndexes(): Array<number> {
    let step = 10;
    if (this.lineHeight <= 1) {
      step = Math.ceil(Math.ceil(2.0 / this.lineHeight) * 10);
    }
    let ret = [];
    for (let i = 1; i < this.geneDisplayData.length / step; i++) {
      ret.push(i * step);
    }
    return ret;
  }

  visTotalWidth(): number {
    return this.geneWidth + this.activeColumnNames.length * (this.columnWidth + this.columnGap) +
      this.keyWidth + this.leftMargin;
  }

  visTotalHeight(): number {
    let retVal = this.colLabelHeight + this.genes.length * this.lineHeight + 10;

    if (this.visColumnConfigs.length > 0) {
      retVal = Math.max(retVal, this.keyYPos(this.activeColumnNames.length));
    }

    return retVal;
  }

  keyXPos(): number {
    return this.leftMargin + this.geneWidth + this.columnGap + 50 +
      this.activeColumnNames.length * (this.columnWidth + this.columnGap);
  }

  keyYPos(index: number): number {
    let offsetFromPrev = 0;

    if (index > 0) {
      for (let i = 0; i < index; i++) {
        const confName = this.activeColumnNames[i];
        const attrValues = this.attrValuesInUse[confName]
        offsetFromPrev += attrValues.length *
          (this.keyRectHeight + this.keyAttrGap);
      }

      offsetFromPrev += (this.keyHeaderHeight + this.keyHeaderGap) * index;
    }

    return offsetFromPrev + this.colLabelHeight + this.keyHeaderHeight;
  }

  configureExtraColumns(): void {
    const config = {
      animated: false,
      initialState: {
      },
      //class: 'modal-lg',
    };
    this.downloadModalRef = this.modalService.show(GeneVisSettingsComponent, config);
  }

  private initialise() {
    this.loading = true;

    const colConfigs = this.getColumnConfigs();

    this.visColumnConfigMap = {};
    this.visColumnConfigs = [];
    this.visColumnNames = [];

    const nameRE = /(.*):(.*)/;

    colConfigs.map(colConfig => {
      this.visColumnNames.push(colConfig.name);
      this.visColumnConfigs.push(colConfig);
      this.visColumnConfigMap[colConfig.name] = colConfig;

      if (colConfig.column_type !== 'user_vis_term') {
        let nameMatch = nameRE.exec(colConfig.name);

        if (nameMatch) {
          this.queryColumnNames.add(nameMatch[1]);
        } else {
          this.queryColumnNames.add(colConfig.name);
        }
      }

      this.activeColumns[colConfig.name] = true;

      this.sortByFields.push(colConfig.name);
    });

    this.sortByFields.push('gene-name');

    this.sortedGeneUniquenames = this.genes.map(geneShort => geneShort.uniquename);

    this.recalculateAll(true);
  }

  makeExtraColConfig(): Array<GeneResultsFieldConfig> {
    const annotationConf = {
      "display_name": "annotated",
      "name": "annotated",
      "color": "#3d3",
      'sort_priority': 0,
    };
    const notAnnotatedConf = {
      "display_name": "not_annotated",
      "name": "not_annotated",
      "color": "#c32",
      'sort_priority': 1,
    };
    return this.extraColumns.map(term => {
      const attrValuesMap = new Map();
      attrValuesMap.set("annotated", annotationConf);
      attrValuesMap.set("not_annotated", notAnnotatedConf);
      return {
        display_name: term.name,
        name: term.termid,
        column_type: 'user_vis_term',
        column_group: 'extra',
        attrValuesMap,
        attr_values: [
          annotationConf,
          notAnnotatedConf
        ],
      };
    });
  }

  private getColumnConfigs(): Array<GeneResultsFieldConfig> {
    let retValues = [...getAppConfig().getGeneResultsConfig().visualisationFields];
    retValues.push(...this.makeExtraColConfig());
    return retValues;
  }

  ngOnInit() {
    this.columnsSubscription =
      this.settingsService.extraGeneVisColumns$
        .subscribe(extraColumns => {
          this.extraColumns = extraColumns;

          this.initialise();
        });
  }


  ngOnDestroy(): void {
    this.columnsSubscription.unsubscribe();
  }
}
