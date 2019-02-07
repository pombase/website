import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { GeneSubsetDetails, PombaseAPIService, APIError } from '../pombase-api.service';
import { AppConfig, getAppConfig } from '../config';

@Component({
  selector: 'app-gene-subset-view',
  templateUrl: './gene-subset-view.component.html',
  styleUrls: ['./gene-subset-view.component.css']
})
export class GeneSubsetViewComponent implements OnInit {
  subset: GeneSubsetDetails = null;
  subsetDisplayName: string = null;
  subsetGeneCount = 0;
  apiError: APIError = null;
  queryBuilderRouterLink: string = null;
  appConfig: AppConfig = getAppConfig();

  constructor(private pombaseApiService: PombaseAPIService,
              private route: ActivatedRoute,
              private titleService: Title,
             ) { }

  setPageTitle(): void {
    if (this.subset) {
      this.titleService.setTitle(this.appConfig.site_name + ' - ' + this.subset.name);
    } else {
      this.titleService.setTitle(this.appConfig.site_name);
    }
  }

  ngOnInit() {
    this.pombaseApiService.getGeneSubsets()
      .then(subsets => {
        this.route.params.forEach((params: Params) => {
          if (params['subsetName'] !== undefined) {
            let subsetName = params['subsetName'];
            this.subset = subsets[subsetName];
            if (this.subset) {
              this.subsetGeneCount = this.subset.elements.length;
              let matchResults = this.subset.display_name.match(/characterisation_status:(.*)/);
              if (matchResults) {
                this.subsetDisplayName =
                  'Genes with characterisation status "' + matchResults[1] + '"';
              } else {
                let interproMatchResults = this.subset.name.match(/interpro:(.*)/);
                if (interproMatchResults) {
                  this.subsetDisplayName = 'Genes matching ' + interproMatchResults[1];
                  if (interproMatchResults[1].indexOf(this.subset.display_name) === -1) {
                    this.subsetDisplayName += ' "' + this.subset.display_name + '"';
                  }
                }
              }

              const encodedDisplayName = encodeURIComponent(this.subsetDisplayName);
              this.queryBuilderRouterLink =
                `/query/save/from/subset/${subsetName}/${encodedDisplayName}`;
            } else {
              this.apiError = {
                status: 404,
                message: 'no such subset: ' + subsetName,
              };
            }
            this.setPageTitle();
          }
        });
      })
      .catch(error => {
        this.apiError = error;
      });
  }
}
