import { AnnotationTable } from '../pombase-api.service';
import { Filter } from '../filtering';

export class AnnotationExtensionFilter implements Filter<AnnotationTable> {
  constructor(private extensionRelNames: Array<string>,
              private rangeTermIds: Array<string>) { }

  filter(annotationTable: AnnotationTable): [AnnotationTable, number, number] {
    let retTable = [] as AnnotationTable;
    let annotationCount = 0;
    let filteredAnnotationCount = 0;

    for (let termAnnotation of annotationTable) {
      annotationCount += termAnnotation.annotations.length;
      let retTermAnnotation = Object.assign({}, termAnnotation);
      retTermAnnotation.annotations = [];

      ANNOTATION: for (let annotation of termAnnotation.annotations) {
        for (let filterTermId of this.rangeTermIds) {
          if (annotation.extension) {
            for (let extPart of annotation.extension) {
              const rangeTerm = extPart.ext_range.term;
              if (this.extensionRelNames.includes(extPart.rel_type_name) && rangeTerm) {
                if (filterTermId === rangeTerm.termid) {
                  retTermAnnotation.annotations.push(annotation);
                  continue ANNOTATION;
                }
                if (rangeTerm.interesting_parent_ids) {
                  for (let interestingAncestor of rangeTerm.interesting_parent_ids) {
                    if (interestingAncestor === filterTermId) {
                      retTermAnnotation.annotations.push(annotation);
                      continue ANNOTATION;
                    }
                  }
                }
              }
            }
          }
        }
      }

      if (retTermAnnotation.summary) {
        retTermAnnotation.summary = retTermAnnotation.summary
          .filter(summaryRow => {
            if (summaryRow.extension) {
              for (const extPart of summaryRow.extension) {
                if (extPart.ext_range.summaryTerms) {
                  for (const rangeSummaryTerm of extPart.ext_range.summaryTerms) {

                    if (!this.extensionRelNames.includes(extPart.rel_type_name)) {
                      return false;
                    }

                    if (this.rangeTermIds.includes(rangeSummaryTerm.termid)) {
                      return true;
                    }

                    for (const rangeTermInterestingParentId of rangeSummaryTerm.interesting_parent_ids) {
                      if (this.rangeTermIds.includes(rangeTermInterestingParentId)) {
                        return true;
                      }
                    }
                  }
                }
              }
            }
            return false;
          });
      }

      if (retTermAnnotation.annotations.length > 0) {
        retTable.push(retTermAnnotation);
        filteredAnnotationCount += retTermAnnotation.annotations.length;
      }
    }

    return [retTable, annotationCount, filteredAnnotationCount];
  }
}
