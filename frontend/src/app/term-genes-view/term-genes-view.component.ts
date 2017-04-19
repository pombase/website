import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Util } from '../util';

import { TermDetails, PombaseAPIService, GeneShort } from '../pombase-api.service';
import { getAnnotationTableConfig } from '../config';

@Component({
  selector: 'app-term-genes-view',
  templateUrl: './term-genes-view.component.html',
  styleUrls: ['./term-genes-view.component.css']
})
export class TermGenesViewComponent implements OnInit {
  @Input() termDetails: TermDetails;

  genes = [];
  showAllAnnotationsLink = true;

  constructor(private pombaseApiService: PombaseAPIService,
              private route: ActivatedRoute,
              private titleService: Title
             ) { }

  setPageTitle(): void {
    let title = this.titleService.getTitle();
    let displayName;
    if (this.termDetails) {
      displayName = this.termDetails.termid + ' - ' + this.termDetails.name;
    } else {
      displayName = 'UNKNOWN';
    }
    this.titleService.setTitle(title + ' - ' + displayName);
  }

  collectGenes(): void {
    this.genes = [];
    let geneMap = {};

    for (let cvName of Object.keys(this.termDetails.cv_annotations)) {
      let termAnnotations = this.termDetails.cv_annotations[cvName];
      for (let termAnnotation of termAnnotations) {
        for (let annotation of termAnnotation.annotations) {
          for (let gene of annotation.genes) {
            geneMap[(gene as GeneShort).uniquename] = gene;
          }
        }
      }
    }

    for (let geneUniquename of Object.keys(geneMap)) {
      this.genes.push(geneMap[geneUniquename]);
    }

    this.genes.sort(Util.geneCompare);
  }

  ngOnInit() {
    this.route.params.forEach((params: Params) => {
      if (params['termid'] !== undefined) {
        let termid = params['termid'];
        this.pombaseApiService.getTerm(termid)
              .then(termDetails => {
                this.termDetails = termDetails;
                let typeConfig =
                  getAnnotationTableConfig().getAnnotationType(termDetails.cv_name);
                if (typeConfig && typeConfig.hide_term_details) {
                  this.showAllAnnotationsLink = false;
                }
                this.setPageTitle();
                this.collectGenes();
              });
      };
    });
  }
}
