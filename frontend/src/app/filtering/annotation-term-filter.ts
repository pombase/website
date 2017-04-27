import { AnnotationTable } from '../pombase-api.service';
import { AnnotationFilter } from './annotation-filter';

export class AnnotationTermFilter implements AnnotationFilter {
  constructor(private termIds: Array<string>) { }

  filter(annotationTable: AnnotationTable): [AnnotationTable, number, number] {
    let retTable = [] as AnnotationTable;
    let annotationCount = 0;
    let filteredAnnotationCount = 0;

    for (let annotation of annotationTable) {
      TERMS: for (let termId of this.termIds) {
        annotationCount += annotation.annotations.length;
        if (annotation.term.interesting_parents) {
          for (let interestingAncestor of annotation.term.interesting_parents) {
            if (interestingAncestor === termId) {
              retTable.push(annotation);
              filteredAnnotationCount += annotation.annotations.length;
              break TERMS;
            }
          }
        }
      }
    }

    return [retTable, annotationCount, filteredAnnotationCount];
  }
}
