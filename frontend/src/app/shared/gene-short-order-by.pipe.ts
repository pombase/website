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
      if (field === 'systematicId' || field === '+systematicId') {
        genes.sort((gene1, gene2) => {
          return gene1.uniquename.localeCompare(gene2.uniquename);
        })
      } else {
        genes.sort(Util.geneProductCompare);
      }
    }

    return genes;
  }
}
