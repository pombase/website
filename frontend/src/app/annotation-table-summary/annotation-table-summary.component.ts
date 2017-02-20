import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { TermAnnotation } from '../pombase-api.service';

import { getAnnotationTableConfig, AnnotationTableConfig } from '../config';

@Component({
  selector: 'app-annotation-table-summary',
  templateUrl: './annotation-table-summary.component.html',
  styleUrls: ['./annotation-table-summary.component.css']
})
export class AnnotationTableSummaryComponent implements OnInit, OnChanges {
  @Input() annotationTable: Array<TermAnnotation>;

  annotationTypeDisplayName = null;

  extensionSummariesByTerm = {};

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
      if (ext.length > 1) {
        let tidyExt = ext.map(part =>
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
              existing[0].rel_type_display_name == ext[0].rel_type_display_name) {
            updateExt = existing;
          }
        }
        if (!updateExt) {
          updateExt = [
            {
            rel_type_name: ext[0].rel_type_name,
            rel_type_display_name: ext[0].rel_type_display_name,
            ext_range: [],
            }
          ];
          compacted.push(updateExt);
        }

        if (!this.containsRange(updateExt[0].ext_range, ext[0].ext_range)) {
          updateExt[0].ext_range.push(ext[0].ext_range);
        }
      }
    }
    return compacted;
  }

  makeExtensionSummaries() {
    this.extensionSummariesByTerm = {};

    if (this.annotationTable) {
      for (let term_annotation of this.annotationTable) {
        let termid = term_annotation.term.termid;
        let thisTermExtensions =
          term_annotation.annotations.map(annotation => annotation.extension)
          .filter(extension => extension && extension.length > 0);
        if (thisTermExtensions.length > 0) {
          this.extensionSummariesByTerm[termid] = this.compactExtensions(thisTermExtensions);
        }
      }
    }
  }

  ngOnChanges() {
    this.makeExtensionSummaries();
  }

  ngOnInit() {
    this.makeExtensionSummaries();
  }
}
