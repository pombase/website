import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Params } from '@angular/router';
import { DomSanitizer, Meta, SafeResourceUrl, Title } from '@angular/platform-browser';
import { AppConfig, getAppConfig } from '../config';
import { PombaseAPIService, GoCamDetails } from '../pombase-api.service';

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
  sourceId?: string;
  sourceName?: string;

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

  ngOnInit(): void {
    this.route.params.forEach((params: Params) => {
      if (params['gocam_id'] !== undefined) {
        this.gocamId = params['gocam_id'];

        this.pombaseApi.getGoCamDetailById(this.gocamId!)
          .then((details) => {
            this.gocamDetails = details;
            this.setPageTitle();
          });

        this.sourcePageType = params['source_page_type'];
        this.sourceId = params['source_uniquename'];
        this.sourceName = params['source_name'];
        const rawUrl = 'gocam_viz/full/' + this.gocamId;
        this.sanitizedURL = this.sanitizer.bypassSecurityTrustResourceUrl(rawUrl);
        this.setPageTitle();
      }
    });
  }
}
