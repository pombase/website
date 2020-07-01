import { Component, OnInit, Input } from '@angular/core';

import { PombaseAPIService, TermSubsetDetails, GeneSubsetDetails, APIError } from '../../pombase-api.service';
import { getAppConfig, SlimConfig, getAnnotationTableConfig } from '../../config';

class SlimSubsetElement {
  constructor(public termid: string,
              public name: string,
              public gene_count: number) { }
}

@Component({
  selector: 'app-slim-table',
  templateUrl: './slim-table.component.html',
  styleUrls: ['./slim-table.component.css']
})
export class SlimTableComponent implements OnInit {
  @Input() slimName: string;

  appConfig = getAppConfig();

  slimSubset: TermSubsetDetails = null;
  slimSubsetElements: Array<SlimSubsetElement> = [];
  nonSlimWithAnnotation: GeneSubsetDetails = null;
  nonSlimWithoutAnnotation: GeneSubsetDetails = null;
  apiError: APIError = null;

  slimConfig: SlimConfig = null;
  nonSlimWithAnnotationName: string = null;
  nonSlimWithoutAnnotationName: string = null;
  cvDisplayName: string = null;

  constructor(private pombaseApiService: PombaseAPIService) { }

  ngOnInit() {
    this.slimConfig = this.appConfig.slims[this.slimName];
    this.cvDisplayName = getAnnotationTableConfig().getAnnotationType(this.slimConfig.cv_name).display_name;

    this.pombaseApiService.getTermSubsets()
      .then(subsets => {
        this.slimSubset = Object.assign({}, subsets[this.slimName]);
        this.slimSubsetElements = [];
        for (const termid of Object.keys(this.slimSubset.elements)) {
          const element = this.slimSubset.elements[termid];
          const slimSubsetElement = new SlimSubsetElement(termid, element.name, element.gene_count);
          this.slimSubsetElements.push(slimSubsetElement);
        }
        this.slimSubsetElements.sort((a, b) => a.name.localeCompare(b.name));
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
