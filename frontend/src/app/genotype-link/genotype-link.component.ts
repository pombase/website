import { Component, Input, OnInit } from '@angular/core';

import { Util } from '../util';

@Component({
  selector: 'app-genotype-link',
  templateUrl: './genotype-link.component.html',
  styleUrls: ['./genotype-link.component.css']
})
export class GenotypeLinkComponent implements OnInit {
  @Input() genotype: /* GenotypeShort */ any;

  displayNameLong(): string {
    return Util.displayNameLong(this.genotype).replace(/,/g, ',&#8201;');
  }

  constructor() { }

  ngOnInit() {
  }
}
