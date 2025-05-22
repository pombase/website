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

  summaryType: string = 'connected';
  iframeUrl?: SafeResourceUrl;

  constructor(private titleService: Title,
              private sanitizer: DomSanitizer,
              private readonly meta: Meta,
              private route: ActivatedRoute) {
  }

  setPageTitle(): void {
    let title = this.appConfig.site_name + ' - GO-CAM Summary';

    if (this.summaryType == 'connected') {
      title += ' - Connected models';
    } else {
      title += ' - All models';
    }

    this.titleService.setTitle(title);
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'description', content: title });
  }

  ngOnInit(): void {
    this.route.params.forEach((params: Params) => {
      this.summaryType = params['summaryType'] || 'connected';

      const rawUrl = '/gocam_summary/' + this.summaryType;
      this.iframeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(rawUrl);

      this.setPageTitle();
    });
  }
}
