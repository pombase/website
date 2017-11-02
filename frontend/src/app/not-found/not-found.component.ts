import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Angulartics2GoogleAnalytics } from 'angulartics2/ga';

import { PombaseAPIService } from '../pombase-api.service';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css']
})
export class NotFoundComponent implements OnInit {
  path = '';

  constructor(private pombaseApiService: PombaseAPIService,
              private angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics,
              private router: Router) { }

  ngOnInit() {
    this.path = this.router.url;
    this.angulartics2GoogleAnalytics.exceptionTrack({
      fatal: false,
      description: 'unknown path: ' + this.path,
    });
    this.pombaseApiService.reportNotFound(this.path);
  }
}
