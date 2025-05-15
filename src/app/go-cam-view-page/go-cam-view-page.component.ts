import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Params, Router } from '@angular/router';
import { DomSanitizer, Meta, SafeResourceUrl, Title } from '@angular/platform-browser';
import { AppConfig, getAppConfig } from '../config';
import { PombaseAPIService, GoCamDetails, GeneSummaryMap, GeneSummary, GeneShort } from '../pombase-api.service';
import { TextOrTermId, Util } from '../shared/util';
import { DeployConfigService } from '../deploy-config.service';

@Component({
    selector: 'app-go-cam-view-page',
    templateUrl: './go-cam-view-page.component.html',
    styleUrls: ['./go-cam-view-page.component.css'],
    standalone: false
})
export class GoCamViewPageComponent implements OnInit {
  appConfig: AppConfig = getAppConfig();

  sanitizedURL?: SafeResourceUrl;

  gocamIdParam?: string;
  gocamIds: Array<string> = [];
  gocamDetailsList: Array<GoCamDetails> = [];
  overlappingGene?: GeneShort;
  contributorNames?: string;
  sourcePageType = 'gene';
  source?: string;
  sourceName?: string;
  modelGenes: Array<GeneSummary> = [];
  geneSummaryMap?: GeneSummaryMap;
  titleParts: Array<Array<TextOrTermId>> = [];
  isPomBaseView = false;
  includeChemicals = false;
  alternateViewRoute?: string;
  noctuaLink?: string;

  constructor(private titleService: Title,
              private sanitizer: DomSanitizer,
              private readonly meta: Meta,
              private deployConfig: DeployConfigService,
              private route: ActivatedRoute,
              private router: Router,
              private pombaseApi: PombaseAPIService) { }

  getIFrameURL(): SafeResourceUrl | undefined {
    return this.sanitizedURL;
  }

  devMode(): boolean {
    return this.deployConfig.devMode();
  }

  getTitleOrId(): string|undefined {
    if (this.gocamIdParam) {
      if (this.gocamDetailsList.length > 0) {
        return this.gocamDetailsList.map((details) => details.title).join(', ');
      } else {
        return this.gocamIdParam;
      }
    } else {
      return undefined;
    }
  }

  setContributors() {
    this.contributorNames = undefined;
    if (this.gocamDetailsList.length > 0) {
      let contributorNamesList: Array<String> = [];
      for (const details of this.gocamDetailsList) {
        for (const contributor of details.contributors) {
          if (!contributorNamesList.includes(contributor.name)) {
            contributorNamesList.push(contributor.name);
          }
        }
      }
      this.contributorNames = contributorNamesList.join(', ');
    }
  }

  setPageTitle(): void {
    let title;
    if (this.gocamIdParam) {
      title = this.appConfig.site_name + ' - GO-CAM Model - ' + this.getTitleOrId();
    } else {
      title = this.appConfig.site_name + ' - GO-CAM Model';
    }
    this.titleService.setTitle(title);
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'description', content: title });
  }

  setTitleParts(): void {
    this.titleParts = [];
    for (const detail of this.gocamDetailsList) {
      const splitDesc = Util.splitDescription(detail.title, detail.title_terms ?? []);
      this.titleParts.push(splitDesc);
    }
  }

  isMergedModel(): boolean {
    if (this.gocamIdParam &&
        this.gocamIdParam.toUpperCase() == this.gocamIdParam) {
      // ALL_MERGED or ALL_CONNECTED
      return true;
    }

    if (!this.gocamIds) {
      return false;
    }
    return this.gocamIds.length > 1;
  }

  updateUrl(): void {
    let rawUrl;

    const currentUrl = decodeURIComponent(this.router.url);

    if (this.isPomBaseView) {
      let idForUrl = this.gocamIdParam;
      if (this.includeChemicals) {
        idForUrl += ':include_chemicals';
      } else {
        idForUrl += ':no_chemicals';
      }

      if (this.source) {
        rawUrl = 'gocam_view/full/' + idForUrl + '/' + this.source;
      } else {
        rawUrl = 'gocam_view/full/' + idForUrl;
      }

      this.alternateViewRoute = currentUrl.replace('/pombase_gocam_view/', '/gocam/');
    } else {
      rawUrl = 'gocam_viz/full/' + this.gocamIdParam;

      this.alternateViewRoute = currentUrl.replace('/gocam/', '/pombase_gocam_view/');
    }

    this.sanitizedURL = this.sanitizer.bypassSecurityTrustResourceUrl(rawUrl);
  }

  ngOnInit(): void {
    this.route.params.forEach((params: Params) => {
      this.gocamIds = [];
      this.gocamDetailsList = [];
      this.overlappingGene = undefined;
      this.gocamIdParam = params['gocam_id'];
      this.modelGenes = [];

      this.sourcePageType = params['source_page_type'];
      this.source = params['source'];
      this.sourceName = params['source_name'];

      const path = this.route.snapshot.url[0].path;

      this.isPomBaseView = path.includes('pombase_gocam_view');
      this.alternateViewRoute = undefined;
      this.noctuaLink = undefined;

      if (this.gocamIdParam !== undefined) {
        const summPromise = this.pombaseApi.getGeneSummaryMapPromise();

        if (this.gocamIdParam.endsWith(":include_chemicals")) {
          this.includeChemicals = true;
        } else {
          this.includeChemicals = false;
        }

        this.gocamIds = this.gocamIdParam.split("+");

        const gocamDetailPromise = this.pombaseApi.getGoCamDetailByIds(this.gocamIds.join(","));
        gocamDetailPromise.then((details) => {
            this.gocamDetailsList = details;
            this.setPageTitle();
          });

        Promise.all([summPromise, gocamDetailPromise])
           .then(([geneSummMap, gocamDetailsList]) => {
            const seenGenes = new Set();
            for (const detail of gocamDetailsList) {
              for (const geneUniquename of detail.genes) {
                if (seenGenes.has(geneUniquename)) {
                  continue;
                }
                seenGenes.add(geneUniquename);
                const geneSumm = geneSummMap[geneUniquename];
                this.modelGenes.push(geneSumm);
              }
            }

            this.setContributors();

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

              if (gocamDetailsList.length > 1 && this.source && this.sourceName) {
                this.overlappingGene = { uniquename: this.source, name: this.sourceName } as GeneShort;
              }
           });

        this.updateUrl();

        if (!this.isMergedModel()) {
          this.noctuaLink = 'http://noctua.geneontology.org/workbench/noctua-visual-pathway-editor/?model_id=gomodel%3A' +
            this.gocamIds[0];
        }

        this.setPageTitle();
      }
    });
  }
}
