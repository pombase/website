import { Component, OnInit } from '@angular/core';
import { Meta } from '@angular/platform-browser';

import { Router, NavigationStart, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';

import { Angulartics2GoogleAnalytics } from 'angulartics2';

const defaultTitle = 'PomBase, the S. pombe genome database';
const defaultDescription = 'PomBase is a comprehensive database for the fission yeast ' +
  'Schizosaccharomyces pombe, providing structural and functional annotation, ' +
  'literature curation and access to large-scale data sets';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private titleService: Title,
    private meta: Meta,
    private angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics) { }

  ngOnInit() {
    this.router.events
      .filter(event => event instanceof NavigationStart)
      .map(() => this.activatedRoute)
      .map(route => {
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      })
      .filter(route => route.outlet === 'primary')
      .mergeMap(route => route.data)
      .subscribe((event) => {
        console.log(event['title']);
        let title = defaultTitle;
        this.titleService.setTitle(title);
        this.meta.updateTag({property: 'og:title', content: title});
        this.meta.updateTag({property: 'og:description', content: defaultDescription});
      });
  }
}
