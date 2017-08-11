import { Component, OnInit, Input } from '@angular/core';

import { BsModalService } from 'ngx-bootstrap/modal';

import { GeneShort } from '../pombase-api.service';
import { GenesDownloadDialogComponent } from '../genes-download-dialog/genes-download-dialog.component';

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

  constructor(private modalService: BsModalService) { }

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

  ngOnInit() {
    if (this.legend) {
      this.showLengend = true;
    }
  }
}
