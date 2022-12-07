import { Component, OnInit, Inject, OnDestroy, Renderer2, AfterViewInit } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { Title } from '@angular/platform-browser';

import { Router, NavigationStart } from '@angular/router';

import { getAppConfig, AppConfig } from '../../config';
import { DeployConfigService } from '../../deploy-config.service'
import { Subscription } from 'rxjs';
import { DOCUMENT } from '@angular/common';

const urlRe = new RegExp('/([^/]+)(?:/([^/]+))?');

@Component({
  selector: 'app-docs',
  templateUrl: './docs.component.html',
  styleUrls: ['./docs.component.css']
})
export class DocsComponent implements OnInit, OnDestroy, AfterViewInit {
  section: string;
  pageName: string;
  itemId: string;
  subscription: Subscription;
  appConfig: AppConfig = getAppConfig();
  highlightDocSearchBox = false;

  constructor(private router: Router,
              private titleService: Title,
              public deployConfigService: DeployConfigService,
              private readonly meta: Meta,
              @Inject('Window') private window: any,
              private renderer2: Renderer2,
              @Inject(DOCUMENT) private document: any
             ) {
    this.subscription = router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.setSectPage(event.url);
        this.addAltmetrics();
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

  setSectPage(url: string) {
    const realUrl = this.appConfig.docPageAliases[url];
    if (realUrl) {
      url = realUrl;
    }
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

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
