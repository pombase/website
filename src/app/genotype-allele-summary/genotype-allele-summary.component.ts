import { Component, OnInit, Input, OnChanges } from '@angular/core';

import { Util } from '../shared/util';
import { GenotypeDetails, GenotypeShort, AlleleShort, ReferenceShort } from '../pombase-api.service';

@Component({
  selector: 'app-genotype-allele-summary',
  templateUrl: './genotype-allele-summary.component.html',
  styleUrls: ['./genotype-allele-summary.component.css']
})
export class GenotypeAlleleSummaryComponent implements OnInit, OnChanges {
  @Input() genotype: GenotypeDetails|GenotypeShort;
  @Input() showProduct = false;

  isDiploid = false;
  hasSynonyms = false;
  hasComment = false;
  hasPromoter = false;

  constructor() { }

  tidyAlleleName(alleleName?: string): string {
    return Util.tidyAlleleName(alleleName).replace(/,/g, ',<wbr>');
  }

  alleleDisplayDescription(allele: AlleleShort): string {
    let description = Util.descriptionWithResidueType(allele);
    if (description) {
      return description.replace(/,/g, ',<wbr>');
    } else {
      return '';
    }
  }

  getPopupHeaderText(reference: ReferenceShort, type: 'comment'|'synonym'): string {
    if (reference && reference.authors_abbrev) {
      return `Reference for this ${type}, ${reference.authors_abbrev}`;
    } else {
      return `Reference for this ${type}`;
    }
  }

  ngOnInit() {
  }

  ngOnChanges() {
    this.isDiploid = false;
    this.hasSynonyms = false;
    this.hasComment = false;
    for (let locus of this.genotype.loci) {
      if (locus.expressed_alleles.length > 1) {
        this.isDiploid = true;
        break;
      }
      locus.expressed_alleles.map(expressedAllele => {
        if (expressedAllele.allele.synonyms && expressedAllele.allele.synonyms.length > 0) {
          this.hasSynonyms = true;
        }
        if (expressedAllele.allele.comments && expressedAllele.allele.comments.length > 0) {
          this.hasComment = true;
        }
        if (expressedAllele.promoter_gene || expressedAllele.exogenous_promoter) {
          this.hasPromoter = true;
        }
      })
    }
  }
}
