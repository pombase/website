import { Component, Input, OnInit } from '@angular/core';

import { ReferenceShort } from '../pombase-api.service';

@Component({
  selector: 'app-reference-short',
  templateUrl: './reference-short.component.html',
  styleUrls: ['./reference-short.component.css']
})
export class ReferenceShortComponent implements OnInit {
  @Input() reference: ReferenceShort;

  displayString = "";

  constructor() { }

  ngOnInit() {
    if (this.reference.authors_abbrev) {
      this.displayString = this.reference.authors_abbrev;
    } else {
      this.displayString = this.reference.uniquename;
    }
    if (this.reference.publication_year) {
      this.displayString += " (" + this.reference.publication_year + ")";
    } else {
      if (this.displayString != this.reference.uniquename) {
        this.displayString = this.reference.uniquename;
      }
    }
  }
}
