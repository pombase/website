import { Component, OnInit, Input } from '@angular/core';

import { getXrf } from '../config';
import { GeneShort, WithFromValue } from '../pombase-api.service';
import { TermShort } from '../pombase-query';

@Component({
  selector: 'app-with-or-from-link',
  templateUrl: './with-or-from-link.component.html',
  styleUrls: ['./with-or-from-link.component.css']
})
export class WithOrFromLinkComponent implements OnInit {
  @Input() withOrFrom: WithFromValue;

  gene?: GeneShort;
  term?: TermShort;
  identifier?: string;
  name?: string;
  link?: string;

  displayIdentifier = '';

  constructor() { }

  private displayIdentifierOf(idWithPrefix: string): string {
    return idWithPrefix.replace(/^[^:]+:/, '');
  }

  ngOnInit() {
    this.gene = this.withOrFrom.gene;
    this.term = this.withOrFrom.term;

    if (this.withOrFrom.identifier) {
      this.identifier = this.withOrFrom.identifier;
      this.displayIdentifier = this.displayIdentifierOf(this.identifier);
    }
    if (this.withOrFrom.identifier_and_name) {
      this.identifier = this.withOrFrom.identifier_and_name.identifier;
      this.name = this.withOrFrom.identifier_and_name.name;
      this.displayIdentifier = `${this.name} (${this.displayIdentifierOf(this.identifier)})`;
    }
    if (this.identifier) {
      const xrfDetails = getXrf(this.identifier);
      if (xrfDetails) {
        this.link = xrfDetails.url;
      } else {
        this.link = undefined;
      }
    }
  }
}
