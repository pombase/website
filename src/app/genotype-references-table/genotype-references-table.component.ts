import { Component, Input, OnInit, OnChanges } from '@angular/core';

import { ReferenceShort, GenotypeDetails } from '../pombase-api.service';
import { getAppConfig } from '../config';

@Component({
  selector: 'app-genotype-references-table',
  templateUrl: './genotype-references-table.component.html',
  styleUrls: ['./genotype-references-table.component.css']
})
export class GenotypeReferencesTableComponent implements OnInit, OnChanges {
  @Input() genotypeDetails: GenotypeDetails;
  @Input() references: Array<ReferenceShort>;

  orderByField = '+publication_year';

  appConfig = getAppConfig();

  setOrderBy(field: string) {
    this.orderByField = field;
  }

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges() {
  }
}
