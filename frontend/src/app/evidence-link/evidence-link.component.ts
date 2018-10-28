import { Component, OnInit, Input } from '@angular/core';
import { getAppConfig, AppConfig, LinkoutConfig } from '../config';

@Component({
  selector: 'app-evidence-link',
  templateUrl: './evidence-link.component.html',
  styleUrls: ['./evidence-link.component.css']
})
export class EvidenceLinkComponent implements OnInit {
  @Input() evidence: string;

  displayName = '[unknown]';
  title = '[unknown]';
  link: string = null;
  appConfig: AppConfig = getAppConfig();
  linkoutConfig: LinkoutConfig = {};

  constructor() { }

  initialise() {
    if (this.evidence) {
      this.title = this.evidence;
      if (this.appConfig.evidenceTypes[this.evidence]) {
        let conf = this.appConfig.evidenceTypes[this.evidence];
        if (conf.long) {
          this.title = conf.long;
        }
        if (conf.link) {
          this.link = conf.link;
        }
      }
      this.displayName = this.evidence;
    }
  }

  ngOnInit() {
    this.linkoutConfig = this.appConfig.linkoutConfig;
    this.initialise();
  }
}
