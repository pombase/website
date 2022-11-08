import { AnnotationTable, GeneticInteractionTable, InteractionTable } from './pombase-api.service';

export interface Filter<T> {
  filter(table: T): [T, number, number];
}

export type AnnotationFilter = Filter<AnnotationTable>;
export type InteractionFilter = Filter<InteractionTable>;
export type GeneticInteractionFilter = Filter<GeneticInteractionTable>;

export class FilterCombiner<T> implements Filter<T> {
  constructor(private filters: Array<Filter<T>>) { }

  filter(annotationTable: T): [T, number, number] {
    let filterResult: [T, number, number] =
      this.filters[0].filter(annotationTable);

    let totalAnnotationCount = filterResult[1];

    for (let filter of this.filters.slice(1)) {
      filterResult = filter.filter(filterResult[0]);
    }

    let [filteredTable, , filteredAnnotationCount] = filterResult;

    return [filteredTable, totalAnnotationCount, filteredAnnotationCount];
  }
}
