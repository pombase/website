import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { TermDetails, Annotation, PombaseAPIService } from '../pombase-api.service';

@Component({
  selector: 'app-term-details',
  templateUrl: './term-details.component.html',
  styleUrls: ['./term-details.component.css']
})
export class TermDetailsComponent implements OnInit {
  @Input() termDetails: TermDetails;

  annotations: Array<Annotation> = [];

  constructor(private pombaseApiService: PombaseAPIService,
              private route: ActivatedRoute) { }

  collectAnnotations(annotationsMap: any) {
    this.annotations = [];
    for (let depthRel of Object.keys(annotationsMap)) {
      let thisDepthAnnotations = annotationsMap[depthRel];
      if (depthRel == "direct") {
        this.annotations = this.annotations.concat(thisDepthAnnotations);
      } else {
        let [relName, depth] = depthRel.split("::");
        let annotationsWithDepthRel =
        thisDepthAnnotations
          .map((annotation) =>
               Object.assign({
                 descRelName: relName,
                 descDepth: depth,
               }, annotation));
        this.annotations = this.annotations.concat(annotationsWithDepthRel);
      }
    }
  }

  ngOnInit() {
    this.route.params.forEach((params: Params) => {
      if (params['termid'] !== undefined) {
        let termid = params['termid'];
        this.pombaseApiService.getTerm(termid)
              .then(termDetails => {
                this.termDetails = termDetails;
                this.collectAnnotations(termDetails.annotations);
              });
      };
    });
  }
}
