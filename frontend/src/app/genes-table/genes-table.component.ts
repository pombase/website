import { Component, Input } from '@angular/core';
import { GeneShort } from '../pombase-api.service';

@Component({
  selector: 'app-genes-table',
  templateUrl: './genes-table.component.html',
  styleUrls: ['./genes-table.component.css']
})
export class GenesTableComponent {
  @Input() legend: string;
  @Input() genes: Array<GeneShort> = [];

  orderByField = 'gene';

  setOrderBy(field: string) {
    this.orderByField = field;
  }

  constructor() { }
}
