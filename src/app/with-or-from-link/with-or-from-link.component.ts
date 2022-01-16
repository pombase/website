import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { PopoverDirective } from 'ngx-bootstrap/popover';
import { getAppConfig, getXrf } from '../config';
import { GeneShort, TranscriptDetails, WithFromValue } from '../pombase-api.service';
import { TermShort } from '../pombase-query';

@Component({
  selector: 'app-with-or-from-link',
  templateUrl: './with-or-from-link.component.html',
  styleUrls: ['./with-or-from-link.component.css']
})
export class WithOrFromLinkComponent implements OnInit {
  @Input() withOrFrom: WithFromValue;

  @ViewChild('link', {static: false}) link: PopoverDirective;

  gene?: GeneShort;
  term?: TermShort;
  transcript?: TranscriptDetails;
  identifier?: string;
  name?: string;
  linkUrl?: string;

  appConfig = getAppConfig();
  displayIdentifier = '';
  popoverIdentifier = '';
  identifierSourceDescription = '';
  mouseIn = false;

  constructor() { }

  private displayIdentifierOf(idWithPrefix: string): string {
    return idWithPrefix.replace(/^[^:]+:/, '');
  }

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
    if (this.link) {
      this.link.hide();
    }
    this.mouseIn = false;
  }

  ngOnInit() {
    this.gene = this.withOrFrom.gene;
    this.term = this.withOrFrom.term;
    this.transcript = this.withOrFrom.transcript;

    if (this.withOrFrom.identifier) {
      this.identifier = this.withOrFrom.identifier;
      this.displayIdentifier = this.displayIdentifierOf(this.identifier);
      this.popoverIdentifier = this.withOrFrom.identifier;
    }
    if (this.withOrFrom.identifier_and_name) {
      this.identifier = this.withOrFrom.identifier_and_name.identifier;
      this.name = this.withOrFrom.identifier_and_name.name;
      this.displayIdentifier = `${this.name} (${this.displayIdentifierOf(this.identifier)})`;
    }
    if (this.identifier) {
      const xrfDetails = getXrf(this.identifier);
      if (xrfDetails) {
        this.linkUrl = xrfDetails.url;
        if (xrfDetails.description) {
          this.identifierSourceDescription = xrfDetails.description
        } else {
          this.identifierSourceDescription = '';
        }
      } else {
        this.linkUrl = undefined;
      }
    }
  }
}
