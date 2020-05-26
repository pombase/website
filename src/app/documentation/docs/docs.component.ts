import { Component, OnInit, Inject, OnDestroy, Renderer2, AfterViewInit } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { Title } from '@angular/platform-browser';

import { Router, ActivatedRoute, NavigationStart } from '@angular/router';

import { getAppConfig, AppConfig } from '../../config';
import { Subscription } from 'rxjs';
import { DOCUMENT } from '@angular/common';

const urlRe = new RegExp('/([^/]+)(?:/([^/]+))?');

@Component({
  selector: 'app-docs',
  templateUrl: './docs.component.html',
  styleUrls: ['./docs.component.css']
})
export class DocsComponent implements OnInit, OnDestroy, AfterViewInit {
  section: string = null;
  pageName: string = null;
  itemId: string = null;
  subscription: Subscription = null;
  appConfig: AppConfig = getAppConfig();

  constructor(private router: Router,
              private titleService: Title,
              private readonly meta: Meta,
              @Inject('Window') private window: any,
              private renderer2: Renderer2,
              @Inject(DOCUMENT) private document: any
             ) {
    this.subscription = router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.setSectPage(event.url);
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

    // see: https://stackoverflow.com/questions/56880754/angular-5-using-the-altmetric-badge-in-the-angular-app-gives-uncaught-error-t
    const s = this.renderer2.createElement('script');
    s.type = 'text/javascript';
    s.src = 'https://d1bxh8uas1mnw7.cloudfront.net/assets/embed.js';
    this.renderer2.appendChild(this.document.body, s);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
