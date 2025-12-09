import { Component, OnInit } from '@angular/core';

import { Metadata, PombaseAPIService, TestimonialConfig } from '../pombase-api.service';

import { faWarning } from '@fortawesome/free-solid-svg-icons';

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

  appConfig = getAppConfig();

  fypoSlim = this.appConfig.slims['fypo_slim'];

  spotlightConf: PanelConfig;
  exploreConf: PanelConfig;

  siteName = getAppConfig().site_name;

  examplePages = getAppConfig().example_pages;
  hasDiseaseAnnotation = getAppConfig().has_disease_annotation;
  hasUnknownsList = getAppConfig().has_unknowns_list;
  showNewsItems = getAppConfig().news_on_front_page;
  welcomeMessage = getAppConfig().welcome_message;
  hasAdminCuration = getAppConfig().has_admin_curation;

  randomTestimonials: Array<TestimonialConfig> = [];

  showElixirAndGbcLogos = getAppConfig().footer.show_elixir_and_gbc_message;

  hasJBrowse2 = !!getAppConfig().jbrowse2AssemblyName;

  faWarning = faWarning;

  constructor(private pombaseApiService: PombaseAPIService,
              public deployConfigService: DeployConfigService) {
    const testimonialsPromise = this.pombaseApiService.getTestimonialConfig('random', 'front');
    testimonialsPromise.then(res => this.randomTestimonials = res);
  }

  ngOnInit() {
    const spotlightsPromise = this.pombaseApiService.getPanelConfig('spotlight', 'front');
    spotlightsPromise.then(conf => this.spotlightConf = conf[0]);

    const explorePromise = this.pombaseApiService.getPanelConfig('explore', 'front');
    explorePromise.then(conf => this.exploreConf = conf[0]);

    this.pombaseApiService.getMetadata()
      .then(metadata => {
        this.metadata = metadata;
      });
  }
}
