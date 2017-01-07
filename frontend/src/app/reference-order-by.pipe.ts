import { Pipe, PipeTransform } from '@angular/core';
import { ReferenceShort } from './pombase-api.service';

@Pipe({
  name: 'referenceOrderBy'
})
export class ReferenceOrderByPipe implements PipeTransform {
  transform(references: Array<ReferenceShort>, field: string): any {
    let sortDirection = '+';
    let matches = field.match(/^(\+|-)(.*)/);
    if (matches) {
      sortDirection = matches[1];
      field = matches[2];
    }
    references.sort((a: any, b: any) => {
      if (sortDirection != '+') {
        [b, a] = [a, b];
      }
      if (a[field] < b[field]) {
        return -1;
      } else {
        if (a[field] > b[field]) {
          return 1;
        } else {
          return 0;
        }
      }
    });
    return references;
  }
}
