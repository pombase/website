import { AnnotationTable } from '../pombase-api.service';
import { AnnotationFilter } from './annotation-filter';

export class AnnotationEvidenceFilter implements AnnotationFilter {
  evidenceCodes = [];

  constructor(private evidenceCodesArg: Array<string>) {
    for (let code of this.evidenceCodesArg) {
      let lcCode = code.toLowerCase();
      this.evidenceCodes.push(lcCode);
      this.evidenceCodes.push(lcCode + ' evidence');
    }
  }

  filter(annotationTable: AnnotationTable): AnnotationTable {
    let retTable = [] as AnnotationTable;

    for (let termAnnotation of annotationTable) {
      let retAnnotation = Object.assign({}, termAnnotation);
      retAnnotation.annotations = [];

      for (let annotation of termAnnotation.annotations) { 
        if (annotation.evidence &&
            this.evidenceCodes.indexOf(annotation.evidence.toLowerCase()) != -1) {
          retAnnotation.annotations.push(annotation);
        }
      }

      if (retAnnotation.annotations.length > 0) {
        retTable.push(retAnnotation);
      }
    }

    return retTable;
  }
}
