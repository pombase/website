import { Component, ViewChild, OnInit } from '@angular/core';

import { saveAs } from 'file-saver';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { TabsetComponent } from 'ngx-bootstrap';

import { GeneQuery, GeneListNode, QueryOutputOptions, FormatUtils,
         FormatTypes,
         ResultRow} from '../pombase-query';
import { QueryService } from '../query.service';
import { getAppConfig, AppConfig } from '../config';
import { DeployConfigService } from '../deploy-config.service';

import { GeneShort, GeneSummary, PombaseAPIService } from '../pombase-api.service';

@Component({
  selector: 'app-genes-download-dialog',
  templateUrl: './genes-download-dialog.component.html',
  styleUrls: ['./genes-download-dialog.component.css']
})
export class GenesDownloadDialogComponent implements OnInit {
  @ViewChild('downloadTabs') staticTabs: TabsetComponent;

  appConfig: AppConfig = getAppConfig();

  public genes: Array<GeneShort>;
  public seqType = 'protein';
  public includeIntrons = false;
  public includeExons = true;
  public include5PrimeUtr = false;
  public include3PrimeUtr = false;
  public upstreamBases = 0;
  public downstreamBases = 0;

  summaryFieldNames = ['Systematic ID', 'Name', 'Product description', 'UniProt ID',
                'Synonyms', 'Feature type', 'Start position', 'End position',
                'Chromosome', 'Strand'];
  selectedFields = {'Systematic ID': true};
  summaryFieldValGenerators: { [label: string]: (g: GeneSummary) => string } = {
    'Systematic ID': g => g.uniquename,
    'Name': g => g.name || '',
    'Synonyms': g => g.synonyms.join(','),
    'Product description': g => g.product,
    'UniProt ID': g => g.uniprot_identifier,
    'Feature type': g => this.displayFeatureType(g),
    'Start position': g => String(g.location.start_pos),
    'End position': g => String(g.location.end_pos),
    'Chromosome': g => String(g.location.chromosome_name),
    'Strand': g => g.location.strand,
  };

  fieldsForServer =
    getAppConfig().geneResults.visualisation.columns
    .filter(conf => conf.column_type !== 'ortholog');

  constructor(private pombaseApiService: PombaseAPIService,
              private queryService: QueryService,
              public bsModalRef: BsModalRef,
              public deployConfigService: DeployConfigService) {}

  private currentTab(): string {
    if (this.staticTabs.tabs[0].active) {
      return 'delimited';
    } else {
      return 'sequence';
    }
  }

  selectAll() {
    this.summaryFieldNames.map(name => this.selectedFields[name] = true);
  }

  fieldChange(fieldName) {
    const [selectedFields] = this.selectedFieldNames();

    if (selectedFields.length === 0) {
      if (fieldName === 'Systematic ID') {
        this.selectedFields['Name'] = true;
      } else {
        this.selectedFields['Systematic ID'] = true;
      }
    }
  }

  private rowsAsTSV(rows: Array<Array<string>>): string {
    return rows.map((row) => row.join('\t')).join('\n');
  }

  private doDownload(rows) {
    let fileName = 'gene_list.tsv';
    let blob = new Blob([this.rowsAsTSV(rows)], { type: 'text' });
    saveAs(blob, fileName);
  }

  private displayFeatureType(geneSummary: GeneSummary): string {
    if (geneSummary.feature_type === 'mRNA gene') {
      return 'protein coding';
    } else {
      return geneSummary.feature_type;
    }
  }

  isValid() {
    for (let fieldName of this.summaryFieldNames) {
      if (this.selectedFields[fieldName]) {
        return true;
      }
    }
    return false;
  }

  private selectedFieldNames(): [Array<string>, Array<string>] {
    return [this.summaryFieldNames.filter(name => this.selectedFields[name]),
            this.fieldsForServer.map(conf => conf.name)
               .filter(fieldName => this.selectedFields[fieldName])];
  }

  private downloadDelimited() {
    const [selectedSummaryFields, selectedServerFields] = this.selectedFieldNames();

    const summaryPromise = this.pombaseApiService.getGeneSummaryMapPromise();

    let serverPromise;

    if (selectedServerFields.length > 0) {
      const query = new GeneQuery(new GeneListNode(this.genes));
      const outputOptions = new QueryOutputOptions(['gene_uniquename', ...selectedServerFields], 'none');
      serverPromise = this.queryService.postQuery(query, outputOptions).toPromise();

    } else {
      serverPromise = Promise.resolve(null);
    }

    Promise.all([summaryPromise, serverPromise])
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
            let fieldVal = this.summaryFieldValGenerators[fieldName](geneSummary);
            if (fieldName === 'Chromosome') {
              const chromosomeConfig = this.appConfig.chromosomes[fieldVal];
              if (chromosomeConfig && chromosomeConfig.short_display_name) {
                fieldVal = chromosomeConfig.short_display_name;
              }
            }

            row.push(fieldVal);
          }
          if (serverRowsMap) {
            for (const serverField of selectedServerFields) {
              const serverRow = serverRowsMap[geneUniquename];
              let fieldValue = serverRow[serverField];
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
    const query = new GeneQuery(new GeneListNode(this.genes));
    let seqOptions = this.seqDownloadOptions();
    const outputOptions = new QueryOutputOptions(['gene_uniquename'], seqOptions);
    this.queryService.postQuery(query, outputOptions)
      .subscribe((results) => {
        const fileName = 'sequence.fasta';
        const formattedSequence =
          FormatUtils.formatQueryResults(results, FormatTypes.FASTA);
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
  }
}
