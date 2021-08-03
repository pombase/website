import { Component, OnInit, Inject, AfterViewInit } from '@angular/core';
import { DomSanitizer, Meta, SafeHtml } from '@angular/platform-browser';

import { Router, ActivatedRoute, NavigationEnd, Data } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { filter, map, mergeMap } from 'rxjs/operators';

import { FooterLogoConfig, getAppConfig } from './config';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  siteName = getAppConfig().site_name;
  defaultDescription = getAppConfig().site_description;
  logoFileName = getAppConfig().logo_file_name;
  headerBackgroundFileName = getAppConfig().header_background_file_name;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private titleService: Title,
    private meta: Meta,
    private sanitizer: DomSanitizer,
    @Inject('Window') private window: any) { }

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.activatedRoute),
      map((route: ActivatedRoute) => {
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      }),
      filter((route: ActivatedRoute) => route.outlet === 'primary'),
      mergeMap((route: ActivatedRoute) => route.data)
    )
    .subscribe((event: Data) => {
      if (event.defaultTitleDetail) {
        const title = this.siteName + ' - ' + event.defaultTitleDetail;
        this.titleService.setTitle(title);
        this.meta.updateTag({ property: 'og:title', content: title });
      }
      this.window.scrollTo(0, 0);
    });
  }

  getFundersHtml(): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(getAppConfig().footer.funders);
  }

  getLogoConfig(): Array<FooterLogoConfig> {
    return getAppConfig().footer.logos;
  }

  ngAfterViewInit(): void {
    const twttr = (<any>window).twttr;
    if (twttr) {
      twttr.widgets.load();
    }
  }
}
