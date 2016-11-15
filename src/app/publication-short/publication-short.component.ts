import { Component, Input, OnInit } from '@angular/core';

import { PublicationShort } from '../pombase-api.service';

@Component({
  selector: 'app-publication-short',
  templateUrl: './publication-short.component.html',
  styleUrls: ['./publication-short.component.css']
})
export class PublicationShortComponent implements OnInit {
  @Input() publication: PublicationShort;

  displayString = "";

  constructor() { }

  ngOnInit() {
    if (this.publication.authors_abbrev) {
      this.displayString = this.publication.authors_abbrev;
    } else {
      this.displayString = this.publication.uniquename;
    }
    if (this.publication.publication_year) {
      this.displayString += " (" + this.publication.publication_year + ")";
    } else {
      if (this.displayString != this.publication.uniquename) {
        this.displayString = this.publication.uniquename;
      }
    }
  }
}
