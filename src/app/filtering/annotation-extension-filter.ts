import { AnnotationTable } from '../pombase-api.service';
import { TermShort } from '../pombase-query';
import { Filter } from '../filtering';

export class AnnotationExtensionFilter implements Filter<AnnotationTable> {
  constructor(private rangeTermIds: Array<string>) { }

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
              if (extPart.ext_range['term']) {
                const rangeTerm: TermShort = extPart.ext_range['term'];
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

      if (retTermAnnotation.annotations.length > 0) {
        retTable.push(retTermAnnotation);
        filteredAnnotationCount += retTermAnnotation.annotations.length;
      }
    }

    return [retTable, annotationCount, filteredAnnotationCount];
  }
}
