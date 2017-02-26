import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { TermAnnotation } from '../pombase-api.service';

import { getAnnotationTableConfig, AnnotationTableConfig } from '../config';

@Component({
  selector: 'app-annotation-table-summary',
  templateUrl: './annotation-table-summary.component.html',
  styleUrls: ['./annotation-table-summary.component.css']
})
export class AnnotationTableSummaryComponent implements OnInit, OnChanges {
  @Input() annotationTypeName: string;
  @Input() annotationTable: Array<TermAnnotation>;
  @Input() showFeaturesInSummary = false;

  config: AnnotationTableConfig = getAnnotationTableConfig();
  annotationTypeDisplayName = null;
  extensionSummariesByTerm = {};
  geneSummariesByTerm = {};
  extensionsToHide = [];
  showGenes = false;

  constructor() { }

  trackByTermId(index: number, item: any) {
    return item.term.termid;
  }

  containsRange(extRanges: Array<any>, ext: any) {
    for (let testExt of extRanges) {
      if (testExt.relTypeName == ext.relTypeName) {
        if (testExt.term && ext.term &&
            testExt.term.termid == ext.term.termid) {
          return true;
        } else {
          if (testExt.gene && ext.gene &&
              testExt.gene.uniquename == ext.gene.uniquename) {
            return true;
          } else {
            if (testExt.misc && ext.misc &&
                testExt.misc == ext.misc) {
              return true;
            }
          }
        }
      }
    }

    return false;
  }

  extensionAsString(ext: any): string {
    // a dirty hack:
    return JSON.stringify(ext);
  }

  containsExtension(compactExtensions: Array<any>, ext: any): boolean {
    for (let compactExt of compactExtensions) {
      if (this.extensionAsString(compactExt) == this.extensionAsString(ext)) {
        return true;
      }
    }

    return false;
  }

  compactExtensions(extensions: Array<any>) {
    let compacted = [];
    for (let ext of extensions) {
      let filteredExt =
        ext.filter(part => {
          return this.extensionsToHide.indexOf(part.rel_type_name) == -1;
        });

      if (filteredExt.length == 0) {
        continue;
      }

      if (filteredExt.length > 1) {
        let tidyExt = filteredExt.map(part =>
                                      {
                                        return {
                                          rel_type_name: part.rel_type_name,
                                          rel_type_display_name: part.rel_type_display_name,
                                          ext_range: [part.ext_range]
                                        };
                                      }
                                     );
        if (!this.containsExtension(compacted, tidyExt)) {
          compacted.push(tidyExt);
        }
      } else {
        let updateExt = null;
        for (let existing of compacted) {
          if (existing.length == 1 &&
              existing[0].rel_type_display_name == filteredExt[0].rel_type_display_name) {
            updateExt = existing;
          }
        }
        if (!updateExt) {
          updateExt = [
            {
            rel_type_name: filteredExt[0].rel_type_name,
            rel_type_display_name: filteredExt[0].rel_type_display_name,
            ext_range: [],
            }
          ];
          compacted.push(updateExt);
        }

        if (!this.containsRange(updateExt[0].ext_range, filteredExt[0].ext_range)) {
          updateExt[0].ext_range.push(ext[0].ext_range);
        }
      }
    }
    return compacted;
  }

  makeExtensionSummaries() {
    this.extensionSummariesByTerm = {};

    if (this.annotationTable) {
      for (let termAnnotation of this.annotationTable) {
        let termid = termAnnotation.term.termid;
        let thisTermExtensionParts =
          termAnnotation.annotations.map(annotation => annotation.extension)
          .filter(extension => extension && extension.length > 0)
        if (thisTermExtensionParts.length > 0) {
          this.extensionSummariesByTerm[termid] = this.compactExtensions(thisTermExtensionParts);
        }
      }
    }
  }

  makeGeneSummaries(): void {
    this.geneSummariesByTerm = {};

    if (this.annotationTable) {
      for (let termAnnotation of this.annotationTable) {
        let seenGenesMap = {};
        for (let annotation of termAnnotation.annotations) {
          if (annotation.genotype &&
              annotation.genotype.expressed_alleles.length == 1) {
            seenGenesMap[annotation.gene_uniquename] =
              annotation.genotype.expressed_alleles[0].allele.gene;
          }
        }

        let seenGenes =
          Object.keys(seenGenesMap).map((key) => {
            return seenGenesMap[key];
          });

        if (seenGenes.length > 0) {
          this.geneSummariesByTerm[termAnnotation.term.termid] = seenGenes;
        }
      }
    }
  }

  ngOnChanges() {
    let typeConfig = this.config.getAnnotationType(this.annotationTypeName);

    if (typeConfig.summary && typeConfig.summary.extensionsToHide) {
      this.extensionsToHide = typeConfig.summary.extensionsToHide;
    }

    if (this.showFeaturesInSummary) {
      this.showGenes = true;
      this.makeGeneSummaries();
    }

    this.makeExtensionSummaries();
  }

  ngOnInit() {
    this.ngOnChanges();
  }
}
