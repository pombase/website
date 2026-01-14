import { Component, OnInit, Inject, OnDestroy, Renderer2, AfterViewInit } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { Title } from '@angular/platform-browser';

import { Router, NavigationEnd } from '@angular/router';

import { getAppConfig, AppConfig } from '../../config';
import { DeployConfigService } from '../../deploy-config.service';
import { PombaseAPIService } from '../../pombase-api.service';
import { QueryService } from '../../query.service';
import { Subscription } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { QueryRouterService } from '../../query-router.service';

const urlRe = new RegExp('/([^/]+)(?:/([^/]+))?');

@Component({
    selector: 'app-docs',
    templateUrl: './docs.component.html',
    styleUrls: ['./docs.component.css'],
    standalone: false
})
export class DocsComponent implements OnInit, OnDestroy, AfterViewInit {
  section: string;
  pageName: string;
  itemId: string;
  subscription: Subscription;
  appConfig: AppConfig = getAppConfig();
  highlightDocSearchBox = false;

  queryCountCache: {[key: string]: Promise<number>} = {};

  constructor(public router: Router,
              private titleService: Title,
              public deployConfigService: DeployConfigService,
              private pombaseApi: PombaseAPIService,
              private queryService: QueryService,
              private queryRouterService: QueryRouterService,
              private readonly meta: Meta,
              @Inject('Window') private window: any,
              private renderer2: Renderer2,
              @Inject(DOCUMENT) private document: any
             ) {
    this.subscription = router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.setSectPage(event.url);
        this.addAltmetrics();
        setTimeout(() => {
          // need to wait until DOM is updated
          if (this.window.__dimensions_embed) {
            this.window.__dimensions_embed.addBadges();
          }
        }, 100);
      }
    });
  }

  setPageTitle(subTitle: string): void {
    let title = this.appConfig.site_name + ' - ' + subTitle;
    this.titleService.setTitle(title);
    this.meta.updateTag({property: 'og:title', content: title});
  }

  faq_navigate($event: MouseEvent, route: string, heading: string) {
    // nagivate on when header is clicked
    if (($event.target as HTMLHeadingElement).localName.match(/^h\d$/i)) {
      this.router.navigate([route]);
      this.setPageTitle('FAQ - ' + heading);
    }
  }

  checkForDoc(url: string): boolean {
    const appConfig = getAppConfig();
    const documentation = appConfig.documentation;
    const docPageAliases = appConfig.docPageAliases;

    if (url.startsWith('/news#')) {
      return true;
    }

    if (url.startsWith("/documentation/docsearch")) {
      return true;
    }

    if (url.startsWith('/')) {
      const path = url.substring(1);
      return !!documentation.pages[path] || !!docPageAliases[path];
    } else {
      // the url should always start with "/" - this is a fall back
      return true;
    }
  }

  gotoPredefinedResults(predefinedQueryId: string): void {
    this.queryRouterService.gotoPredefinedQueryResults(predefinedQueryId);
  }

  getMissingActivityCount(): Promise<number> {
    if (!this.queryCountCache['_getMissingActivityCount']) {
      this.queryCountCache['_getMissingActivityCount'] =
       this.pombaseApi.getGoCamHoles().then(holes => holes.length);
    }
    return this.queryCountCache['_getMissingActivityCount'];
  }

  getPredefinedQueryCount(predefinedQueryId: string): Promise<number> {
    if (!this.queryCountCache[predefinedQueryId]) {
      this.queryCountCache[predefinedQueryId] =
        this.queryService.postPredefinedQueryCount(predefinedQueryId)
        .then((results) => results.getRowCount());
    }

    return this.queryCountCache[predefinedQueryId];
  }

  setSectPage(url: string) {
    const realUrl = this.appConfig.docPageAliases[url];
    if (realUrl) {
      url = realUrl;
    }

    if (!this.checkForDoc(url)) {
      this.section = '404';
      this.pageName = '404';
      return;
    }

    const urlParts = url.split('#');
    url = urlParts[0];
    const urlMatch = urlRe.exec(url);
    if (urlMatch) {
      this.section = urlMatch[1];
      if (urlMatch[2]) {
        if (this.section === 'news') {
          this.pageName = 'index';
          this.itemId = urlMatch[2];
        } else {
          this.pageName = urlMatch[2];
        }
      } else {
        this.pageName = 'index';
      }
    }

    if (this.pageName === 'docsearch') {
      this.pageName = 'index';
      this.highlightDocSearchBox = true;
    }

    let configKey = this.section;

    if (configKey === 'documentation' && this.pageName === 'index') {
      this.setPageTitle('Documentation');
    } else {
      if (this.pageName !== 'index') {
        configKey += '/' + this.pageName;
      }
      const pageConfig = this.appConfig.documentation.pages[configKey];

      if (pageConfig) {
        this.setPageTitle('Documentation - ' + pageConfig);
      }
    }
  }

  ngAfterViewInit() {
    if (this.itemId) {
      const item = this.document.getElementById(this.itemId) as HTMLElement;
      if (item) {
        // hack to let images load
        setTimeout(() => {
          item.scrollIntoView();
        }, 300);
        setTimeout(() => {
          item.scrollIntoView();
        }, 1300);
      }
    }
  }

  scrollToPageTop(): void {
    this.window.scrollTo(0, 0);
  }

  ngOnInit(): void {
    this.scrollToPageTop();
    this.setSectPage(this.router.url);
    this.addAltmetrics();
    this.addDimensionsBadges();
  }

  private addAltmetrics(): void {

    // remove existing Altmetric script, then add again so the code is re-executed

    const existingAltmetricScript = window.document.querySelector('#altmetric-js-script');
    if (existingAltmetricScript) {
      existingAltmetricScript.remove();
    }

    const scripts = window.document.querySelectorAll('script');
    // clean up script tags added by Altmetrics
    scripts.forEach(script => {
      if (script.src.startsWith('https://api.altmetric.com')) {
        script.remove();
      }
    });

    // see: https://stackoverflow.com/questions/56880754/angular-5-using-the-altmetric-badge-in-the-angular-app-gives-uncaught-error-t
    const altmetricScript = this.renderer2.createElement('script');
    altmetricScript.id = 'altmetric-js-script';
    altmetricScript.type = 'text/javascript';
    altmetricScript.src = 'https://d1bxh8uas1mnw7.cloudfront.net/assets/embed.js';
    this.renderer2.appendChild(this.document.body, altmetricScript);
  }

  private addDimensionsBadges(): void {
    const script = this.renderer2.createElement('script');
    script.id = 'dimensions-js-script';
    script.type = 'text/javascript';
    script.async = true;
    script.src = 'https://badge.dimensions.ai/badge.js';
    this.renderer2.appendChild(this.document.body, script);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
