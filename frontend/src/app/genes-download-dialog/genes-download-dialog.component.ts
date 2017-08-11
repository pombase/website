import { Component, OnInit } from '@angular/core';

import { saveAs } from 'file-saver';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';

import { GeneShort, GeneSummary, PombaseAPIService } from '../pombase-api.service';

@Component({
  selector: 'app-genes-download-dialog',
  templateUrl: './genes-download-dialog.component.html',
  styleUrls: ['./genes-download-dialog.component.css']
})
export class GenesDownloadDialogComponent implements OnInit {
  public genes: Array<GeneShort>;

  private fieldNames = ['Systematic ID', 'Name', 'Synonyms', 'Feature type',
                        'Start position', 'End position', 'Strand'];
  fields = {'Systematic ID': true};
  fieldValGenerators = {
    'Systematic ID': g => g.uniquename,
    'Name': g => g.name || '',
    'Synonyms': g => g.synonyms.join(','),
    'Feature type': g => this.displayFeatureType(g),
    'Start position': g => String(g.location.start_pos),
    'End position': g => String(g.location.end_pos),
    'Strand': g => g.location.strand,
  };

  constructor(private pombaseApiService: PombaseAPIService,
              public bsModalRef: BsModalRef) {}

  rowsAsTSV(rows: Array<Array<string>>): string {
    return rows.map((row) => row.join('\t')).join('\n');
  }

  private doDownload(rows) {
    let fileName = 'gene_list.tsv';
    let blob = new Blob([this.rowsAsTSV(rows)], { type: 'text' });
    saveAs(blob, fileName);
  }

  displayFeatureType(geneSummary: GeneSummary): string {
    if (geneSummary.feature_type === 'mRNA gene') {
      return 'protein coding';
    } else {
      return geneSummary.feature_type;
    }
  }

  download() {
    const selectedFieldNames =
      this.fieldNames.filter((name) => this.fields[name]);

    this.pombaseApiService.getGeneSummariesByUniquename()
      .then((geneSummaries) => {
        let rows: Array<Array<string>> = [selectedFieldNames];
        for (const gene of this.genes) {
          const geneSummary = geneSummaries[gene.uniquename];
          let row = [];
          for (const fieldName of selectedFieldNames) {
            row.push(this.fieldValGenerators[fieldName](geneSummary));
          }
          rows.push(row);
        }
        this.doDownload(rows);
      });

    this.bsModalRef.hide();
  }

  ngOnInit() {
  }
}
