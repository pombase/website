import { Component, Input, OnInit } from '@angular/core';

import { GenotypeShort } from '../pombase-api.service';

@Component({
  selector: 'app-genotype-link',
  templateUrl: './genotype-link.component.html',
  styleUrls: ['./genotype-link.component.css']
})
export class GenotypeLinkComponent implements OnInit {
  @Input() genotype: GenotypeShort;

  isShortDisplayName = false;
  displayName = '';

  displayNameLong(): string {
    return this.genotype.displayNameLong
      .replace(/,/g, ',&#8201;')
      .replace(/\(/g, '&#8201\(');
  }

  constructor() { }

  ngOnInit() {
    this.displayName = this.displayNameLong();

    this.isShortDisplayName = this.genotype.displayNameLong.length < 50;
  }
}
