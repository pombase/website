import { Component, ViewChild, OnInit } from '@angular/core';

import { saveAs } from 'file-saver';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { TabsetComponent } from 'ngx-bootstrap';

import { GeneQuery, GeneListNode, QueryOutputOptions, FormatUtils,
         FormatTypes } from '../pombase-query';
import { QueryService } from '../query.service';
import { getAppConfig, AppConfig } from '../config';

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
  public include5PrimeUtr = false;
  public include3PrimeUtr = false;

  fieldNames = ['Systematic ID', 'Name', 'Product description', 'UniProt ID',
                'Synonyms', 'Feature type', 'Start position', 'End position',
                'Chromosome', 'Strand'];
  fields = {'Systematic ID': true};
  fieldValGenerators: { [label: string]: (g: GeneSummary) => string } = {
    'Systematic ID': g => g.uniquename,
    'Name': g => g.name || '',
    'Synonyms': g => g.synonyms.join(','),
    'Product description': g => g.product,
    'UniProt ID': g => g.uniprot_identifier,
    'Feature type': g => this.displayFeatureType(g),
    'Start position': g => String(g.location.start_pos),
    'End position': g => String(g.location.end_pos),
    'Chromosome': g => String(g.location.chromosome.name),
    'Strand': g => g.location.strand,
  };

  constructor(private pombaseApiService: PombaseAPIService,
              private queryService: QueryService,
              public bsModalRef: BsModalRef) {}

  private currentTab(): string {
    if (this.staticTabs.tabs[0].active) {
      return 'delimited';
    } else {
      return 'sequence';
    }
  }

  selectAll() {
    this.fieldNames.map(name => this.fields[name] = true);
  }

  fieldChange(fieldName) {
    const selectedFields = this.selectedFieldNames();

    if (selectedFields.length === 0) {
      if (fieldName === 'Systematic ID') {
        this.fields['Name'] = true;
      } else {
        this.fields['Systematic ID'] = true;
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
    for (let fieldName of this.fieldNames) {
      if (this.fields[fieldName]) {
        return true;
      }
    }
    return false;
  }

  private selectedFieldNames(): Array<string> {
    return this.fieldNames.filter((name) => this.fields[name]);
  }

  private downloadDelimited() {
    const selectedFields = this.selectedFieldNames();

    this.pombaseApiService.getGeneSummaryMapPromise()
      .then((geneSummaries) => {
        let rows: Array<Array<string>> = [selectedFields];
        for (const gene of this.genes) {
          const geneSummary = geneSummaries[gene.uniquename];
          let row = [];
          for (const fieldName of selectedFields) {
            let fieldVal = this.fieldValGenerators[fieldName](geneSummary);
            if (fieldName === 'Chromosome') {
              const chromosomeConfig = this.appConfig.chromosomes[fieldVal];
              if (chromosomeConfig && chromosomeConfig.display_name) {
                fieldVal = chromosomeConfig.display_name;
              }
            }

            row.push(fieldVal);
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
