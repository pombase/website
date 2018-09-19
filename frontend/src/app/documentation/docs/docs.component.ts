import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { Title } from '@angular/platform-browser';

import { Router, ActivatedRoute, NavigationStart } from '@angular/router';

import { getAppConfig, AppConfig } from '../../config';

const urlRe = new RegExp('/([^/]+)(?:/([^/]+))?');

@Component({
  selector: 'app-docs',
  templateUrl: './docs.component.html',
  styleUrls: ['./docs.component.css']
})
export class DocsComponent implements OnInit, OnDestroy {
  section: string = null;
  pageName: string = null;
  subscription = null;
  appConfig: AppConfig = getAppConfig();

  constructor(private route: ActivatedRoute,
              private router: Router,
              private titleService: Title,
              private readonly meta: Meta,
              @Inject('Window') private window: any
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
    if ($event.srcElement.localName.match(/^h\d$/i)) {
      this.router.navigate([route]);
      this.setPageTitle('FAQ - ' + heading);
    }
  }

  setSectPage(url: string) {
    const urlMatch = urlRe.exec(url);
    if (urlMatch) {
      this.section = urlMatch[1];
      if (urlMatch[2]) {
        this.pageName = urlMatch[2];
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
      const pageConfig = this.appConfig.documentation[configKey];

      if (pageConfig) {
        this.setPageTitle('Documentation - ' + pageConfig);
      }
    }
  }

  scrollToPageTop(): void {
    this.window.scrollTo(0, 0);
  }

  ngOnInit(): void {
    this.scrollToPageTop();
    this.setSectPage(this.router.url);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
