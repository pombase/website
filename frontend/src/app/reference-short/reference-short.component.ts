import { Component, Input, OnInit } from '@angular/core';

import { ReferenceShort } from '../pombase-api.service';
import { getXrf } from '../config';

@Component({
  selector: 'app-reference-short',
  templateUrl: './reference-short.component.html',
  styleUrls: ['./reference-short.component.css']
})
export class ReferenceShortComponent implements OnInit {
  @Input() reference: ReferenceShort;
  @Input() showRefTitle = false;
  @Input() linkText?: string;

  displayString = '';
  refTitle = '';
  xref = null;

  constructor() { }

  ngOnInit() {
    let xrfDetail = getXrf(this.reference.uniquename);

    if (xrfDetail) {
      this.xref = xrfDetail.url;
      if (this.linkText) {
        this.displayString = this.linkText;
      } else {
        this.displayString = this.reference.uniquename;
      }
    } else {
      if (this.linkText) {
        this.displayString = this.linkText;
        return;
      }
      if (this.reference.authors_abbrev) {
        this.displayString = this.reference.authors_abbrev;
      } else {
        this.displayString = this.reference.uniquename;
      }
      if (this.reference.publication_year) {
        this.displayString += ' (' + this.reference.publication_year + ')';
      } else {
        if (this.displayString !== this.reference.uniquename) {
          this.displayString = this.reference.uniquename;
        }
      }

      if (this.showRefTitle && this.reference.title) {
        const m = this.reference.title.match(/(^.{1,50}\S+)/);
        if (m) {
          this.refTitle = m[0];
        } else {
          this.refTitle = this.reference.title;
        }
        this.refTitle += ' ...';
      }
    }
  }
}
