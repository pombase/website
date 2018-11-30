import { Component, OnInit, Input } from '@angular/core';

import { Angulartics2GoogleAnalytics } from 'angulartics2/ga';

import { PombaseAPIService } from '../../pombase-api.service';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css']
})
export class NotFoundComponent implements OnInit {
  @Input() path: string;

  constructor(private pombaseApiService: PombaseAPIService,
              private angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics) { }

  ngOnInit() {
    this.angulartics2GoogleAnalytics.exceptionTrack({
      fatal: false,
      description: 'unknown path: ' + this.path,
    });
    this.pombaseApiService.reportNotFound(this.path);
  }
}
