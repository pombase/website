import { Component, OnInit, Input } from '@angular/core';
import { GenotypeShort } from '../pombase-api.service';

type OrderBy = 'genotype'|'gene'|'product';

@Component({
    selector: 'app-genotypes-table',
    templateUrl: './genotypes-table.component.html',
    styleUrls: ['./genotypes-table.component.css'],
    standalone: false
})
export class GenotypesTableComponent implements OnInit {
  @Input() legend: string;
  @Input() genotypes: Array<GenotypeShort> = [];

  orderByField: OrderBy = 'product';

  setOrderBy(field: OrderBy) {
    this.orderByField = field;
  }

  constructor() { }

  ngOnInit() {
  }
}
