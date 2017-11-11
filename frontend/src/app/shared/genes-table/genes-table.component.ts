import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { BsModalService } from 'ngx-bootstrap/modal';

import { GeneShort } from '../../pombase-api.service';
import { GenesDownloadDialogComponent } from '../../genes-download-dialog/genes-download-dialog.component';
import { QueryService, HistoryEntry } from '../../query.service';
import { GeneQuery, GeneListNode } from '../../pombase-query';

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
  downloadModalRef = null;

  tooManyGenesTitle = 'Too many genes for select mode, try the "Gene list" option from the Search menu';
  selectGenesTitle = 'Start gene selection and filtering mode';

  selectedGenes = null;

  constructor(private modalService: BsModalService,
              private queryService: QueryService,
              private router: Router) { }

  setOrderBy(field: string) {
    this.orderByField = field;
  }

  download() {
    const config = {
      animated: false,
    };
    this.downloadModalRef = this.modalService.show(GenesDownloadDialogComponent, config);
    this.downloadModalRef.content.genes = this.genes;
  }

  selectionInProgress() {
    return this.selectedGenes != null;
  }

  startSelection() {
    this.selectedGenes = {};
    this.genes.map(gene => {
      this.selectedGenes[gene.uniquename] = false;
    });
  }

  cancelSelection() {
    this.selectedGenes = null;
  }

  selectedCount() {
    let count = 0;
    Object.keys(this.selectedGenes).map(geneUniquename => {
      if (this.selectedGenes[geneUniquename]) {
        count++;
      }
    });

    return count;
  }

  filter() {
    const selectedGeneUniquenames =
      Object.keys(this.selectedGenes)
      .filter(geneUniquename => this.selectedGenes[geneUniquename]);

    const part = new GeneListNode(selectedGeneUniquenames);
    const geneQuery = new GeneQuery(part);
    const callback = (historyEntry: HistoryEntry) => {
      this.router.navigate(['/query/results/from/history/', historyEntry.getEntryId()]);
    };
    this.queryService.saveToHistory(geneQuery, callback);

    this.selectedGenes = null;
  }

  ngOnInit() {
    if (this.legend) {
      this.showLengend = true;
    }
  }
}
