import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { getAppConfig, PanelConfig, AppConfig } from '../config';
import { Title, Meta } from '@angular/platform-browser';
import { PombaseAPIService } from '../pombase-api.service';

@Component({
    selector: 'app-panel-archive',
    templateUrl: './panel-archive.component.html',
    styleUrls: ['./panel-archive.component.css'],
    standalone: false
})
export class PanelArchiveComponent implements OnInit {
  panelType = '';
  panelConfigs: Array<PanelConfig> = [];
  appConfig: AppConfig = getAppConfig();
  longTitle: string;

  constructor(private route: ActivatedRoute,
              private readonly meta: Meta,
              private titleService: Title,
              private pombaseApiService: PombaseAPIService) { }

  setPageTitle(): void {
    let title = this.appConfig.site_name + ' - ' + this.longTitle;

    this.titleService.setTitle(title);
    this.meta.updateTag({property: 'og:title', content: title});
    this.meta.updateTag({property: 'description', content: title});
  }

  ngOnInit() {
    this.route.params.forEach((params: Params) => {
      if (params['archiveType'] !== undefined) {
        this.panelType = params['archiveType'];

        this.panelConfigs = [];

        if (this.panelType === 'explore') {
          this.longTitle = 'Explore PomBase items';
        } else {
          if (this.panelType === 'spotlight') {
            this.longTitle = 'Community Curation Research Spotlights'
          } else {
            this.longTitle = this.panelType.charAt(0).toUpperCase() + this.panelType.slice(1);
          }
        }

        this.longTitle = `Archive of ${this.longTitle}`;

        this.setPageTitle();

        const panelsPromise = this.pombaseApiService.getPanelConfig(this.panelType, 'full');
        panelsPromise.then(res => {
          this.panelConfigs = res;
          this.panelConfigs.sort((conf1: PanelConfig, conf2: PanelConfig) => {
            // reverse compare
            return conf2.date_added.localeCompare(conf1.date_added);
          });
        });
      };
    });
  }
}
