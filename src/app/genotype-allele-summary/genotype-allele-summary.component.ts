import { Component, OnInit, Input, OnChanges } from '@angular/core';

import { Util } from '../shared/util';
import { GenotypeDetails, GenotypeShort, AlleleShort, ExpressedAllele } from '../pombase-api.service';

@Component({
  selector: 'app-genotype-allele-summary',
  templateUrl: './genotype-allele-summary.component.html',
  styleUrls: ['./genotype-allele-summary.component.css']
})
export class GenotypeAlleleSummaryComponent implements OnInit, OnChanges {
  @Input() genotype: GenotypeDetails|GenotypeShort;

  isDiploid = false;
  hasSynonyms = false;

  constructor() { }

  tidyAlleleName(alleleName?: string): string {
    return Util.tidyAlleleName(alleleName);
  }

  alleleDisplayDescription(allele: AlleleShort): string {
    let description = Util.descriptionWithResidueType(allele);
    if (description) {
      return description.replace(/,/g, ',&#8201;');
    } else {
      return '';
    }
  }

  getSynonymString(expressedAllele: ExpressedAllele): string {
    const synonyms = expressedAllele.allele.synonyms;
    if (synonyms) {
      return synonyms.map(synonym => this.tidyAlleleName(synonym.name)).join(', ');
    } else {
      return '';
    }
  }

  ngOnInit() {
  }

  ngOnChanges() {
    this.isDiploid = false;
    this.hasSynonyms = false;
    for (let locus of this.genotype.loci) {
      if (locus.expressed_alleles.length > 1) {
        this.isDiploid = true;
        break;
      }
      locus.expressed_alleles.map(expressedAllele => {
        if (expressedAllele.allele.synonyms && expressedAllele.allele.synonyms.length > 0) {
          this.hasSynonyms = true;
        }
      })
    }
  }
}
