import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-gene-link',
  templateUrl: './gene-link.component.html',
  styleUrls: ['./gene-link.component.css']
})
export class GeneLinkComponent implements OnInit {
  @Input() gene: /* GeneShort */ any;
  @Input() long: boolean = true;

  displayString = "";

  constructor() { }

  ngOnInit() {
    if (this.gene.name) {
      this.displayString = this.gene.name;
      if (this.long) {
          this.displayString += " (" + this.gene.uniquename + ")";
      }
    } else {
      this.displayString = this.gene.uniquename;
    }
  }
}
