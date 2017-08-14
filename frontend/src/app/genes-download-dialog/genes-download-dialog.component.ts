import { Component, ViewChild, OnInit } from '@angular/core';

import { saveAs } from 'file-saver';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import { TabsetComponent } from 'ngx-bootstrap';

import { GeneQuery, GeneListNode, QueryOutputOptions, FormatUtils,
         FormatTypes } from '../pombase-query';
import { QueryService } from '../query.service';

import { GeneShort, GeneSummary, PombaseAPIService } from '../pombase-api.service';

@Component({
  selector: 'app-genes-download-dialog',
  templateUrl: './genes-download-dialog.component.html',
  styleUrls: ['./genes-download-dialog.component.css']
})
export class GenesDownloadDialogComponent implements OnInit {
  @ViewChild('downloadTabs') staticTabs: TabsetComponent;

  public genes: Array<GeneShort>;
  public seqType = 'protein';

  fieldNames = ['Systematic ID', 'Name', 'Product description', 'UniProt ID',
                'Synonyms', 'Feature type', 'Start position', 'End position', 'Strand'];
  fields = {'Systematic ID': true};
  fieldValGenerators = {
    'Systematic ID': g => g.uniquename,
    'Name': g => g.name || '',
    'Synonyms': g => g.synonyms.join(','),
    'Product description': g => g.product,
    'UniProt ID': g => g.uniprot_identifier,
    'Feature type': g => this.displayFeatureType(g),
    'Start position': g => String(g.location.start_pos),
    'End position': g => String(g.location.end_pos),
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

    this.pombaseApiService.getGeneSummariesByUniquename()
      .then((geneSummaries) => {
        let rows: Array<Array<string>> = [selectedFields];
        for (const gene of this.genes) {
          const geneSummary = geneSummaries[gene.uniquename];
          let row = [];
          for (const fieldName of selectedFields) {
            row.push(this.fieldValGenerators[fieldName](geneSummary));
          }
          rows.push(row);
        }
        this.doDownload(rows);
      });
  }

  private downloadSequence() {
    const geneUniquenames = this.genes.map(g => g.uniquename);
    const query = new GeneQuery(new GeneListNode(geneUniquenames));
    const outputOptions = new QueryOutputOptions(['gene_uniquename'], 'protein');
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
