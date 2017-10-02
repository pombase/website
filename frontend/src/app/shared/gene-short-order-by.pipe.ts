import { Pipe, PipeTransform } from '@angular/core';
import { GeneShort } from '../pombase-api.service';
import { Util } from './util';

@Pipe({
  name: 'geneShortOrderBy'
})
export class GeneShortOrderByPipe implements PipeTransform {
  transform(genes: Array<GeneShort>, field: string): any {
    if (field === 'gene' || field === '+gene') {
      genes.sort(Util.geneCompare);
    } else {
      genes.sort(Util.geneProductCompare);
    }

    return genes;
  }
}
