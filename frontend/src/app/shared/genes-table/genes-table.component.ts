import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { Router } from '@angular/router';

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import { GeneShort } from '../../pombase-api.service';
import { GenesDownloadDialogComponent } from '../../genes-download-dialog/genes-download-dialog.component';
import { QueryService, HistoryEntry } from '../../query.service';
import { GeneQuery, GeneListNode, TermShort } from '../../pombase-query';
import { DeployConfigService } from '../../deploy-config.service';

@Component({
  selector: 'app-genes-table',
  templateUrl: './genes-table.component.html',
  styleUrls: ['./genes-table.component.css']
})
export class GenesTableComponent implements OnInit {
  @Input() legend: string;
  @Input() description = '';

  // a decomposed version of the description as an Array of Objects
  // like: [{text: "abnormal cell ... ("}, {term: <a TermShort>}, {text: ")"}, ...]
  // which allows the the termids in a description to be linked to the term pages
  @Input() descriptionParts: Array<({ text?: string; term?: TermShort; })> = [];
  @Input() genes: Array<GeneShort> = [];

  orderByField = 'gene';
  downloadModalRef: BsModalRef = null;
  selectedCountCache = -1;
  showingVisualisation = false;

  visLegend: string = null;

  tooManyGenesTitle = 'Too many genes for select mode, try the "Gene list" option from the Search menu';
  selectGenesTitle = 'Start gene selection and filtering mode';

  selectedGenes: { [key: string]: boolean } = null;

  constructor(private modalService: BsModalService,
              private queryService: QueryService,
              private router: Router,
              private deployConfigService: DeployConfigService) { }

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
    this.selectedCountCache = 0;
  }

  cancelSelection() {
    this.selectedGenes = null;
    this.selectedCountCache = -1;
  }

  selectAll() {
    Object.keys(this.selectedGenes).map(geneUniquename => {
      this.selectedGenes[geneUniquename] = true;
    });
    this.selectedCountCache = this.genes.length;
  }

  selectNone() {
    Object.keys(this.selectedGenes).map(geneUniquename => {
      this.selectedGenes[geneUniquename] = false;
    });
    this.selectedCountCache = 0;
  }

  selectionChanged() {
    this.selectedCountCache = -1;
  }

  selectedCount() {
    if (this.selectedCountCache === -1) {
      this.selectedCountCache = 0;
      Object.keys(this.selectedGenes).map(geneUniquename => {
        if (this.selectedGenes[geneUniquename]) {
          this.selectedCountCache++;
        }
      });

    }

    return this.selectedCountCache;
  }

  filter() {
    const selectedGenes = this.genes.filter(gene => this.selectedGenes[gene.uniquename]);

    const part = new GeneListNode(selectedGenes);
    const geneQuery = new GeneQuery(part);
    const callback = (historyEntry: HistoryEntry) => {
      this.router.navigate(['/query/results/from/history/', historyEntry.getEntryId()]);
    };
    this.queryService.saveToHistory(geneQuery, callback);

    this.selectedGenes = null;
    this.selectedCountCache = -1;
  }

  showVisualisation(): void {
    this.showingVisualisation = true;
  }

  hideVisualisation(): void {
    this.showingVisualisation = false;
  }

  ngOnInit() {
  }

  ngOnChanges() {
    if (this.legend) {
      this.visLegend = `Visualising ${this.genes.length} genes`;
    }
  }
}
