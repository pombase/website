import { Component, OnInit, Input } from '@angular/core';

import { Util } from '../util';
import { GenotypeDetails, AlleleShort } from '../pombase-api.service';

@Component({
  selector: 'app-genotype-allele-summary',
  templateUrl: './genotype-allele-summary.component.html',
  styleUrls: ['./genotype-allele-summary.component.css']
})
export class GenotypeAlleleSummaryComponent implements OnInit {
  @Input() genotypeDetails: GenotypeDetails;

  constructor() { }

  alleleDisplayName(allele: AlleleShort): string {
    return Util.alleleDisplayName(allele).replace(/,/g, ',&#8201;');
  }

  ngOnInit() {
  }
}
