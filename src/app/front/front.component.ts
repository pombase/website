import { Component, OnInit } from '@angular/core';

import { Metadata, PombaseAPIService } from '../pombase-api.service';
import { Util } from '../shared/util';

import { getAppConfig, PanelConfig } from '../config';
import { DeployConfigService } from '../deploy-config.service';

@Component({
    selector: 'app-front',
    templateUrl: './front.component.html',
    styleUrls: ['./front.component.css'],
    standalone: false
})
export class FrontComponent implements OnInit {
  metadata: Metadata;

  imageNames = ['Slide1.png', 'Slide2.png', 'Slide3.png'];
  rotatingImageName = this.imageNames[0];
  appConfig = getAppConfig();

  fypoSlim = this.appConfig.slims['fypo_slim'];

  spotlightPanelConfig =
    this.appConfig.frontPagePanels.filter(conf =>
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

  examplePages = getAppConfig().example_pages;
  hasDiseaseAnnotation = getAppConfig().has_disease_annotation;
  hasUnknownsList = getAppConfig().has_unknowns_list;
  showNewsItems = getAppConfig().news_on_front_page;
  welcomeMessage = getAppConfig().welcome_message;
  missionStatement = getAppConfig().mission_statement;
  hasAdminCuration = getAppConfig().has_admin_curation;

  showElixirAndGbcLogos = getAppConfig().footer.show_elixir_and_gbc_message;

  hasJBrowse2 = !!getAppConfig().jbrowse2AssemblyName;

  constructor(private pombaseApiService: PombaseAPIService,
              public deployConfigService: DeployConfigService) { }

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
