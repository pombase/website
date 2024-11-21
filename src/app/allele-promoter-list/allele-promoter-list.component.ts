import { Component, Input, OnInit } from '@angular/core';
import { Annotation } from '../pombase-api.service';

@Component({
    selector: 'app-allele-promoter-list',
    templateUrl: './allele-promoter-list.component.html',
    styleUrls: ['./allele-promoter-list.component.css'],
    standalone: false
})
export class AllelePromoterListComponent implements OnInit {
  @Input() annotation: Annotation;
  @Input() long = true;

  isMultiLocusGenotype = true;

  constructor() {
  }

  ngOnInit(): void {
    this.isMultiLocusGenotype = this.annotation.genotype.loci.length > 1;
  }
}
