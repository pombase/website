import { AnnotationTable } from '../pombase-api.service';
import { AnnotationFilter } from './annotation-filter';

export class AnnotationTermFilter implements AnnotationFilter {
  constructor(private termIds: Array<string>) { }

  filter(annotationTable: AnnotationTable): AnnotationTable {
    let retTable = [] as AnnotationTable;

    ANNOTATION: for (let annotation of annotationTable) {
      for (let termId of this.termIds) {
        if (annotation.term.interesting_parents) {
          for (let interestingAncestor of annotation.term.interesting_parents) {
            if (interestingAncestor === termId) {
              retTable.push(annotation);
              break ANNOTATION;
            }
          }
        }
      }
    }

    return retTable;
  }
}
