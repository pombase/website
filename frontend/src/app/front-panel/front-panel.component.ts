import { Component, OnInit, Input } from '@angular/core';

import { PanelConfig } from '../config';

@Component({
  selector: 'app-front-panel',
  templateUrl: './front-panel.component.html',
  styleUrls: ['./front-panel.component.css']
})
export class FrontPanelComponent implements OnInit {
  @Input() conf: PanelConfig;

  panelDescription = null;

  constructor() { }

  ngOnInit() {
    if (this.conf.panel_type === 'spotlight') {
      this.panelDescription = 'Research spotlight';
    } else {
      if (this.conf.panel_type === 'explore') {
        this.panelDescription = 'Explore PomBase';
      }
    }
  }
}
