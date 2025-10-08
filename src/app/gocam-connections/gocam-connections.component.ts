import { Component } from '@angular/core';

import { ActivatedRoute, Params } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AppConfig, getAppConfig } from '../config';
import { PombaseAPIService } from '../pombase-api.service';

@Component({
  selector: 'app-gocam-connections',
  templateUrl: './gocam-connections.component.html',
  styleUrl: './gocam-connections.component.css',
  standalone: false,
})
export class GocamConnectionsComponent {
  appConfig: AppConfig = getAppConfig();
  siteName = getAppConfig().site_name;

  pagePath: 'front' | 'model-list' | 'summary/all' | 'summary/connected' | 'mega-model/all' |
            'mega-model/connected' | 'connections' | 'missing-activities' = 'front';
  pageType?: string;
  pageSubType?: string;

  iframeUrl?: SafeResourceUrl;
  showChemicals = false;
  showTargets = false;
  showModelBoxes = true;

  modelCount = 0;

  constructor(private titleService: Title,
              private sanitizer: DomSanitizer,
              private route: ActivatedRoute,
              private readonly meta: Meta,
              pombaseApi: PombaseAPIService) {
    pombaseApi.getAllGoCamDetailsMap()
      .then(results => {
        this.modelCount = Object.keys(results).length;
      })
  }

  setPageTitle(): void {
    let title = this.appConfig.site_name + ' - GO-CAM pathways';

    if (this.pagePath == 'summary/connected') {
      title += ' - Summary: Connected models';
    } else if (this.pagePath == 'summary/all') {
      title += ' - Summary: All models';
    }

    this.titleService.setTitle(title);

    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'description', content: title });
  }

  updateMegaModelUrl(): void {
    let rawUrl = '/gocam_view/full/';
    if (this.pageSubType == 'connected') {
      rawUrl += 'ALL_CONNECTED';
    } else {
      rawUrl += 'ALL_MERGED';
    }

    let flags = [];
    if (!this.showChemicals) {
      flags.push("no_chemicals");
    }
    if (!this.showTargets) {
      flags.push("no_inputs");
    }

    if (this.showModelBoxes) {
      flags.push("show_models");
    } else {
      flags.push("hide_models");
    }

    if (flags.length > 0) {
      rawUrl += ':' + flags.join(",")
    }

    this.iframeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(rawUrl);
  }

  ngOnInit(): void {
    this.route.params.forEach((params: Params) => {
      const pageType = params['pageType'] || 'front';
      this.pageType = pageType;
      this.pageSubType = params['pageSubType'];
      this.pagePath = pageType;

      if (this.pageSubType) {
        this.pagePath += '/' + this.pageSubType;
      }

      if (this.pagePath.startsWith('summary/')) {
        const rawSummaryUrl = '/gocam_summary/' + params['pageSubType'];
        this.iframeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(rawSummaryUrl);
      } else if (this.pagePath.startsWith('mega-model/')) {
        this.updateMegaModelUrl();
      }

      this.setPageTitle();
    });
  }
}
