import { Pipe, PipeTransform } from '@angular/core';
import { GeneShort } from './pombase-api.service';

@Pipe({
  name: 'geneShortOrderBy'
})
export class GeneShortOrderByPipe implements PipeTransform {
  compareGene(a: GeneShort, b: GeneShort) {
    if (a.name && b.name) {
      return a.name.localeCompare(b.name);
    } else {
      if (a.name) {
        return -1;
      } else {
        if (b.name) {
          return 1;
        } else {
          return a.uniquename.localeCompare(b.uniquename);
        }
      }
    }
  }

  compareProduct(a: GeneShort, b: GeneShort) {
    if (a.product) {
      if (b.product) {
        return a.product.localeCompare(b.product);
      } else {
        return -1;
      }
    } else {
      if (b.product) {
        return 1;
      } else {
        return this.compareGene(a, b);
      }
    }
  }

  transform(genes: Array<GeneShort>, field: string): any {
    if (field == 'gene' || field == '+gene') {
      genes.sort(this.compareGene);
    } else {
      genes.sort(this.compareProduct);
    }

    return genes;
  }
}
