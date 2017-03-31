import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { getAnnotationTableConfig, AnnotationTableConfig } from '../config';

import { ReferenceDetails, PombaseAPIService } from '../pombase-api.service';

@Component({
  selector: 'app-reference-details',
  templateUrl: './reference-details.component.html',
  styleUrls: ['./reference-details.component.css']
})
export class ReferenceDetailsComponent implements OnInit {
  @Input() refDetails: ReferenceDetails;

  annotationTypeNames: Array<string>;
  config: AnnotationTableConfig = getAnnotationTableConfig();
  isPubMedRef = false;
  pubMedId = null;

  constructor(private pombaseApiService: PombaseAPIService,
              private route: ActivatedRoute,
              private titleService: Title
             ) { }

  setPageTitle(): void {
    let title = this.titleService.getTitle();
    let displayName;
    if (this.refDetails) {
      displayName =
        this.refDetails.uniquename;
      if (this.refDetails.title) {
        displayName += ' - ' + this.refDetails.title;
      }
    } else {
      displayName = 'UNKNOWN';
    }
    this.titleService.setTitle(title + ' - ' + displayName);
  }

  ngOnInit() {
    this.route.params.forEach((params: Params) => {
      if (params['uniquename'] !== undefined) {
        let uniquename = params['uniquename'];
        this.pombaseApiService.getReference(uniquename)
          .then(refDetails => {
            this.refDetails = refDetails;
            this.annotationTypeNames = this.config.annotationTypeOrder;
            let re = /(PMID):(\d+)/i;
            let matches = refDetails.uniquename.match(re);
            if (matches) {
              this.isPubMedRef = true;
              this.pubMedId = matches[2];
            }
            this.setPageTitle();
          });
      };
    });
  }
}
