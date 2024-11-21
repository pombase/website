import { Component, OnInit, Input } from '@angular/core';
import { getAppConfig, AppConfig } from '../config';

@Component({
    selector: 'app-evidence-link',
    templateUrl: './evidence-link.component.html',
    styleUrls: ['./evidence-link.component.css'],
    standalone: false
})
export class EvidenceLinkComponent implements OnInit {
  @Input() evidence: string;
  @Input() assignedBy?: string = undefined;
  @Input() assignedDate?: string = undefined

  displayName = '[unknown]';
  title = '[unknown]';
  link: string;
  appConfig: AppConfig = getAppConfig();

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
    this.initialise();
  }
}
