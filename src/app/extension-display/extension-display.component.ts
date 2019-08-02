import { Component, Input, OnInit } from '@angular/core';

import { ExtPart, ExtRange } from '../pombase-api.service';
import { getAnnotationTableConfig, AnnotationTableConfig,
         getAppConfig, LinkoutConfig, getXrf, getXrfWithPrefix } from '../config';

@Component({
  selector: 'app-extension-display',
  templateUrl: './extension-display.component.html',
  styleUrls: ['./extension-display.component.css']
})
export class ExtensionDisplayComponent implements OnInit {
  @Input() extension: Array<ExtPart> = [];

  displayExtension: { relTypeName: string; extRange: any; }[] = [];
  linkoutConfig: LinkoutConfig = {};
  config: AnnotationTableConfig = getAnnotationTableConfig();

  constructor() { }

  getLinkWithPrefix(prefix: string, id: string): string {
    return getXrfWithPrefix(prefix, id).url;
  }

  getLink(idWithPrefix: string): string {
    const linkConf = getXrf(idWithPrefix);
    if (linkConf) {
      return linkConf.url;
    } else {
      return null;
    }
  }

  ngOnInit() {
    let organismRE: RegExp = null;
    const loadOrganism = getAppConfig().getConfigOrganism();
    if (loadOrganism) {
      const loadOrganismFullName = loadOrganism.genus + ' ' + loadOrganism.species;
      organismRE = new RegExp(` *\\(${loadOrganismFullName}\\)`);
    }

    this.linkoutConfig = getAppConfig().linkoutConfig;

    let extensionCopy: Array<ExtPart> = this.extension.slice();

    this.displayExtension =
      extensionCopy.map(ext => {
        let newRange: Array<any> = [];
        if (ext.ext_range instanceof Array) {
          newRange = ext.ext_range;
        } else {
          newRange = [ext.ext_range];
        }

        newRange = newRange.map(rangePart => {
          if (rangePart.gene_product) {
            const id = rangePart.gene_product;
            let displayName;
            if (rangePart.term) {
              displayName = rangePart.term.name;
              if (organismRE) {
                displayName = displayName.replace(organismRE, '');
              }
            } else {
              displayName = id;
            }
            return {
              gene_product: {
                id: id,
                link: this.getLink(id),
                displayName,
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
                    ext.rel_type_name === 'has_severity') {
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
