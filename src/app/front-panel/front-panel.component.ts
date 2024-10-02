import { Component, OnInit, Input } from '@angular/core';

import { PanelConfig, AppConfig, getAppConfig } from '../config';
import { Util } from '../shared/util';

@Component({
  selector: 'app-front-panel',
  templateUrl: './front-panel.component.html',
  styleUrls: ['./front-panel.component.css']
})
export class FrontPanelComponent implements OnInit {
  @Input() conf: PanelConfig;
  @Input() showDateAdded?: boolean;

  panelDescription: string|undefined;
  headImage: string;
  headImageLink: string;
  headVideo: string;

  appConfig: AppConfig = getAppConfig();
  siteName = this.appConfig.site_name;

  constructor() { }

  ngOnInit() {
    if (this.conf.head_image.length > 0) {
      const randMedia = Util.randElement(this.conf.head_image);

      if (randMedia.match(/\.mp4$/)) {
        this.headVideo = randMedia;
      } else {
        this.headImage = randMedia;

        if (!this.headImage.match(/^assets\//) &&
            !this.headImage.startsWith('/') &&
            !this.headImage.startsWith('http')) {
          this.headImage = 'assets/' + this.headImage;
        }
      }

      this.headImageLink = this.conf.head_image_link;
    }

    if (this.conf.panel_type === 'spotlight') {
      this.panelDescription = 'Research spotlight';
    } else {
      if (this.conf.panel_type === 'explore') {
        this.panelDescription = 'Explore ' + this.siteName;
      } else {
        this.panelDescription = undefined;
      }
    }
  }
}
