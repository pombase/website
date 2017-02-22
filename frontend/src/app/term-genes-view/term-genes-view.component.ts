import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { TermDetails, Annotation, PombaseAPIService } from '../pombase-api.service';

@Component({
  selector: 'app-term-genes-view',
  templateUrl: './term-genes-view.component.html',
  styleUrls: ['./term-genes-view.component.css']
})
export class TermGenesViewComponent implements OnInit {
  @Input() termDetails: TermDetails;

  constructor(private pombaseApiService: PombaseAPIService,
              private route: ActivatedRoute,
              private titleService: Title
             ) { }

  setPageTitle(): void {
    let title = this.titleService.getTitle();
    let displayName;
    if (this.termDetails) {
      displayName = this.termDetails.termid + " - " + this.termDetails.name;
    } else {
      displayName = "UNKNOWN";
    }
    this.titleService.setTitle(title + " - " + displayName);
  }

  ngOnInit() {
    this.route.params.forEach((params: Params) => {
      if (params['termid'] !== undefined) {
        let termid = params['termid'];
        this.pombaseApiService.getTerm(termid)
              .then(termDetails => {
                this.termDetails = termDetails;
                this.setPageTitle();
              });
      };
    });
  }
}
