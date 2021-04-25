import { AnnotationTable } from '../pombase-api.service';
import { Filter } from '../filtering';
import { Ploidiness } from '../pombase-query';

export class AnnotationPloidinessFilter implements Filter<AnnotationTable> {
  evidenceCodes: Array<string> = [];

  constructor(private filterPloidiness: Ploidiness) {
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
        if (this.filterPloidiness === 'any') {
          retAnnotation.annotations.push(annotation);
        } else {
          let annotationPloidiness: Ploidiness = 'haploid';

          for (const locus of annotation.genotype.loci) {
            if (locus.expressed_alleles.length > 1) {
              annotationPloidiness = 'diploid';
              break;
            }
          }

          if (annotationPloidiness === this.filterPloidiness) {
            retAnnotation.annotations.push(annotation);
          }
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
