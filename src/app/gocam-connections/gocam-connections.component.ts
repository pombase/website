import { Component } from '@angular/core';

import { ActivatedRoute, Params } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { AppConfig, getAppConfig } from '../config';
import { Util } from '../shared/util';

@Component({
  selector: 'app-gocam-connections',
  templateUrl: './gocam-connections.component.html',
  styleUrl: './gocam-connections.component.css',
  standalone: false,
})
export class GocamConnectionsComponent {
  appConfig: AppConfig = getAppConfig();

  pageType: 'model-list' | 'summary' | 'connections' = 'model-list';

  constructor(private titleService: Title,
              private route: ActivatedRoute,
              private readonly meta: Meta) {
  }

  setPageTitle(): void {
    const title = this.appConfig.site_name + ' - GO-CAM ' +
          Util.capitalize(this.pageType);

    this.titleService.setTitle(title);
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'description', content: title });
  }

  ngOnInit() {
    this.route.params.forEach((params: Params) => {
      if (params['pageType'] !== undefined) {
        this.pageType = params['pageType'] || 'list';

        this.setPageTitle();
      };
    });
  }
}
