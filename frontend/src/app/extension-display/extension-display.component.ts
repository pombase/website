import { Component, Input, OnInit } from '@angular/core';

import { getAppConfig, LinkoutConfig } from '../config';

@Component({
  selector: 'app-extension-display',
  templateUrl: './extension-display.component.html',
  styleUrls: ['./extension-display.component.css']
})
export class ExtensionDisplayComponent implements OnInit {
  @Input() extension = [];

  displayExtension = [];
  linkoutConfig: LinkoutConfig = {};

  constructor() { }

  ngOnInit() {
    this.linkoutConfig = getAppConfig().linkoutConfig;

    this.displayExtension =
      this.extension.map(ext => {
        let newRange = [];
        if (ext.ext_range instanceof Array) {
          newRange = ext.ext_range;
        } else {
          newRange = [ext.ext_range];
        }

        return {
          relTypeName: ext.rel_type_display_name || ext.rel_type_name,
          extRange: newRange,
        }
      });
  }
}
