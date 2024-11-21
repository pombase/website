import { Component, OnInit, Input } from '@angular/core';

import { PombaseAPIService, TermSubsetDetails, GeneSubsetDetails, APIError, TermSubsets } from '../../pombase-api.service';
import { getAppConfig, SlimConfig, getAnnotationTableConfig, AnnotationType } from '../../config';

class SlimSubsetElement {
  constructor(public termid: string,
              public name: string,
              public gene_count: number,
              public single_multi_gene_count: number) { }
}

type SortableColumnNames = 'name' | 'gene_count';

@Component({
    selector: 'app-slim-table',
    templateUrl: './slim-table.component.html',
    styleUrls: ['./slim-table.component.css'],
    standalone: false
})
export class SlimTableComponent implements OnInit {
  @Input() slimName: string;

  appConfig = getAppConfig();

  slimSubset: TermSubsetDetails;
  slimSubsetElements: Array<SlimSubsetElement> = [];
  nonSlimWithAnnotation: GeneSubsetDetails;
  nonSlimWithoutAnnotation: GeneSubsetDetails;
  apiError: APIError;

  slimConfig: SlimConfig;
  nonSlimWithAnnotationName: string;
  nonSlimWithoutAnnotationName: string;

  sortColumnName: SortableColumnNames = 'name';

  cvConfig: AnnotationType;
  subsets: TermSubsets;
  constructor(private pombaseApiService: PombaseAPIService) { }

  setSortColumn(col: SortableColumnNames): void {
    this.sortColumnName = col;
    this.sortRows();
  }

  sortRows() {
    if (this.sortColumnName == 'name') {
      this.slimSubsetElements.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      this.slimSubsetElements.sort((a, b) => b.gene_count - a.gene_count);
    }
  }

  ngOnInit() {
    this.slimConfig = this.appConfig.slims[this.slimName];
    this.cvConfig = getAnnotationTableConfig().getAnnotationType(this.slimConfig.cv_name);

    this.pombaseApiService.getTermSubsets()
      .then(subsets => {
        this.subsets = subsets;
        this.slimSubset = Object.assign({}, this.subsets[this.slimName]);
        this.slimSubsetElements = [];
        for (const termid of Object.keys(this.slimSubset.elements)) {
          const element = this.slimSubset.elements[termid];
          const slimSubsetElement =
            new SlimSubsetElement(termid, element.name, element.gene_count, element.single_locus_gene_count);
          this.slimSubsetElements.push(slimSubsetElement);
        }
        this.sortRows();
      })
      .catch(error => {
        this.apiError = error;
      });
    this.pombaseApiService.getGeneSubsets()
      .then(subsets => {
        this.nonSlimWithAnnotationName = `non_slim_with_${this.slimConfig.cv_name}_annotation`;
        this.nonSlimWithAnnotation = subsets[this.nonSlimWithAnnotationName];
        this.nonSlimWithoutAnnotationName = `non_slim_without_${this.slimConfig.cv_name}_annotation`;
        this.nonSlimWithoutAnnotation = subsets[this.nonSlimWithoutAnnotationName];
      })
      .catch(error => {
        this.apiError = error;
      });
  }
}
