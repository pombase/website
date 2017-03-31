import { Component, Input, OnInit } from '@angular/core';

import { ExtPart } from '../pombase-api.service';
import { getAnnotationTableConfig, AnnotationTableConfig,
         getAppConfig, LinkoutConfig, getExternalLink,
         getExternalLinkWithPrefix } from '../config';

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

  getLinkWithPrefix(prefix: string, id: string): string {
    return getExternalLinkWithPrefix(prefix, id);
  }

  getLink(idWithPrefix: string): string {
    return getExternalLink(idWithPrefix);
  }

  ngOnInit() {
    this.linkoutConfig = getAppConfig().linkoutConfig;

    let extensionCopy: Array<ExtPart> = this.extension.slice();

    this.displayExtension =
      extensionCopy.map(ext => {
        let newRange = [];
        if (ext.ext_range instanceof Array) {
          newRange = ext.ext_range;
        } else {
          newRange = [ext.ext_range];
        }

        newRange = newRange.map(rangePart => {
          if (rangePart.gene_product) {
            let id = rangePart.gene_product;
            return {
              gene_product: {
                id: id,
                link: this.getLink(id),
              }
            };
          } else {
            if (rangePart.domain) {
              let id = rangePart.domain;
              return {
                domain: {
                  id: id,
                  link: this.getLink(id),
                }
              };
            } else {
              if (rangePart.misc) {
                let value = rangePart.misc;
                let link = null;
                if (ext.rel_type_name === 'has_penetrance' ||
                    ext.rel_type_name === 'has_expressivity') {
                  value += '%';
                } else {
                  link = this.getLink(value);
                }
                return {
                  misc: {
                    value: value,
                    link: link,
                  }
                };
              } else {
                return rangePart;
              }
            }
          }
        });

        return {
          relTypeName: ext.rel_type_display_name || ext.rel_type_name,
          extRange: newRange,
        };
      });
  }
}
