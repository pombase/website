import { AnnotationTable, GenotypeShort } from '../pombase-api.service';
import { Filter } from '../filtering';
import { Ploidiness } from '../pombase-query';

export class AnnotationPloidinessFilter implements Filter<AnnotationTable> {
  evidenceCodes: Array<string> = [];

  constructor(private filterPloidiness: Ploidiness) {
  }

  private genotypePloidiness(genotype: GenotypeShort): Ploidiness {
    for (const locus of genotype.loci) {
      if (locus.expressed_alleles.length == 1) {
        return 'haploid';
      }
    }

    return 'diploid';
  }

  filter(annotationTable: AnnotationTable): [AnnotationTable, number, number] {
    let retTable = [] as AnnotationTable;
    let annotationCount = 0;
    let filteredAnnotationCount = 0;

    for (let termAnnotation of annotationTable) {
      annotationCount += termAnnotation.annotations.length;
      let retAnnotation = Object.assign({}, termAnnotation);

      if (this.filterPloidiness !== 'any') {
        const origSummary = retAnnotation.summary;
        retAnnotation.summary = [];
        origSummary.map(summaryRow => {
          let newRow = Object.assign({}, summaryRow);
          newRow.genotypes =
            summaryRow.genotypes.filter(g => {
              return this.genotypePloidiness(g) == this.filterPloidiness;
            });
          retAnnotation.summary.push(newRow);
        });
      }

      retAnnotation.annotations = [];

      for (let annotation of termAnnotation.annotations) {
        if (this.filterPloidiness === 'any') {
          retAnnotation.annotations.push(annotation);
        } else {
          let annotationPloidiness = this.genotypePloidiness(annotation.genotype);

          if (annotationPloidiness === this.filterPloidiness) {
            retAnnotation.annotations.push(annotation);
          }
        }
      }

      if (retAnnotation.annotations.length > 0) {
        retTable.push(retAnnotation);
        filteredAnnotationCount += retAnnotation.annotations.length;
      }
    }

    return [retTable, annotationCount, filteredAnnotationCount];
  }
}
