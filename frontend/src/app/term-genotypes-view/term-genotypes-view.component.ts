import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';

import { TermDetails, PombaseAPIService } from '../pombase-api.service';
import { AppConfig, getAppConfig } from '../config';

@Component({
  selector: 'app-term-genotypes-view',
  templateUrl: './term-genotypes-view.component.html',
  styleUrls: ['./term-genotypes-view.component.css']
})
export class TermGenotypesViewComponent implements OnInit {
  @Input() termDetails: TermDetails;

  appConfig: AppConfig = getAppConfig();

  constructor(private pombaseApiService: PombaseAPIService,
              private route: ActivatedRoute,
              private titleService: Title,
              private meta: Meta) { }

  setPageTitle(): void {
    let title = this.appConfig.site_name;
    let displayName;
    if (this.termDetails) {
      displayName = 'Single-allele genotypes annotated with ' +
        this.termDetails.termid + ' - ' + this.termDetails.name;
    } else {
      displayName = 'UNKNOWN';
    }
    this.titleService.setTitle(title + ' - ' + displayName);
    this.meta.updateTag({property: 'og:title', content: title});
    this.meta.updateTag({property: 'description', content: title});
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
