import { AnnotationTable } from './pombase-api.service';
import { AnnotationFilter } from './filtering/annotation-filter';

export class AnnotationFilterCombiner implements AnnotationFilter {
  constructor(private filters: Array<AnnotationFilter>) { }

  filter(annotationTable: AnnotationTable): [AnnotationTable, number, number] {
    let retTable: any =
      this.filters[0].filter(annotationTable);

    for (let filter of this.filters.slice(1)) {
      retTable = filter.filter(retTable);
    }

    return retTable;
  }
}
