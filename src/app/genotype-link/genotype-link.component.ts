import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-genotype-link',
  templateUrl: './genotype-link.component.html',
  styleUrls: ['./genotype-link.component.css']
})
export class GenotypeLinkComponent implements OnInit {
  @Input() genotype: /* GenotypeShort */ any;
  @Input() showDetails: boolean;

  displayAlleles: Array<any> = [];

  constructor() { }

  ngOnInit() {
    this.displayAlleles =
      this.genotype.expressed_alleles
      .map((expressedAllele) => {
        let expressedAlleleCopy = Object.assign({expression: expressedAllele.expression},
                                                expressedAllele.allele);
        if (expressedAllele.allele.description) {
          expressedAlleleCopy.description = expressedAllele.allele.description.replace(/,/g , ',&#8203;');
        } else {
          expressedAlleleCopy.description = '';
        }
        return expressedAlleleCopy;
      });
  }
}
