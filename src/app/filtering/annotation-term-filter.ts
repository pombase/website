import { AnnotationTable } from '../pombase-api.service';
import { Filter } from '../filtering';

export class AnnotationTermFilter implements Filter<AnnotationTable> {
  constructor(private termIds: Array<string>) { }

  filter(annotationTable: AnnotationTable): [AnnotationTable, number, number] {
    let retTable = [] as AnnotationTable;
    let annotationCount = 0;
    let filteredAnnotationCount = 0;

    for (let annotation of annotationTable) {
      TERMS: for (let termId of this.termIds) {
        annotationCount += annotation.annotations.length;
        if (annotation.term.interesting_parent_ids) {
          for (let interestingAncestor of annotation.term.interesting_parent_ids) {
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
