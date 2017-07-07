import { Component, OnInit, Input } from '@angular/core';

import { saveAs } from 'file-saver';

import { GeneShort, PombaseAPIService } from '../pombase-api.service';

@Component({
  selector: 'app-genes-table',
  templateUrl: './genes-table.component.html',
  styleUrls: ['./genes-table.component.css']
})
export class GenesTableComponent implements OnInit {
  @Input() legend: string;
  @Input() genes: Array<GeneShort> = [];

  orderByField = 'gene';
  showLengend = false;

  constructor(private pombaseApiService: PombaseAPIService) { }

  setOrderBy(field: string) {
    this.orderByField = field;
  }

  rowsAsTSV(rows: Array<Array<string>>): string {
    return rows.map((row) => row.join('\t')).join('\n');
  }

  private doDownload(rows) {
    let fileName = 'gene_list.tsv';
    let blob = new Blob([this.rowsAsTSV(rows)], { type: 'text' });
    saveAs(blob, fileName);
  }

  downloadDetails() {
    this.pombaseApiService.getGeneSummariesByUniquename()
      .then((geneSummaries) => {
        let rows = this.genes.map((gene) => {
          let geneSummary = geneSummaries[gene.uniquename];
          return [geneSummary.uniquename, geneSummary.name || '',
                  geneSummary.synonyms.join(','), geneSummary.feature_type,
                  geneSummary.location.start_pos, geneSummary.location.end_pos,
                  geneSummary.location.strand];
        });
        this.doDownload(rows);
      });
  }

  download() {
    let rows = this.genes.map((gene) => {
      return [gene.uniquename];
    });
    this.doDownload(rows);
  }

  ngOnInit() {
    if (this.legend) {
      this.showLengend = true;
    }
  }
}
