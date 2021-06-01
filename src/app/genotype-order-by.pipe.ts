import { Pipe, PipeTransform } from '@angular/core';
import { GenotypeShort } from './pombase-api.service';
import { Util } from './shared/util';

@Pipe({
  name: 'genotypeOrderBy'
})
export class GenotypeOrderByPipe implements PipeTransform {
  transform(genotypes: Array<GenotypeShort>, fieldName: string): any {
    genotypes.sort(function(g1, g2) {
      if (fieldName === 'gene') {
        return Util.geneCompare(g1.loci[0].expressed_alleles[0].allele.gene!,
                                g2.loci[0].expressed_alleles[0].allele.gene!);
      } else {
        if (fieldName === 'product') {
          return Util.safeCompare(g1.loci[0].expressed_alleles[0].allele.gene![fieldName],
                                  g2.loci[0].expressed_alleles[0].allele.gene![fieldName]);
        } else {
          return Util.genotypeCompare(g1, g2);
        }
      }
    });

    return genotypes;
  }
}
