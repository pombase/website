import { Component, OnInit, Input, OnChanges } from '@angular/core';

import { Util } from '../shared/util';
import { GenotypeDetails, GenotypeShort, AlleleShort } from '../pombase-api.service';

@Component({
  selector: 'app-genotype-allele-summary',
  templateUrl: './genotype-allele-summary.component.html',
  styleUrls: ['./genotype-allele-summary.component.css']
})
export class GenotypeAlleleSummaryComponent implements OnInit, OnChanges {
  @Input() genotype: GenotypeDetails|GenotypeShort;

  isDiploid = false;

  constructor() { }

  tidyAlleleName(allele: AlleleShort): string {
    return Util.tidyAlleleName(allele);
  }

  alleleDisplayDescription(allele: AlleleShort): string {
    let description = Util.descriptionWithResidueType(allele);
    if (description) {
      return description.replace(/,/g, ',&#8201;');
    } else {
      return '';
    }
  }

  ngOnInit() {
  }

  ngOnChanges() {
    this.isDiploid = false;
    for (let locus of this.genotype.loci) {
      if (locus.expressed_alleles.length > 1) {
        this.isDiploid = true;
        break;
      }
    }
  }
}
