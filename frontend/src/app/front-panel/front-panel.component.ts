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

  panelDescription = null;
  headImage = null;

  constructor() { }

  ngOnInit() {
    this.headImage = Util.randElement(this.conf.head_image);

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
