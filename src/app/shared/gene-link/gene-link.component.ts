import { Component, Input, OnInit } from '@angular/core';
import { getAppConfig } from '../../config';

@Component({
  selector: 'app-gene-link',
  templateUrl: './gene-link.component.html',
  styleUrls: ['./gene-link.component.css']
})
export class GeneLinkComponent implements OnInit {
  @Input() gene: /* GeneShort */ any;
  @Input() long = true;

  displayString = '';
  nameAndId = '';
  product = '';

  appConfig = getAppConfig();

  constructor() { }

  ngOnInit() {
    if (this.gene.name) {
      this.nameAndId = this.gene.name + ' (' + this.gene.uniquename + ')';

      if (this.long) {
        this.displayString = this.nameAndId;
      } else {
        this.displayString = this.gene.name;
      }
    } else {
      this.displayString = this.gene.uniquename;
      this.nameAndId = this.gene.uniquename;
    }

    if (this.gene.product) {
      this.product = this.gene.product;
    }
  }
}
