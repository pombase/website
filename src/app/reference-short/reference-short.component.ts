import { Component, Input, OnInit, ViewChild } from '@angular/core';

import { ReferenceShort } from '../pombase-api.service';
import { getXrf, getAppConfig } from '../config';
import { PopoverDirective } from 'ngx-bootstrap/popover';

@Component({
  selector: 'app-reference-short',
  templateUrl: './reference-short.component.html',
  styleUrls: ['./reference-short.component.css']
})
export class ReferenceShortComponent implements OnInit {
  @Input() reference: ReferenceShort;
  @Input() showRefTitle = false;
  @Input() linkText?: string;

  @ViewChild('link', {static: false}) link: PopoverDirective;

  mouseIn = false;

  displayString = '';
  refTitle = '';
  popoverContents: string[] = [];
  xref?: string;
  hasAnnotation = false;

  appConfig = getAppConfig();

  constructor() { }

  mouseEnter(): void {
    this.mouseIn = true;
    setTimeout(() => {
      if (this.mouseIn && this.link) {
        this.link.show();
      }
    }, this.appConfig.details_popup_delay);

  }

  mouseLeave(): void {
    this.mouseIn = false;
    this.link.hide();
  }

  ngOnDestroy(): void {
    this.link.hide();
    this.mouseIn = false;
  }

  ngOnInit() {
    if (this.reference.gene_count && this.reference.gene_count > 0 ||
      this.reference.genotype_count && this.reference.genotype_count > 0) {
      this.hasAnnotation = true;
    }

    let xrfDetail = getXrf(this.reference.uniquename);

    if (!this.reference.uniquename.startsWith("PMID:") && xrfDetail) {
      this.xref = xrfDetail.url;
      if (this.linkText) {
        this.displayString = this.linkText;
      } else {
        this.displayString = this.reference.uniquename;
      }
    } else {
      if (this.reference.authors_abbrev) {
        this.displayString = this.reference.authors_abbrev;
      } else {
        this.displayString = this.reference.uniquename;
      }
      if (this.reference.publication_year) {
        this.displayString += ' (' + this.reference.publication_year + ')';
      }

      if (this.showRefTitle && this.reference.title) {
        const m = this.reference.title.match(/(^.{1,60}\S+)/);
        if (m) {
          this.refTitle = m[0];
          if (this.refTitle !== this.reference.title) {
              this.refTitle += ' ...';
          }
        } else {
          this.refTitle = this.reference.title;
        }
      }
    }

    if (this.reference.title) {
      this.popoverContents = [this.reference.title + '  (' + this.reference.uniquename + ')'];
      if (this.reference.citation) {
        this.popoverContents.push(this.reference.citation);
      }
    } else {
      this.popoverContents = [this.displayString];
    }

    if (this.linkText) {
      this.displayString = this.linkText;
    }
  }
}
