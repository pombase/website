import { Component, OnInit } from '@angular/core';


import { Metadata, PombaseAPIService } from '../pombase-api.service';
import { Util } from '../shared/util';

import { getAppConfig, PanelConfig } from '../config';

@Component({
  selector: 'app-front',
  templateUrl: './front.component.html',
  styleUrls: ['./front.component.css']
})
export class FrontComponent implements OnInit {
  metadata: Metadata;

  imageNames = ['Slide1.png', 'Slide2.png', 'Slide3.png'];
  rotatingImageName = this.imageNames[0];
  spotlightPanelConfig =
    getAppConfig().frontPagePanels.filter(conf =>
      conf.panel_type === 'spotlight' && conf.show_on_front_page
    );
  communityPanelConfig =
    getAppConfig().frontPagePanels.filter(conf =>
      conf.panel_type === 'community' && conf.show_on_front_page
    );
  explorePanelConfig =
    getAppConfig().frontPagePanels.filter(conf =>
      conf.panel_type === 'explore' && conf.show_on_front_page
    );

  spotlightConf: PanelConfig;
  communityConf: PanelConfig;
  exploreConf: PanelConfig;

  siteName = getAppConfig().site_name;

  constructor(private pombaseApiService: PombaseAPIService) { }

  ngOnInit() {
    this.rotatingImageName = Util.randElement(this.imageNames);
    this.spotlightConf = Util.randElement(this.spotlightPanelConfig);
    this.communityConf = Util.randElement(this.communityPanelConfig);
    this.exploreConf = Util.randElement(this.explorePanelConfig);

    this.pombaseApiService.getMetadata()
      .then(metadata => {
        this.metadata = metadata;
      });
  }
}
