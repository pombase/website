import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-genotype-link',
  templateUrl: './genotype-link.component.html',
  styleUrls: ['./genotype-link.component.css']
})
export class GenotypeLinkComponent implements OnInit {
  @Input() genotype: /* GenotypeShort */ any;

  isShortDisplayName = false;

  displayNameLong(): string {
    return this.genotype.displayNameLong.replace(/,/g, ',&#8201;');
  }

  constructor() { }

  ngOnInit() {
    this.isShortDisplayName = this.genotype.displayNameLong.length < 50;
  }
}
