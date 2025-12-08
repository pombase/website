import { Component, Input, OnInit } from '@angular/core';

import { GenotypeShort } from '../pombase-api.service';

@Component({
    selector: 'app-genotype-link',
    templateUrl: './genotype-link.component.html',
    styleUrls: ['./genotype-link.component.css'],
    standalone: false
})
export class GenotypeLinkComponent implements OnInit {
  @Input() genotype: GenotypeShort;
  @Input() background: string|undefined = undefined;

  isShortDisplayName = false;
  fullDisplayName = '';
  abbrevDisplayName = '';

  processDisplayName(displayName: string): string {
    return displayName
      .replace(/,/g, ',<wbr>')
      .replace(/\(/g, '<wbr>\(');
  }

  constructor() { }

  isDiploid(): boolean {
    for (const locus of this.genotype.loci) {
      if (locus.expressed_alleles.length > 1) {
        return true;
      }
    }
    return false;
  }

  ngOnInit() {
    this.isShortDisplayName = this.genotype.displayNameLong.length < 50;

    this.fullDisplayName = this.genotype.displayNameLong;
    this.abbrevDisplayName = this.fullDisplayName;

    if (!this.isShortDisplayName) {
      let matches = this.fullDisplayName.match(/(.*)\((.{40}[^,]).*\)$/);
      if (matches) {
        this.abbrevDisplayName = matches[1] + '(' + matches[2] +
          '...)';
      }
    }

    this.abbrevDisplayName = this.processDisplayName(this.abbrevDisplayName);
  }
}
