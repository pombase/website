import { Component, OnInit, Input } from '@angular/core';

import { Util } from '../shared/util';
import { GenotypeDetails, GenotypeShort, AlleleShort } from '../pombase-api.service';

@Component({
  selector: 'app-genotype-allele-summary',
  templateUrl: './genotype-allele-summary.component.html',
  styleUrls: ['./genotype-allele-summary.component.css']
})
export class GenotypeAlleleSummaryComponent implements OnInit {
  @Input() genotype: GenotypeDetails|GenotypeShort;

  constructor() { }

  alleleDisplayName(allele: AlleleShort): string {
    return Util.alleleDisplayName(allele).replace(/,/g, ',&#8201;');
  }

  ngOnInit() {
  }
}
