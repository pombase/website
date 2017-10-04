import { Component, OnInit, Input } from '@angular/core';

import { getAppConfig } from '../../config';

@Component({
  selector: 'app-external-link',
  templateUrl: './external-link.component.html',
  styleUrls: ['./external-link.component.css']
})
export class ExternalLinkComponent implements OnInit {
  @Input() identifier: string;
  @Input() linkText: string = null;
  @Input() linkConfigKey: string;
  @Input() iconImage: string = null;

  linkUrl = '';

  constructor() { }

  getLinkUrl() {
    return this.linkUrl;
  }

  ngOnInit() {
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
