import { AnnotationTable } from './pombase-api.service';
import { AnnotationFilter } from './filtering/annotation-filter';

export class AnnotationFilterCombiner implements AnnotationFilter {
  constructor(private filters: Array<AnnotationFilter>) { }

  filter(annotationTable: AnnotationTable): [AnnotationTable, number, number] {
    let filterResult: [AnnotationTable, number, number] =
      this.filters[0].filter(annotationTable);

    let totalAnnotationCount = filterResult[1];

    for (let filter of this.filters.slice(1)) {
      filterResult = filter.filter(filterResult[0]);
    }

    let [filteredTable, _, filteredAnnotationCount] = filterResult;

    return [filteredTable, totalAnnotationCount, filteredAnnotationCount];
  }
}
