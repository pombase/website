import { Component, Input, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, getAppConfig } from '../config';
import { ReferenceDetails, APIError, PombaseAPIService, GeneShort } from '../pombase-api.service';

@Component({
  selector: 'app-ref-genes-view',
  templateUrl: './ref-genes-view.component.html',
  styleUrls: ['./ref-genes-view.component.css']
})
export class RefGenesViewComponent implements OnInit {
  @Input() refDetails: ReferenceDetails;

  queryBuilderRouterLink: string;

  isPubMedRef = false;
  apiError?: APIError;
  appConfig: AppConfig = getAppConfig();
  siteName = this.appConfig.site_name;
  genes: Array<GeneShort>;

  constructor(private pombaseApiService: PombaseAPIService,
              private route: ActivatedRoute,
              private titleService: Title,
              private meta: Meta) {

  }

  setPageTitle(): void {
    let title = this.appConfig.site_name + ' - Reference - ';
    if (this.refDetails) {
      title += this.refDetails.uniquename;
      if (this.refDetails.title) {
        title += ' - ' + this.refDetails.title;
      }
    } else {
      title = 'UNKNOWN';
    }
    this.titleService.setTitle(title);
    this.meta.updateTag({property: 'og:title', content: title});
    this.meta.updateTag({property: 'description', content: title});
  }

  ngOnInit() {
    this.route.params.forEach((params: Params) => {
      if (params['uniquename'] !== undefined) {
        this.genes = [];
        let uniquename = params['uniquename'] as string;
        this.pombaseApiService.getReference(uniquename)
          .then(refDetails => {
            this.apiError = undefined;
            this.refDetails = refDetails;
            let re = /(PMID):(\d+)/i;
            let matches = refDetails.uniquename.match(re);
            if (matches) {
              this.isPubMedRef = true;
            } else {
              this.isPubMedRef = false;
            }
            this.setPageTitle();

            let description = refDetails.title;

            let descriptionPrefix = '';

            if (refDetails.authors_abbrev) {
              descriptionPrefix = refDetails.authors_abbrev;
            }

            if (refDetails.publication_year) {
              if (descriptionPrefix !== '') {
                descriptionPrefix += ' ';
              }
              descriptionPrefix += '(' + refDetails.publication_year + ')';
            }

            if (descriptionPrefix !== '') {
              description = descriptionPrefix + ' "' + description + '"';
            }

            this.queryBuilderRouterLink = '/query/save/from/reference/' +
              refDetails.uniquename + '/' + encodeURIComponent(description);

            this.genes = Object.values(refDetails.genes_by_uniquename)
              .filter(g => !g.flags || !g.flags.includes('not_load_organism'));
          })
          .catch(error => {
            this.apiError = error;
          });
      };
    });
  }
}
