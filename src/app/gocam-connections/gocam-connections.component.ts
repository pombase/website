import { Component } from '@angular/core';

import { ActivatedRoute, Params } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AppConfig, getAppConfig } from '../config';

@Component({
  selector: 'app-gocam-connections',
  templateUrl: './gocam-connections.component.html',
  styleUrl: './gocam-connections.component.css',
  standalone: false,
})
export class GocamConnectionsComponent {
  appConfig: AppConfig = getAppConfig();

  pagePath: 'model-list' | 'summary/all' | 'summary/connected' | 'mega-model/all' |
            'mega-model/connected' | 'connections' = 'model-list';
  pageType?: string;
  pageSubType?: string;

  iframeUrl?: SafeResourceUrl;
  includeChemicals = false;

  constructor(private titleService: Title,
              private sanitizer: DomSanitizer,
              private route: ActivatedRoute,
              private readonly meta: Meta) {
  }

  setPageTitle(): void {
    let title = this.appConfig.site_name + ' - GO-CAM';

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

    if (this.includeChemicals) {
      rawUrl += ':include_chemical';
    } else {
      rawUrl += ':no_chemicals';
    }

    this.iframeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(rawUrl);
  }

  ngOnInit(): void {
    this.route.params.forEach((params: Params) => {
      const pageType = params['pageType'] || 'model-list';
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
