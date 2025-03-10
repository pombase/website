import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Params } from '@angular/router';
import { DomSanitizer, Meta, SafeResourceUrl, Title } from '@angular/platform-browser';
import { AppConfig, getAppConfig } from '../config';
import { PombaseAPIService, GoCamDetails, GeneSummaryMap, GeneSummary } from '../pombase-api.service';
import { TextOrTermId, Util } from '../shared/util';

@Component({
    selector: 'app-go-cam-view-page',
    templateUrl: './go-cam-view-page.component.html',
    styleUrls: ['./go-cam-view-page.component.css'],
    standalone: false
})
export class GoCamViewPageComponent implements OnInit {
  appConfig: AppConfig = getAppConfig();

  sanitizedURL?: SafeResourceUrl;

  gocamId?: string;
  gocamDetails?: GoCamDetails;
  sourcePageType = 'gene';
  source?: string;
  sourceName?: string;
  modelGenes: Array<GeneSummary> = [];
  geneSummaryMap?: GeneSummaryMap;
  titleParts: Array<TextOrTermId> = [];

  constructor(private titleService: Title,
              private sanitizer: DomSanitizer,
              private readonly meta: Meta,
              private route: ActivatedRoute,
              private pombaseApi: PombaseAPIService) { }

  getIFrameURL(): SafeResourceUrl | undefined {
    return this.sanitizedURL;
  }

  getTitleOrId(): string|undefined {
    if (this.gocamId) {
      if (this.gocamDetails) {
        return this.gocamDetails.title || this.gocamId;
      } else {
        return this.gocamId;
      }
    } else {
      return undefined;
    }
  }

  contributors(): string {
    if (this.gocamDetails) {
      return this.gocamDetails.contributors
        .map(contributor => contributor.name)
        .join(', ');
    } else {
      return '';
    }
  }

  setPageTitle(): void {
    let title;
    if (this.gocamId) {
      title = this.appConfig.site_name + ' - GO-CAM Model - ' + this.getTitleOrId();
    } else {
      title = this.appConfig.site_name + ' - GO-CAM Model';
    }
    this.titleService.setTitle(title);
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'description', content: title });
  }

  setTitleParts(): void {
    if (this.gocamDetails && this.gocamDetails.title) {
      this.titleParts = Util.splitDescription(this.gocamDetails.title, this.gocamDetails.title_terms ?? []);
    } else {
      this.titleParts = [];
    }
  }

  ngOnInit(): void {
    this.route.params.forEach((params: Params) => {
      if (params['gocam_id'] !== undefined) {
        this.gocamId = params['gocam_id'];

        const summPromise = this.pombaseApi.getGeneSummaryMapPromise();

        const gocamDetailPromise = this.pombaseApi.getGoCamDetailById(this.gocamId!);
        gocamDetailPromise.then((details) => {
            this.gocamDetails = details;
            this.setPageTitle();
          });

        Promise.all([summPromise, gocamDetailPromise])
           .then(([geneSummMap, gocamDetails]) => {
              for (const geneUniquename of gocamDetails.genes) {
                 const geneSumm = geneSummMap[geneUniquename];
                 this.modelGenes.push(geneSumm);
              }
              this.modelGenes.sort((a, b) => {
                if (!a.name && !b.name) {
                  return a.uniquename.localeCompare(b.uniquename);
                }
                if (a.name && !b.name) {
                  return -1;
                }
                if (!a.name && b.name) {
                  return 1;
                }
                return a.name!.localeCompare(b.name!);
              })
              this.setTitleParts();
           })

        this.sourcePageType = params['source_page_type'];
        this.source = params['source'];
        this.sourceName = params['source_name'];

        const path = this.route.snapshot.url[0].path;

        let rawUrl;

        if (path.includes('pombase_gocam_view')) {
          if (this.source) {
            rawUrl = 'gocam_view/full/' + this.gocamId + '/' + this.source;
          } else {
            rawUrl = 'gocam_view/full/' + this.gocamId;
          }
        } else {
          rawUrl = 'gocam_viz/full/' + this.gocamId;
        }

        this.sanitizedURL = this.sanitizer.bypassSecurityTrustResourceUrl(rawUrl);
        this.setPageTitle();
      }
    });
  }
}
