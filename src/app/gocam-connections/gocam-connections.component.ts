import { Component } from '@angular/core';

import { Meta, Title } from '@angular/platform-browser';
import { AppConfig, getAppConfig } from '../config';

@Component({
  selector: 'app-gocam-connections',
  templateUrl: './gocam-connections.component.html',
  styleUrl: './gocam-connections.component.css',
  standalone: false,
})
export class GocamConnectionsComponent {
  appConfig: AppConfig = getAppConfig();

  constructor(private titleService: Title,
              private readonly meta: Meta) {
  }

  setPageTitle(): void {
    const title = this.appConfig.site_name + ' - GO-CAM Connections';

    this.titleService.setTitle(title);
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'description', content: title });
  }

  ngOnInit(): void {
    this.setPageTitle();
  }
}
