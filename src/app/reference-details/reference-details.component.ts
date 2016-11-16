import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { getGenePageConfig, GenePageConfig } from '../config';

import { ReferenceDetails, PombaseAPIService } from '../pombase-api.service';

@Component({
  selector: 'app-reference-details',
  templateUrl: './reference-details.component.html',
  styleUrls: ['./reference-details.component.css']
})
export class ReferenceDetailsComponent implements OnInit {
  @Input() refDetails: ReferenceDetails;

  annotationTypeNames: Array<string>;
  interactionAnnotationTypeNames: Array<string>;
  config: GenePageConfig = getGenePageConfig();

  constructor(private pombaseApiService: PombaseAPIService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.forEach((params: Params) => {
      if (params['uniquename'] !== undefined) {
        let uniquename = params['uniquename'];
        let annotationCmp = (a, b) => {
          let aDisplayName =
            this.config.annotationTypes[a] ? this.config.annotationTypes[a].displayName : a;
          let bDisplayName =
            this.config.annotationTypes[b] ? this.config.annotationTypes[b].displayName : b;
          if (aDisplayName < bDisplayName) {
            return -1;
          }
          if (aDisplayName > bDisplayName) {
            return 1;
          }
          return 0;
        };
        this.pombaseApiService.getReference(uniquename)
          .then(refDetails => {
            this.refDetails = refDetails;
            this.annotationTypeNames = Object.keys(refDetails.annotations);
            this.annotationTypeNames.sort(annotationCmp);
            this.interactionAnnotationTypeNames = Object.keys(refDetails.interaction_annotations);
          });
      };
    });
  }
}
