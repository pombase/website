import { AnnotationTable, ThroughputType } from '../pombase-api.service';
import { Filter } from '../filtering';

export class AnnotationThroughputFilter implements Filter<AnnotationTable> {
  constructor(private throughputType: ThroughputType) { }

  filter(annotationTable: AnnotationTable): [AnnotationTable, number, number] {
    let retTable = [] as AnnotationTable;
    let annotationCount = 0;
    let filteredAnnotationCount = 0;

    for (let termAnnotation of annotationTable) {
      annotationCount += termAnnotation.annotations.length;
      let retAnnotation = Object.assign({}, termAnnotation);
      retAnnotation.annotations = [];

      for (let annotation of termAnnotation.annotations) {
        if (annotation.throughput &&
            this.throughputType === annotation.throughput) {
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
