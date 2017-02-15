import { Component, Input, OnInit } from '@angular/core';

import { ExtPart } from '../pombase-api.service';
import { getAnnotationTableConfig, AnnotationTableConfig,
         getAppConfig, LinkoutConfig, getExternalLink } from '../config';

@Component({
  selector: 'app-extension-display',
  templateUrl: './extension-display.component.html',
  styleUrls: ['./extension-display.component.css']
})
export class ExtensionDisplayComponent implements OnInit {
  @Input() extension = [];

  displayExtension = [];
  linkoutConfig: LinkoutConfig = {};
  config: AnnotationTableConfig = getAnnotationTableConfig();

  constructor() { }

  getLinkWithPrefix(abbreviation: string, id: string): string {
    return getExternalLink(abbreviation, id);
  }

  getLink(idWithPrefix: string): string {
    let matches = idWithPrefix.match(/^([^:]+):(.*)/);

    if (matches) {
      return getExternalLink(matches[1], matches[2]);
    } else {
      return '';
    }
  }

  ngOnInit() {
    this.linkoutConfig = getAppConfig().linkoutConfig;

    let extensionCopy: Array<ExtPart> = this.extension.slice();
    let sortedExtension: Array<ExtPart> = [];
    let extensionConfig = this.config.extensions;

    for (let confExtGroup of extensionConfig.extensionOrder) {
      for (let confExtRelName of confExtGroup) {
        for (let i = extensionCopy.length - 1; i >= 0; i--) {
          if (extensionCopy[i].rel_type_name == confExtRelName) {
            sortedExtension.push(extensionCopy.splice(i, 1)[0]);
          }
        }
      }
    }

    for (let i = extensionCopy.length - 1; i >= 0; i--) {
      if (extensionConfig.alwaysLast.indexOf(extensionCopy[i].rel_type_name) == -1) {
        sortedExtension.push(extensionCopy.splice(i, 1)[0]);
      }
    }

    // add the alwaysLast parts
    sortedExtension = sortedExtension.concat(extensionCopy);

    this.displayExtension =
      sortedExtension.map(ext => {
        let newRange = [];
        if (ext.ext_range instanceof Array) {
          newRange = ext.ext_range;
        } else {
          newRange = [ext.ext_range];
        }

        newRange.map(rangePart => {
          if (rangePart.gene_product) {
            let id = rangePart.gene_product;
            rangePart.gene_product = {
              id: id,
              link: this.getLink(id),
            }
          } else {
            if (rangePart.domain) {
              let id = rangePart.domain;
              rangePart.domain = {
                id: id,
                link: this.getLink(id),
              }
            }
          }
        });

        return {
          relTypeName: ext.rel_type_display_name || ext.rel_type_name,
          extRange: newRange,
        }
      });
  }
}
