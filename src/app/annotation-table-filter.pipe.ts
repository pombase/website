import { Pipe, PipeTransform } from '@angular/core';

import { AnnotationTable } from './pombase-api.service';
import { Filter } from './filtering';

@Pipe({
  name: 'annotationTableFilter',
  pure: false
})
export class AnnotationTableFilterPipe implements PipeTransform {
  transform(annotationTable: AnnotationTable, filter?: Filter<AnnotationTable>): any {
    if (filter) {
      return filter.filter(annotationTable);
    }
    return annotationTable;
  }
}
