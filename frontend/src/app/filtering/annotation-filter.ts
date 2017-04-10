import { AnnotationTable } from '../pombase-api.service';

export interface AnnotationFilter {
  filter(annotationTable: AnnotationTable): AnnotationTable;
}
