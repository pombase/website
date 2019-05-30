import { Component, ViewChild, OnInit } from '@angular/core';

import { saveAs } from 'file-saver';
import { BsModalRef } from 'ngx-bootstrap/modal/';
import { TabsetComponent, TabDirective } from 'ngx-bootstrap';

import { GeneQuery, GeneListNode, QueryOutputOptions, FormatUtils,
         FormatTypes, ResultRow} from '../pombase-query';
import { QueryService } from '../query.service';
import { getAppConfig, AppConfig } from '../config';
import { DeployConfigService } from '../deploy-config.service';

import { GeneShort, GeneSummary, PombaseAPIService, GeneSummaryMap } from '../pombase-api.service';
import { SettingsService } from '../settings.service';

@Component({
  selector: 'app-genes-download-dialog',
  templateUrl: './genes-download-dialog.component.html',
  styleUrls: ['./genes-download-dialog.component.css']
})
export class GenesDownloadDialogComponent implements OnInit {
  @ViewChild('downloadTabs', { static: false }) staticTabs: TabsetComponent;

  appConfig: AppConfig = getAppConfig();

  public genes: Array<GeneShort>;
  public seqType = 'protein';
  public includeIntrons = false;
  public includeExons = true;
  public include5PrimeUtr = false;
  public include3PrimeUtr = false;
  public upstreamBases = 0;
  public downstreamBases = 0;

  fieldNames = GeneSummary.getDisplayFieldNames();

  selectedFields: { [key: string]: boolean } = {'Systematic ID': true};

  summaryPromise: Promise<GeneSummaryMap> = null;

  fieldsForServer =
    getAppConfig().getGeneResultsConfig().visualisation.columns
    .filter(conf => conf.column_type !== 'ortholog');

  constructor(private pombaseApiService: PombaseAPIService,
              private queryService: QueryService,
              private settingsService: SettingsService,
              public bsModalRef: BsModalRef,
              public deployConfigService: DeployConfigService) {
    this.summaryPromise = this.pombaseApiService.getGeneSummaryMapPromise();
  }

  private currentTab(): string {
    if (this.staticTabs.tabs[0].active) {
      return 'delimited';
    } else {
      return 'sequence';
    }
  }

  tabSelected(tab: TabDirective): void {
    if (tab.heading === 'FASTA sequence') {
      this.selectedFields['Systematic ID'] = true;
    }
  }

  selectAll() {
    this.fieldNames.map(name => this.selectedFields[name] = true);
  }

  fieldChange(fieldName: string) {
    const [selectedFields] = this.selectedFieldNames();

    if (selectedFields.length === 0) {
      if (fieldName === 'Systematic ID') {
        this.selectedFields['Gene name'] = true;
      } else {
        this.selectedFields['Systematic ID'] = true;
      }
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
    for (let fieldName of this.fieldNames) {
      if (this.selectedFields[fieldName]) {
        return true;
      }
    }
    return false;
  }

  private selectedFieldNames(): [Array<string>, Array<string>] {
    return [this.fieldNames.filter(name => this.selectedFields[name]),
            this.fieldsForServer.map(conf => conf.name)
               .filter(fieldName => this.selectedFields[fieldName])];
  }

  private downloadDelimited() {
    const [selectedSummaryFields, selectedServerFields] = this.selectedFieldNames();

    let serverPromise;

    if (selectedServerFields.length > 0) {
      const query = new GeneQuery(null, new GeneListNode(this.genes));
      const outputOptions = new QueryOutputOptions(['gene_uniquename', ...selectedServerFields], [], 'none');
      serverPromise = this.queryService.postQuery(query, outputOptions);

    } else {
      serverPromise = Promise.resolve(null);
    }

    Promise.all([this.summaryPromise, serverPromise])
      .then(([geneSummaries, serverResults]) => {
        const serverRowsMap: { [index: string]: ResultRow } = {};

        let headerRow = [...selectedSummaryFields];

        if (serverResults) {
          for (const serverRow of serverResults.rows) {
            serverRowsMap[serverRow['gene_uniquename']] = serverRow;
          }

          for (let fieldConf of this.fieldsForServer) {
            if (this.selectedFields[fieldConf.name]) {
              headerRow.push(fieldConf.display_name);
            }
          }
        }

        let rows: Array<Array<string>> = [headerRow];

        for (const gene of this.genes) {
          const geneUniquename = gene.uniquename;

          const geneSummary = geneSummaries[geneUniquename];

          let row = [];
          for (const fieldName of selectedSummaryFields) {
            let fieldVal = geneSummary.getFieldDisplayValue(fieldName);

            row.push(fieldVal);
          }
          if (serverRowsMap) {
            for (const serverField of selectedServerFields) {
              const serverRow = serverRowsMap[geneUniquename];
              let fieldValue: any = serverRow[serverField];
              if (typeof (fieldValue) === 'undefined') {
                row.push('');
              } else {
                if (fieldValue['term']) {
                  row.push(fieldValue['term'].name);
                } else {
                  row.push(fieldValue);
                }
              }
            }
          }
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
          include_5_prime_utr: this.include5PrimeUtr,
          include_3_prime_utr: this.include3PrimeUtr,
          upstream_bases: this.upstreamBases,
          downstream_bases: this.downstreamBases,
        },
      };
    }
  }

  private downloadSequence() {
    const [selectedSummaryFields] = this.selectedFieldNames();
    const summaryMapPromise = this.pombaseApiService.getGeneSummaryMapPromise();

    const query = new GeneQuery(null, new GeneListNode(this.genes));
    let seqOptions = this.seqDownloadOptions();
    const outputOptions = new QueryOutputOptions(['gene_uniquename'], [], seqOptions);
    const queryPromise = this.queryService.postQuery(query, outputOptions);

    Promise.all([summaryMapPromise, queryPromise])
      .then(([summaryMap, results]) => {
        const fileName = 'sequence.fasta';
        let descriptions: { [geneUniquename: string]: string } = {};

        for (const row of results.rows) {
          const geneUniquename = row.gene_uniquename;
          const geneSummary = summaryMap[geneUniquename];

          const headerFields = geneUniquename + ' ' +
            selectedSummaryFields.filter(fieldName => fieldName !== 'Systematic ID')
              .map(fieldName => geneSummary.getFieldDisplayValue(fieldName))
              .join('|');

          descriptions[geneUniquename] = headerFields;
        }

        const formattedSequence =
          FormatUtils.formatQueryResults(results, descriptions, FormatTypes.FASTA);
        const blob = new Blob([formattedSequence], { type: 'text' });
        saveAs(blob, fileName);
      });
  }

  download() {
    if (this.currentTab() === 'delimited') {
      this.downloadDelimited();
    } else {
      this.downloadSequence();
    }

    this.bsModalRef.hide();
  }

  ngOnInit() {
    this.settingsService.visibleGenesTableColumns
      .map(fieldName => this.selectedFields[fieldName] = true);
  }
}
