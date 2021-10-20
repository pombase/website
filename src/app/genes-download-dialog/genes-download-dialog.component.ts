import { Component, ViewChild, OnInit } from '@angular/core';

import { saveAs } from 'file-saver';
import { BsModalRef } from 'ngx-bootstrap/modal/';
import { TabsetComponent, TabDirective } from 'ngx-bootstrap/tabs';

import { FormatUtils, FormatTypes, GeneQuery, GeneUniquename} from '../pombase-query';
import { QueryService, QueryOutputOptions, GAFOptions } from '../query.service';
import { AppConfig, getAppConfig, GeneResultsFieldConfig } from '../config';

import { SettingsService } from '../settings.service';

@Component({
  selector: 'app-genes-download-dialog',
  templateUrl: './genes-download-dialog.component.html',
  styleUrls: ['./genes-download-dialog.component.css']
})
export class GenesDownloadDialogComponent implements OnInit {
  @ViewChild('downloadTabs') staticTabs: TabsetComponent;

  appConfig: AppConfig = getAppConfig();

  public geneUniquenames: Array<GeneUniquename>;
  public seqType = 'protein';
  public includeIntrons = false;
  public includeExons = true;
  public disableIncludeExons = true;
  public include5PrimeUtr = false;
  public include3PrimeUtr = false;
  public upstreamBases = 0;
  public downstreamBases = 0;

  allFields: Array<GeneResultsFieldConfig> = [];
  defaultFields: Array<GeneResultsFieldConfig> = [];
  visibleFields: Array<GeneResultsFieldConfig> = [];

  fieldConfigByName: { [fieldName: string]: GeneResultsFieldConfig } = {};

  selectedFields: { [key: string]: boolean } = {'uniquename': true};

  selectedAspects: { [key: string]: boolean } = {};

  constructor(private queryService: QueryService,
              private settingsService: SettingsService,
              public bsModalRef: BsModalRef) {
    this.allFields = getAppConfig().getGeneResultsConfig().geneTableFields;

    this.allFields.map(field => {
      if (field.column_group === 'default') {
        this.defaultFields.push(field);
      }
    });

    this.visibleFields = this.defaultFields;

    this.allFields.map(fieldConfig => {
      this.fieldConfigByName[fieldConfig.name] = fieldConfig;
    });

    for (const aspect of this.appConfig.goAspects) {
      this.selectedAspects[aspect] = true;
    }
  }

  getVisibleFieldNames(): Array<string> {
    return this.visibleFields.map(conf => conf.name);
  }

  allFieldsAreVisible(): boolean {
    return this.visibleFields.length === this.allFields.length;
  }

  showAllFields(): void {
    this.visibleFields = this.allFields;
  }

  fieldContainerStyle(): any {
    const numRows = Math.trunc((this.allFields.length + 5) / 2);
    return {
      'grid-template-rows': 'repeat(' + numRows + ', auto)',
    }
  }

  private currentTab(): string|undefined {
    if (!this.staticTabs) {
      return undefined;
    }

    if (this.staticTabs.tabs[0].active) {
      return 'delimited';
    } else {
      if (this.staticTabs.tabs[1].active) {
        return 'sequence';
      } else {
        return 'gaf';
      }
    }
  }

  tabSelected(tab: any): void {
    const tabDirective = tab as TabDirective;
    if (tabDirective.heading === 'FASTA sequence') {
      this.selectedFields['uniquename'] = true;
    }
  }

  selectAll() {
    this.getVisibleFieldNames().map(name => this.selectedFields[name] = true);
  }

  resetSelection() {
    this.selectedFields = {};
    this.settingsService.defaultVisibleFieldNames
      .map(fieldName => this.selectedFields[fieldName] = true);
  }

  fieldChange(fieldName: string) {
    const selectedFields = this.selectedFieldNames();

    if (selectedFields.length === 0) {
      if (fieldName === 'uniquename') {
        this.selectedFields['name'] = true;
      } else {
        this.selectedFields['uniquename'] = true;
      }
    }
  }

  aspectDisplayName(aspectName: string): string {
    return aspectName.replace('_', ' ');
  }

  nucControlChange(): void {
    if (!this.include3PrimeUtr && !this.include5PrimeUtr &&
        !this.includeIntrons &&
        this.upstreamBases === 0 && this.downstreamBases === 0) {
      this.includeExons = true;
      this.disableIncludeExons = true;
    } else {
      this.disableIncludeExons = false;
    }
  }

  private rowsAsTSV(rows: Array<Array<string>>): string {
    return rows.map((row) => row.join('\t')).join('\n');
  }

  private doDownload(rows: string[][]) {
    let fileName = 'gene_list.tsv';
    let blob = new Blob([this.rowsAsTSV(rows)], { type: 'text' });
    saveAs(blob, fileName);
  }

  isValid() {
    if (!this.currentTab()) {
      return false;
    }

    if (this.currentTab() === 'gaf') {
      for (const aspect of Object.keys(this.selectedAspects)) {
        if (this.selectedAspects[aspect]) {
          return true;
        }
      }
    } else {
      for (let fieldName of this.getVisibleFieldNames()) {
        if (this.selectedFields[fieldName]) {
          return true;
        }
      }
    }

    return false;
  }

  downloadTitle(): string {
    if (this.isValid()) {
      return 'Start download';
    } else {
      if (this.currentTab() === 'gaf') {
        return 'Select at least one aspect';
      } else {
        return 'Select at least one column to download';
      }
    }
  }

  private selectedFieldNames(): Array<string> {
    return this.getVisibleFieldNames().filter(fieldName => this.selectedFields[fieldName]);
  }

  private downloadDelimited() {
    const selectedFieldNames = this.selectedFieldNames();

    this.queryService.queryGenesWithFields(this.geneUniquenames, selectedFieldNames)
      .then(result => {
        let headerRow =
          selectedFieldNames.map(fieldName => this.fieldConfigByName[fieldName].display_name);
        let rows: Array<Array<string>> = [headerRow];

        for (const resultRow of result) {
          let row = selectedFieldNames.map(fieldName => (resultRow as any)[fieldName]);
          rows.push(row);
        }
        this.doDownload(rows);
      });
  }

  private seqDownloadOptions(): any {
    if (this.seqType === 'protein') {
      return 'protein';
    } else {
      return {
        nucleotide: {
          include_introns: this.includeIntrons,
          include_exons: this.includeExons,
          include_5_prime_utr: this.include5PrimeUtr,
          include_3_prime_utr: this.include3PrimeUtr,
          upstream_bases: this.upstreamBases,
          downstream_bases: this.downstreamBases,
        },
      };
    }
  }

  private downloadSequence() {
    const selectedFieldNames = this.selectedFieldNames();

    let seqOptions = this.seqDownloadOptions();
    this.queryService.queryGenesWithFields(this.geneUniquenames, selectedFieldNames, seqOptions)
      .then(results => {
        const fileName = 'sequence.fasta';
        let descriptions: { [geneUniquename: string]: string } = {};

        for (const resultRow of results) {
          const geneUniquename = resultRow.uniquename;
          const headerValues = selectedFieldNames.map(fieldName => (resultRow as any)[fieldName]);
          const description = geneUniquename + ' ' +
            headerValues.filter(fieldName => fieldName !== 'uniquename').join('|');

          descriptions[geneUniquename] = description;
        }

        const formattedSequence =
          FormatUtils.formatQueryResults(results, descriptions, FormatTypes.FASTA);
        const blob = new Blob([formattedSequence], { type: 'text' });
        saveAs(blob, fileName);
      });
  }

  downloadGAF(): void {
    let selectedAspects = [];
    for (const aspect of Object.keys(this.selectedAspects)) {
      if (this.selectedAspects[aspect]) {
        selectedAspects.push(aspect);
      }
    }
    const options = new QueryOutputOptions([], [], [], 'none', new GAFOptions(selectedAspects));
    const query = GeneQuery.fromGeneUniquenames('GAF download', this.geneUniquenames);
    this.queryService.postQuery(query, options)
      .then(results => {
        const fileName = 'gene_results.gaf.tsv';

        let gafString = '';
        for (const resultRow of results.getRows()) {
          const gafLines = resultRow.gaf_lines;
          if (gafLines) {
            gafString += gafLines;
          }
        }

        const blob = new Blob([gafString], { type: 'text' });
        saveAs(blob, fileName);
      });
  }

  download() {
    if (this.currentTab() === 'delimited') {
      this.downloadDelimited();
    } else {
      if (this.currentTab() === 'sequence') {
        this.downloadSequence();
      } else {
        this.downloadGAF();
      }
    }

    this.bsModalRef.hide();
  }

  ngOnInit() {
    this.selectedFields = {};
    this.settingsService.visibleGenesTableFieldNames
      .map(fieldName => {
        this.selectedFields[fieldName] = true;
        const fieldConfig = this.fieldConfigByName[fieldName];

        if (fieldConfig.column_group === 'extra') {
          this.visibleFields = this.allFields;
        }
      });
  }
}
