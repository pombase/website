import { Component, OnInit, Inject, AfterViewInit } from '@angular/core';
import { Meta } from '@angular/platform-browser';

import { Router, ActivatedRoute, NavigationEnd, Data } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { filter, map, mergeMap } from 'rxjs/operators';

import { getAppConfig } from './config';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  siteName = getAppConfig().site_name;
  defaultDescription = getAppConfig().site_description;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private titleService: Title,
    private meta: Meta,
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

  ngAfterViewInit(): void {
    const twttr = (<any>window).twttr;
    if (twttr) {
      twttr.widgets.load();
    }
  }
}
