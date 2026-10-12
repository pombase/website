import { Component, OnInit, Input } from '@angular/core';
import { getAppConfig, AppConfig } from '../config';
import { DeployConfigService } from '../deploy-config.service';

@Component({
    selector: 'app-evidence-link',
    templateUrl: './evidence-link.component.html',
    styleUrls: ['./evidence-link.component.css'],
    standalone: false
})
export class EvidenceLinkComponent implements OnInit {
  @Input() evidence: string;
  @Input() assignedBy?: string = undefined;
  @Input() assignedDate?: string = undefined;
  @Input() curationSession?: string = undefined;
  @Input() sourceFile?: string = undefined;

  displayName = '[unknown]';
  title = '[unknown]';
  link: string;
  appConfig: AppConfig = getAppConfig();

  constructor(private deployConfig: DeployConfigService) { }

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

  isDevMode(): boolean {
    return this.deployConfig.devMode();
  }

  ngOnInit() {
    this.initialise();
  }
}
