import { Component, OnInit, Input, OnChanges } from '@angular/core';

import { getAppConfig } from '../../config';

@Component({
    selector: 'app-external-link',
    templateUrl: './external-link.component.html',
    styleUrls: ['./external-link.component.css'],
    standalone: false
})
export class ExternalLinkComponent implements OnInit, OnChanges {
  @Input() identifier: string;
  @Input() linkText: string;
  @Input() linkConfigKey: string;
  @Input() iconImage: string;

  linkUrl = '';

  constructor() { }

  getLinkUrl() {
    return this.linkUrl;
  }

  ngOnInit() {
  }

  ngOnChanges() {
    let xrfDetails =
      getAppConfig().getExternalTermLink(this.linkConfigKey, this.identifier);
    if (xrfDetails) {
      if (!this.linkText) {
        this.linkText = xrfDetails.displayName;
      }
      this.linkUrl = xrfDetails.url;
    }
  }
}
