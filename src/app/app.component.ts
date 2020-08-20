import { Component, OnInit, Inject } from '@angular/core';
import { Meta } from '@angular/platform-browser';

import { Router, ActivatedRoute, NavigationEnd, Data } from '@angular/router';
import { Title } from '@angular/platform-browser';

import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';

import { Angulartics2GoogleAnalytics } from 'angulartics2/ga';

import { getAppConfig } from './config';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  siteName = getAppConfig().site_name;
  defaultDescription = getAppConfig().site_description;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private titleService: Title,
    private meta: Meta,
    @Inject('Window') private window: any,
    private angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics) { }

  ngOnInit() {
    this.router.events
      .filter(event => event instanceof NavigationEnd)
      .map(() => this.activatedRoute)
      .map(route => {
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      })
      .filter(route => route.outlet === 'primary')
      .mergeMap(route => route.data)
      .subscribe((event: Data) => {
        if (event.defaultTitleDetail) {
          const title = this.siteName + ' - ' + event.defaultTitleDetail;
          this.titleService.setTitle(title);
          this.meta.updateTag({ property: 'og:title', content: title });
        }
        this.window.scrollTo(0, 0);
      });
  }
}
