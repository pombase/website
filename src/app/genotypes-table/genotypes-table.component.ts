import { Component, OnInit, Input } from '@angular/core';
import { GenotypeShort } from '../pombase-api.service';

@Component({
  selector: 'app-genotypes-table',
  templateUrl: './genotypes-table.component.html',
  styleUrls: ['./genotypes-table.component.css']
})
export class GenotypesTableComponent implements OnInit {
  @Input() legend: string;
  @Input() genotypes: Array<GenotypeShort> = [];

  orderByField = 'product';

  setOrderBy(field: string) {
    this.orderByField = field;
  }

  constructor() { }

  ngOnInit() {
  }
}
