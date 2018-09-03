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
  popoverBits = [];

  constructor() { }

  ngOnInit() {
    if (this.gene.name) {
      this.displayString = this.gene.name;
      this.popoverBits = [this.displayString + ' (' + this.gene.uniquename + ')'];
      if (this.long) {
          this.displayString = this.popoverBits[0];
      }
    } else {
      this.displayString = this.gene.uniquename;
      this.popoverBits = [this.displayString];
    }

    if (this.gene.product) {
      this.popoverBits.push(this.gene.product);
    }
  }
}
