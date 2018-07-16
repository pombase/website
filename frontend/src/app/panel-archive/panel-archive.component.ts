import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { getAppConfig, PanelConfig } from '../config';

@Component({
  selector: 'app-panel-archive',
  templateUrl: './panel-archive.component.html',
  styleUrls: ['./panel-archive.component.css']
})
export class PanelArchiveComponent implements OnInit {
  panelType = '';
  panelConfigs = [];

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.forEach((params: Params) => {
      if (params['archiveType'] !== undefined) {
        this.panelType = params['archiveType'];

        this.panelConfigs = [];

        getAppConfig().frontPagePanels
          .filter(conf => conf.panel_type === this.panelType)
          .sort((conf1: PanelConfig, conf2: PanelConfig) => {
            // reverse compare
            return conf2.date_added.localeCompare(conf1.date_added);
          })
          .map(conf => {
            this.panelConfigs.push(conf);
          });
      };
    });
  }
}
