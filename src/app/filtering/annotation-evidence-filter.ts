import { AnnotationTable } from '../pombase-api.service';
import { Filter } from '../filtering';

export class AnnotationEvidenceFilter implements Filter<AnnotationTable> {
  evidenceCodes: Array<string> = [];

  constructor(private evidenceCodesArg: Array<string>) {
    for (let code of this.evidenceCodesArg) {
      let lcCode = code.toLowerCase();
      this.evidenceCodes.push(lcCode);
      this.evidenceCodes.push(lcCode + ' evidence');
    }
  }

  filter(annotationTable: AnnotationTable): [AnnotationTable, number, number] {
    let retTable = [] as AnnotationTable;
    let annotationCount = 0;
    let filteredAnnotationCount = 0;

    for (let termAnnotation of annotationTable) {
      annotationCount += termAnnotation.annotations.length;
      let retAnnotation = Object.assign({}, termAnnotation);
      retAnnotation.annotations = [];

      for (let annotation of termAnnotation.annotations) {
        if (annotation.evidence &&
            this.evidenceCodes.indexOf(annotation.evidence.toLowerCase()) !== -1) {
          retAnnotation.annotations.push(annotation);
        }
      }

      if (retAnnotation.annotations.length > 0) {
        retTable.push(retAnnotation);
        filteredAnnotationCount += retAnnotation.annotations.length;
      }
    }

    return [retTable, annotationCount, filteredAnnotationCount];
  }
}
