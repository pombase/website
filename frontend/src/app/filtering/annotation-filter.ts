import { AnnotationTable } from '../pombase-api.service';
import { TermSummary } from '../pombase-api.service';

export interface AnnotationFilter {
  filter(annotationTable: AnnotationTable|Array<TermSummary>): AnnotationTable|Array<TermSummary>;
}
