import { Component, OnInit, Input } from '@angular/core';
import { GeneShort } from '../pombase-api.service';

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

  constructor() { }

  setOrderBy(field: string) {
    this.orderByField = field;
  }

  ngOnInit() {
    if (this.legend) {
      this.showLengend = true;
    }
  }
}
