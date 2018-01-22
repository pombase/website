import { Component, OnInit, Input } from '@angular/core';

import { PanelConfig } from '../config';
import { Util } from '../shared/util';

@Component({
  selector: 'app-front-panel',
  templateUrl: './front-panel.component.html',
  styleUrls: ['./front-panel.component.css']
})
export class FrontPanelComponent implements OnInit {
  @Input() conf: PanelConfig;
  @Input() showDateAdded?: boolean;

  panelDescription = null;
  headImage: string = null;
  headVideo: string = null;

  constructor() { }

  ngOnInit() {
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

    if (this.conf.panel_type === 'spotlight') {
      this.panelDescription = 'Research spotlight';
    } else {
      if (this.conf.panel_type === 'explore') {
        this.panelDescription = 'Explore PomBase';
      } else {
        this.panelDescription = null;
      }
    }
  }
}
