import { Component, Input, OnInit } from '@angular/core';

import { ExtPart, ExtRange, GeneShort } from '../pombase-api.service';
import { GeneUniquename } from '../pombase-query';
import { TermShort } from '../pombase-query';
import { getAnnotationTableConfig, AnnotationTableConfig, AnnotationType,
         getAppConfig, getXrf } from '../config';

@Component({
  selector: 'app-extension-display',
  templateUrl: './extension-display.component.html',
  styleUrls: ['./extension-display.component.css']
})
export class ExtensionDisplayComponent implements OnInit {
  @Input() extension: Array<ExtPart> = [];
  @Input() annotationTypeName: string;
  @Input() highlightRelations = true;
  @Input() geneUniquename?: GeneUniquename = undefined;

  displayExtension: { relTypeName: string; rawName: string; extRange: any; }[] = [];

  config: AnnotationTableConfig = getAnnotationTableConfig();
  typeConfig: AnnotationType;

  constructor() { }

  getLink(idWithPrefix: string): string|undefined {
    const linkConf = getXrf(idWithPrefix);
    if (linkConf) {
      return linkConf.url;
    } else {
      return undefined;
    }
  }

  residueTitle(posAndResidue: string): string {
    if (!this.geneUniquename) {
      return '';
    }

    const modAbbrevConfig = this.typeConfig.modification_abbreviations;
    if (!modAbbrevConfig) {
      return '';
    }

    const modGeneConfig = modAbbrevConfig[this.geneUniquename];
    if (!modGeneConfig) {
      return '';
    }

    const newResidue = modGeneConfig[posAndResidue];
    if (newResidue) {
      return newResidue;
    } else {
      return '';
    }
  }

  ngOnInit() {
    let organismRE: RegExp;
    const loadOrganism = getAppConfig().getConfigOrganism();
    if (loadOrganism) {
      const loadOrganismFullName = loadOrganism.genus + ' ' + loadOrganism.species;
      organismRE = new RegExp(` *\\(${loadOrganismFullName}\\)`);
    }

    this.typeConfig = this.config.getAnnotationType(this.annotationTypeName);

    let extensionCopy: Array<ExtPart> = this.extension.slice();

    this.displayExtension =
      extensionCopy.map(ext => {
        let origRange: Array<ExtRange> = [];
        if (ext.ext_range instanceof Array) {
          origRange = ext.ext_range;
        } else {
          origRange = [ext.ext_range];
        }

        let newRange = origRange.map(rangePart => {
          const termForProduct =
            (gene: GeneShort|undefined, id: string, term?: TermShort) => {
              let displayName: string;
              if (term) {
                displayName = term.name;
                if (organismRE) {
                  displayName = displayName.replace(organismRE, '');
                }
              } else {
                displayName = id;
              }
              if (gene && gene.name && displayName.startsWith(gene.name + '/')) {
                displayName = displayName.substring(gene.name.length + 1);
              }
              return {
                id: id,
                link: this.getLink(id),
                displayName,
              };
            };

          if (rangePart.gene_product) {
            return {
              gene_product: termForProduct(undefined, rangePart.gene_product,
                                           rangePart.term),
            };
          } else {
            if (rangePart.gene_and_gene_product) {
              return {
                gene_and_gene_product: {
                  gene: rangePart.gene_and_gene_product.gene,
                  product: termForProduct(rangePart.gene_and_gene_product.gene,
                                          rangePart.gene_and_gene_product.product,
                                          rangePart.term)
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
          }
        });

        return {
          relTypeName: ext.rel_type_display_name || ext.rel_type_name,
          rawName: ext.rel_type_name,
          extRange: newRange,
        };
      });
  }
}
