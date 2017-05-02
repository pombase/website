import { Component, OnInit } from '@angular/core';

import { getAppConfig, TermAndName } from '../config';

@Component({
  selector: 'app-go-slim-table',
  templateUrl: './go-slim-table.component.html',
  styleUrls: ['./go-slim-table.component.css']
})
export class GoSlimTableComponent implements OnInit {

  goSlimTerms: Array<TermAndName> = getAppConfig().goSlimTerms;

  constructor() { }

  ngOnInit() {
  }
}
