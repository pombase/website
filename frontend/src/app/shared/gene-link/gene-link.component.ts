import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-gene-link',
  templateUrl: './gene-link.component.html',
  styleUrls: ['./gene-link.component.css']
})
export class GeneLinkComponent implements OnInit {
  @Input() gene: /* GeneShort */ any;
  @Input() long = true;

  displayString = '';
  linkTitle = '';

  constructor() { }

  ngOnInit() {
    if (this.gene.name) {
      this.displayString = this.gene.name;
      this.linkTitle = this.displayString + ' (' + this.gene.uniquename + ')'; ;
      if (this.long) {
          this.displayString = this.linkTitle;
      }
    } else {
      this.displayString = this.gene.uniquename;
      this.linkTitle = this.displayString;
    }

    if (this.gene.product) {
      this.linkTitle += ' - ' + this.gene.product;
    }
  }
}
