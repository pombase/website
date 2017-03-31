import { Pipe, PipeTransform } from '@angular/core';

import { AnnotationTable } from './pombase-api.service';
import { AnnotationFilter } from './filtering/annotation-filter';

@Pipe({
  name: 'annotationTableFilter',
  pure: false
})
export class AnnotationTableFilterPipe implements PipeTransform {
  transform(annotationTable: AnnotationTable, filter?: AnnotationFilter): AnnotationTable {
    if (filter) {
      return filter.filter(annotationTable);
    }
    return annotationTable;
  }
}
