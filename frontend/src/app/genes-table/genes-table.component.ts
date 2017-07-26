import { Component, OnInit, Input } from '@angular/core';

import { saveAs } from 'file-saver';

import { GeneShort, GeneSummary, PombaseAPIService } from '../pombase-api.service';

@Component({
  selector: 'app-genes-table',
  templateUrl: './genes-table.component.html',
  styleUrls: ['./genes-table.component.css']
})
export class GenesTableComponent implements OnInit {
  @Input() legend: string;
  @Input() description = '';
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

  displayFeatureType(geneSummary: GeneSummary): string {
    if (geneSummary.feature_type === 'mRNA gene') {
      return 'protein coding';
    } else {
      return geneSummary.feature_type;
    }
  }

  downloadDetails() {
    this.pombaseApiService.getGeneSummariesByUniquename()
      .then((geneSummaries) => {
        let rows: Array<Array<string>> =
          [['Systematic ID', 'Name', 'Synonyms', 'Feature type',
            'Start position', 'End position', 'Strand']];
        for (let gene of this.genes) {
          let geneSummary = geneSummaries[gene.uniquename];
          rows.push([geneSummary.uniquename, geneSummary.name || '',
                     geneSummary.synonyms.join(','),
                     this.displayFeatureType(geneSummary),
                     String(geneSummary.location.start_pos),
                     String(geneSummary.location.end_pos),
                     geneSummary.location.strand]);
        }
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
