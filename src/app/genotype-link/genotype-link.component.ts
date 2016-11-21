import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-genotype-link',
  templateUrl: './genotype-link.component.html',
  styleUrls: ['./genotype-link.component.css']
})
export class GenotypeLinkComponent implements OnInit {
  @Input() genotype: /* GenotypeShort */ any;

  displayAlleles: Array<any> = [];

  constructor() { }

  ngOnInit() {
    this.displayAlleles =
      this.genotype.alleles
      .map((allele) => {
        let alleleCopy = Object.assign({}, allele);
        if (allele.description) {
          alleleCopy.description = allele.description.replace(/,/g , ',&#8203;');
        } else {
          alleleCopy.description = '';
        }
        return alleleCopy;
      });
  }
}
