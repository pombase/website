import { Pipe, PipeTransform } from '@angular/core';
import { GeneShort } from './pombase-api.service';

@Pipe({
  name: 'geneShortOrderBy'
})
export class GeneShortOrderByPipe implements PipeTransform {
  transform(genes: Array<GeneShort>, args?: any): any {
    genes.sort(function (a, b) {
      if (a.name && b.name) {
        if (a.name < b.name) {
          return -1;
        }
        if (a.name > b.name) {
          return 1;
        }
        return 0;
      } else {
        if (a.name) {
          return -1;
        } else {
          if (b.name) {
            return 1;
          } else {
            if (a.uniquename < b.uniquename) {
              return -1;
            }
            if (a.uniquename > b.uniquename) {
              return 1;
            }
            return 0;
          }
        }
      }
    });

    return genes
  }
}
